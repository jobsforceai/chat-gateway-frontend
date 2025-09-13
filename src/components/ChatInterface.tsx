"use client";

import {
  useEffect,
  useRef,
  useState,
  FormEvent,
  KeyboardEvent,
  useMemo,
} from "react";
import { socketService } from "@/lib/socket";
import {
  Paperclip,
  Send,
  Users,
  Clock,
  Sparkles,
  Code,
  Image as ImageIcon,
  X,
} from "lucide-react";

type MessageKind = "text" | "code" | "image";

interface Message {
  sender: string;
  message: string;
  timestamp?: number;
  kind?: MessageKind;
  // For images
  imageUrl?: string;
  imageName?: string;
}

interface ChatInterfaceProps {
  token: string;
  displayName: string;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const Bubble = ({ isSelf, msg }: { isSelf: boolean; msg: Message }) => {
  const time = useMemo(() => {
    const d = new Date(msg.timestamp ?? Date.now());
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [msg.timestamp]);

  const wrap = (children: React.ReactNode) => (
    <div className={`flex w-full ${isSelf ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ring-1",
          isSelf
            ? "bg-gradient-to-br from-blue-600 to-indigo-500 text-white ring-blue-400/30"
            : "bg-slate-800/70 text-slate-100 ring-slate-600/40",
        ].join(" ")}
      >
        <div className="mb-1 flex items-center gap-2">
          <span
            className={[
              "text-xs font-semibold tracking-wide",
              isSelf ? "text-white/80" : "text-slate-300/90",
            ].join(" ")}
          >
            {msg.sender}
          </span>
          <span
            className={[
              "text-[10px]",
              isSelf ? "text-white/60" : "text-slate-400",
            ].join(" ")}
          >
            {time}
          </span>
          {msg.kind === "code" && (
            <span className="rounded bg-black/20 px-1.5 py-0.5 text-[10px]">
              code
            </span>
          )}
          {msg.kind === "image" && (
            <span className="rounded bg-black/20 px-1.5 py-0.5 text-[10px]">
              image
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );

  if (msg.kind === "image" && msg.imageUrl) {
    return wrap(
      <div className="space-y-2">
        <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={msg.imageUrl}
            alt={msg.imageName ?? "uploaded image"}
            className="max-h-[320px] w-full object-contain"
          />
        </div>
        {msg.message ? <p className="text-sm">{msg.message}</p> : null}
      </div>
    );
  }

  if (msg.kind === "code") {
    return wrap(
      <pre className="max-w-full overflow-x-auto rounded-lg bg-black/30 p-3 text-xs leading-relaxed">
        <code className="font-mono">{msg.message}</code>
      </pre>
    );
  }

  // default text
  return wrap(
    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.message}</p>
  );
};

const EmptyState = () => (
  <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-300">
    <div className="rounded-2xl bg-slate-800/60 p-4 ring-1 ring-slate-700/60 backdrop-blur">
      <Sparkles className="h-6 w-6" />
    </div>
    <p className="text-sm">
      Start the conversation.{" "}
      <span className="text-slate-400">
        Everyone sees messages in real-time.
      </span>
    </p>
  </div>
);

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  token,
  displayName,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState(0);
  const [ttlSeconds, setTtlSeconds] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(true);

  // Composer state
  const [composeMode, setComposeMode] = useState<MessageKind>("text"); // 'text' | 'code'
  const [textValue, setTextValue] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const attachBtnRef = useRef<HTMLButtonElement>(null);

  const timeRemaining = useMemo(
    () => (ttlSeconds !== null ? formatTime(Math.max(0, ttlSeconds)) : "—"),
    [ttlSeconds]
  );

  useEffect(() => {
    setConnecting(true);
    socketService.connect(token);

    socketService.onMessageReceived((message: Message) => {
      const withTs: Message = {
        ...message,
        timestamp: message.timestamp ?? Date.now(),
        kind: message.kind ?? "text",
      };
      setMessages((prev) => [...prev, withTs]);
    });

    socketService.onUpdate(
      (data: { participantCount: number; ttlSeconds: number }) => {
        setParticipants(data.participantCount);
        setTtlSeconds(data.ttlSeconds);
        setConnecting(false);
      }
    );

    return () => socketService.disconnect();
  }, [token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  useEffect(() => {
    if (ttlSeconds === null) return;
    const id = setInterval(() => {
      setTtlSeconds((s) => (typeof s === "number" ? Math.max(0, s - 1) : s));
    }, 1000);
    return () => clearInterval(id);
  }, [ttlSeconds]);

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!showAttachMenu) return;
      const target = e.target as Node;
      if (
        attachBtnRef.current &&
        !attachBtnRef.current.contains(target) &&
        !(document.getElementById("attach-menu")?.contains(target) ?? false)
      ) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showAttachMenu]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const value = textValue.trim();
    if (!value) return;

    const optimistic: Message = {
      sender: displayName,
      message: value,
      timestamp: Date.now(),
      kind: composeMode,
    };
    setMessages((prev) => [...prev, optimistic]);

    // Send via socket (simple API). If your backend supports rich kinds, send `kind` too.
    try {
      socketService.sendMessage(
        composeMode === "code" ? "```" + value + "```" : value
      );
    } catch {
      // ignore
    }

    setTextValue("");
    setComposeMode("text");
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (composeMode === "code") {
      // In code mode, Shift+Enter = newline; Enter without Shift = send.
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const form = (e.currentTarget as HTMLTextAreaElement).closest("form");
        form?.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
      return;
    }
    // Text mode: Enter sends
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = (e.currentTarget as HTMLInputElement).closest("form");
      form?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const openImagePicker = () => {
    setShowAttachMenu(false);
    fileInputRef.current?.click();
  };

  const onImagePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    // Optimistic local image bubble
    const optimistic: Message = {
      sender: displayName,
      message: "", // optional caption if you want
      timestamp: Date.now(),
      kind: "image",
      imageUrl: url,
      imageName: file.name,
    };
    setMessages((prev) => [...prev, optimistic]);

    // If your backend supports uploads, handle it here; for now we just send a marker
    try {
      socketService.sendMessage(`[image:${file.name}]`);
    } catch {
      // ignore
    }

    // reset input so same file can be re-picked later
    e.target.value = "";
  };

  return (
    <div className="chat-theme flex h-screen w-full items-stretch justify-center">
      <div className="mx-auto flex w-full max-w-5xl flex-col px-3 py-4 sm:px-6">
        {/* Header */}
        <header className="glass-panel header mb-3 rounded-2xl bg-slate-900/70 p-4 shadow-2xl ring-1 ring-slate-700/60 backdrop-blur-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-sm ring-1 ring-white/10">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="title text-white">Bolt Session</h1>
                <p className="subtitle">Real-time group chat</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <div className="chip">
                <Users className="h-4 w-4" />
                <span className="tabular-nums">{participants}</span>
                <span className="text-slate-400">/ 5</span>
              </div>
              <div className="chip">
                <Clock className="h-4 w-4" />
                <span className="tabular-nums">{timeRemaining}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Chat body */}
        <main className="glass-panel scroll-body flex-1 overflow-y-auto rounded-2xl bg-slate-900/70 p-4 ring-1 ring-slate-700/60 backdrop-blur-lg">
          {connecting && messages.length === 0 ? (
            <div className="flex h-[40vh] items-center justify-center">
              <div className="animate-pulse rounded-xl bg-slate-800/70 px-4 py-3 text-sm text-slate-300 ring-1 ring-slate-700/60">
                Connecting to session…
              </div>
            </div>
          ) : messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <Bubble
                  key={idx}
                  isSelf={msg.sender === displayName}
                  msg={msg}
                />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </main>

        {/* Composer */}
        <footer className="mt-3">
          <form
            onSubmit={handleSend}
            className="composer group relative flex items-center gap-2 rounded-2xl bg-slate-900/80 p-2 ring-1 ring-slate-700/60 backdrop-blur-lg"
            aria-label="Send a message"
          >
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImagePicked}
            />

            {/* Attach (paperclip) with dropdown */}
            <div className="relative">
              <button
                ref={attachBtnRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={showAttachMenu}
                aria-label="Attach"
                title="Attach"
                onClick={() => setShowAttachMenu((s) => !s)}
                className="icon-btn"
              >
                <Paperclip className="h-5 w-5" />
              </button>

              {showAttachMenu && (
                <div
                  id="attach-menu"
                  role="menu"
                  className="absolute left-0 -top-20 z-20 mt-2 w-44 overflow-hidden rounded-xl bg-slate-900/95 p-1 text-sm shadow-2xl ring-1 ring-slate-700/60 backdrop-blur"
                >
                  <button
                    role="menuitem"
                    onClick={openImagePicker}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800/70"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Upload image
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setComposeMode("code");
                      setShowAttachMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800/70"
                  >
                    <Code className="h-4 w-4" />
                    Insert code
                  </button>
                </div>
              )}
            </div>

            {/* Composer input */}
            <div className="relative flex-1">
              {composeMode === "code" && (
                <div className="pointer-events-none absolute left-2 top-1.5 z-10 inline-flex items-center gap-1 rounded-md bg-black/30 px-2 py-0.5 text-[10px] text-slate-200 ring-1 ring-white/10">
                  <Code className="h-3 w-3" />
                  <span>Code</span>
                </div>
              )}

              {composeMode === "code" ? (
                <textarea
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write code… (Enter to send, Shift+Enter for newline)"
                  rows={3}
                  className="h-12 max-h-40 w-full resize-y rounded-xl bg-transparent px-3 pt-5 font-mono text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
                />
              ) : (
                <input
                  type="text"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message…"
                  className="h-12 w-full rounded-xl bg-transparent px-3 text-slate-200 placeholder:text-slate-500 focus:outline-none"
                  autoComplete="off"
                />
              )}
            </div>

            {/* Clear code mode chip */}
            {composeMode === "code" && (
              <button
                type="button"
                onClick={() => setComposeMode("text")}
                className="icon-btn"
                title="Exit code mode"
                aria-label="Exit code mode"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={!textValue.trim()}
              className="send-btn inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium text-white"
              title="Send"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between px-2 text-xs text-slate-500">
            <p>
              {composeMode === "code" ? (
                <>
                  Press{" "}
                  <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                    Enter
                  </kbd>{" "}
                  to send •{" "}
                  <span className="text-slate-400">
                    Shift+Enter for newline
                  </span>
                </>
              ) : (
                <>
                  Press{" "}
                  <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                    Enter
                  </kbd>{" "}
                  to send
                </>
              )}
            </p>
            <p>
              You’re chatting as{" "}
              <span className="text-slate-300">{displayName}</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatInterface;
