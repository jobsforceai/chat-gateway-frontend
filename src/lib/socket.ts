import { io, Socket } from "socket.io-client";

// Define the types for the data we expect from the server
interface ServerToClientEvents {
  newMessage: (payload: { sender: string; message: string }) => void;
  presenceUpdate: (payload: { participantCount: number; ttlSeconds: number }) => void;
}

// Define the types for the events we send to the server
interface ClientToServerEvents {
  join: () => void;
  sendMessage: (payload: { message: string }) => void;
}

class SocketService {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

  connect(token: string) {
    // Prevent multiple connections
    if (this.socket) return;

    const gatewayUrl = process.env.NEXT_PUBLIC_CHAT_GATEWAY_URL || "ws://localhost:8081";

    this.socket = io(gatewayUrl, {
      path: "/ws", // Specify the custom path for the WebSocket server
      auth: {
        token,
      },
    });

    this.socket.on("connect", () => {
      console.log("Successfully connected to the chat gateway!");
      // Tell the server we are ready to join the session's room.
      this.socket?.emit("join");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from chat gateway.");
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(message: string) {
    this.socket?.emit("sendMessage", { message });
  }

  // Subscribe to incoming messages
  onMessageReceived(callback: (payload: { sender: string; message: string }) => void) {
    this.socket?.on("newMessage", callback);
  }

  // Subscribe to presence updates
  onUpdate(callback: (payload: { participantCount: number; ttlSeconds: number }) => void) {
    this.socket?.on("presenceUpdate", callback);
  }
}

// Export a singleton instance
export const socketService = new SocketService();
