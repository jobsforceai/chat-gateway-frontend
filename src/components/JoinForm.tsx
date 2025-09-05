"use client";

import { useState, FormEvent } from "react";

interface JoinFormProps {
  onJoin: (displayName: string) => void;
  isLoading: boolean;
}

const JoinForm: React.FC<JoinFormProps> = ({ onJoin, isLoading }) => {
  const [displayName, setDisplayName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) {
      onJoin(displayName);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-300">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm border border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-center text-white">Join Bolt Session</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="displayName" className="block text-gray-400 mb-2">
              Your Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border border-gray-600 rounded-lg p-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter your name..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg p-2 disabled:bg-gray-500 hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Joining..." : "Join"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinForm;
