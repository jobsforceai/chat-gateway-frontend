"use client";

import { useState, useEffect, FormEvent } from "react";
import { socketService } from "@/lib/socket";

interface Message {
  sender: string;
  message: string;
}

interface ChatInterfaceProps {
  token: string;
  displayName: string;
}

// Helper function to format seconds into HH:MM:SS
const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const padded = (num: number) => num.toString().padStart(2, '0');

  return `${padded(hours)}:${padded(minutes)}:${padded(seconds)}`;
};


const ChatInterface: React.FC<ChatInterfaceProps> = ({ token, displayName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    // Connect to the socket service
    socketService.connect(token);

    // Set up listeners
    socketService.onMessageReceived((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socketService.onUpdate((data) => {
      setParticipants(data.participantCount);
      setTimeRemaining(formatTime(data.ttlSeconds));
    });

    // Disconnect on component unmount
    return () => {
      socketService.disconnect();
    };
  }, [token]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Use the service to send the message
      socketService.sendMessage(newMessage);
      
      // Optimistically update the UI
      const messageData = { sender: displayName, message: newMessage };
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-300">
      <header className="bg-gray-800 border-b border-gray-700 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Bolt Session</h1>
        <div className="text-sm">
          <span>{participants}/5 Participants</span>
          <span className="ml-4">{timeRemaining} remaining</span>
        </div>
      </header>
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === displayName ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg p-3 max-w-xs ${
                  msg.sender === displayName
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                <p className="font-bold text-sm">{msg.sender}</p>
                <p>{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="bg-gray-800 border-t border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-600 rounded-l-lg p-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-r-lg px-4 hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatInterface;
