"use client";

import { useState, FormEvent } from "react";
import { Sparkles } from "lucide-react";

interface JoinFormProps {
  onJoin: (displayName: string) => void;
  isLoading: boolean;
}

const JoinForm: React.FC<JoinFormProps> = ({ onJoin, isLoading }) => {
  const [displayName, setDisplayName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (displayName.trim() && !isLoading) {
      onJoin(displayName.trim());
    }
  };

  return (
    <div className="chat-theme flex h-screen items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-lg ring-1 ring-white/10">
          <Sparkles className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Join Bolt Session</h1>
        <p className="mt-2 text-slate-300">Enter your name to join the chat.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="displayName" className="sr-only font-bold">
              Your Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-xl border-none bg-slate-900/70 p-4 text-center text-white placeholder-slate-400 ring-1 ring-slate-700/60 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter your name..."
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="action-btn w-full py-4 text-lg font-bold cursor-pointer transition-all"
            disabled={isLoading || !displayName.trim()}
          >
            {isLoading ? "Joining..." : "Join Session"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinForm;
