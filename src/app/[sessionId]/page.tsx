"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { getGuestToken } from "@/app/actions/boltActions";
import ChatInterface from "@/components/ChatInterface";
import JoinForm from "@/components/JoinForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

type PageStatus = "initializing" | "joining" | "ready" | "chatting" | "error";

export default function ParticipantPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [status, setStatus] = useState<PageStatus>("initializing");
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = useCallback(
    async (name: string) => {
      if (!sessionId) {
        setError("No Session ID found in the URL.");
        setStatus("error");
        return;
      }

      setStatus("joining");
      setError(null);

      try {
        const result = await getGuestToken(sessionId, name);

        if (result.success && result.data?.guestToken) {
          setGuestToken(result.data.guestToken);
          setDisplayName(name);
          localStorage.setItem(`chat-display-name-${sessionId}`, name);
          setStatus("chatting");
        } else {
          setError(result.message || "Could not join the session.");
          localStorage.removeItem(`chat-display-name-${sessionId}`);
          setStatus("error");
        }
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "An unexpected error occurred.";
        setError(errorMessage);
        setStatus("error");
      }
    },
    [sessionId]
  );

  useEffect(() => {
    if (!sessionId) {
      setStatus("ready");
      return;
    }

    try {
      const savedDisplayName = localStorage.getItem(
        `chat-display-name-${sessionId}`
      );
      if (savedDisplayName) {
        handleJoin(savedDisplayName);
      } else {
        setStatus("ready");
      }
    } catch (e) {
      console.error("Failed to access localStorage", e);
      setStatus("ready");
    }
  }, [sessionId, handleJoin]);

  if (status === "initializing") {
    return <LoadingSpinner message="Initializing session..." />;
  }

  if (status === "joining") {
    return <LoadingSpinner message="Joining session, please wait..." />;
  }

  if (status === "error" && error) {
    return <ErrorMessage message={error} />;
  }

  if (status === "chatting" && guestToken && displayName) {
    return (
      <ChatInterface
        token={guestToken}
        displayName={displayName}
        sessionId={sessionId}
      />
    );
  }

  // Default to 'ready' status
  return <JoinForm onJoin={handleJoin} isLoading={(status as string) === "joining"} />;
}