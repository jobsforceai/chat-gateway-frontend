// src/app/[sessionId]/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { getGuestToken } from "@/app/actions/boltActions";
import ChatInterface from "@/components/ChatInterface";
import JoinForm from "@/components/JoinForm"; // Import the new JoinForm

// You can create more visually appealing loading and error states
const LoadingComponent = () => (
  <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-300">
    <p className="text-lg">Joining session, please wait...</p>
  </div>
);

const ErrorComponent = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500">
    <div className="bg-gray-800 border border-red-500 p-6 rounded-lg">
      <p>Error: {message}</p>
    </div>
  </div>
);

export default function ParticipantPage() {
  const params = useParams();
  const rawSessionId = params.sessionId as string;
  // Extract only the session code from the parameter, in case a full URL was somehow passed.
  const sessionId = rawSessionId
    ? rawSessionId.substring(rawSessionId.lastIndexOf("/") + 1)
    : "";

  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // This function is called when the user submits their name
  const handleJoin = useCallback(
    async (name: string) => {
      if (!sessionId) {
        setError("No Session ID found in the URL.");
        return;
      }

      setIsLoading(true);
      setError(null);

      // Call the new 'getGuestToken' server action with both parameters
      const result = await getGuestToken(sessionId, name);

      if (result.success && result.data?.guestToken) {
        // If successful, store both the token and the name
        setGuestToken(result.data.guestToken);
        setDisplayName(name);
        try {
          localStorage.setItem(`chat-display-name-${sessionId}`, name);
        } catch (e) {
          console.error("Failed to save display name", e);
        }
      } else {
        // If it fails, store the error message from the backend
        setError(result.message || "Could not join the session.");
        try {
          localStorage.removeItem(`chat-display-name-${sessionId}`);
        } catch (e) {
          console.error("Failed to remove display name", e);
        }
      }

      setIsLoading(false);
    },
    [sessionId]
  );

  useEffect(() => {
    if (!sessionId) {
      setIsInitializing(false);
      return;
    }

    let savedDisplayName: string | null = null;
    try {
      savedDisplayName = localStorage.getItem(`chat-display-name-${sessionId}`);
    } catch (e) {
      console.error("Failed to read display name from localStorage", e);
    }

    if (savedDisplayName) {
      handleJoin(savedDisplayName).finally(() => {
        setIsInitializing(false);
      });
    } else {
      setIsInitializing(false);
    }
  }, [sessionId, handleJoin]);

  if (error) {
    return <ErrorComponent message={error} />;
  }

  if (isInitializing) {
    return <LoadingComponent />;
  }

  // If we have a token and a display name, the user is in the chat
  if (guestToken && displayName) {
    return (
      <ChatInterface
        token={guestToken}
        displayName={displayName}
        sessionId={sessionId}
      />
    );
  }

  // If we don't have a token yet, show the form to enter a display name
  return <JoinForm onJoin={handleJoin} isLoading={isLoading} />;
}