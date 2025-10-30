"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinSessionForm() {
  const [sessionCode, setSessionCode] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionCode.trim()) {
      router.push(`/${sessionCode.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex justify-center">
      <input
        type="text"
        value={sessionCode}
        onChange={(e) => setSessionCode(e.target.value)}
        placeholder="Enter session code..."
        className="w-full max-w-xs px-4 py-3 rounded-l-full border-t border-b border-l border-slate-700 bg-slate-800/40 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-r-full transition-all transform hover:scale-105 shadow-lg"
      >
        Join
      </button>
    </form>
  );
}
