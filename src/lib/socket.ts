import { io, Socket } from "socket.io-client";

// Define the types for the data we expect from the server
interface ServerToClientEvents {
  newMessage: (payload: {
    from: { name: string };
    type: "text" | "code" | "image";
    content: string;
    imageUrl?: string;
    imageName?: string;
  }) => void;
  presenceUpdate: (payload: {
    participantCount: number;
    ttlSeconds: number;
  }) => void;
  error: (payload: { code: string; message: string }) => void;
}

// Define the types for the events we send to the server
interface ClientToServerEvents {
  join: () => void;
  sendMessage: (payload: {
    type: "text" | "code" | "image";
    content: string;
    imageUrl?: string;
    imageName?: string;
  }) => void;
}

class SocketService {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

  connect(token: string) {
    // Prevent multiple connections
    if (this.socket) return;

    const gatewayUrl =
      process.env.NEXT_PUBLIC_CHAT_GATEWAY_URL || "ws://localhost:8081";

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

  sendMessage(payload: {
    type: "text" | "code" | "image";
    content: string;
    imageUrl?: string;
    imageName?: string;
  }) {
    this.socket?.emit("sendMessage", payload);
  }

  // Subscribe to incoming messages
  onMessageReceived(
    callback: (payload: {
      from: { name: string };
      type: "text" | "code" | "image";
      content: string;
      imageUrl?: string;
      imageName?: string;
    }) => void
  ) {
    this.socket?.on("newMessage", callback);
  }

  // Subscribe to presence updates
  onUpdate(
    callback: (payload: { participantCount: number; ttlSeconds: number }) => void
  ) {
    this.socket?.on("presenceUpdate", callback);
  }

  // Subscribe to error messages
  onError(callback: (payload: { code: string; message: string }) => void) {
    this.socket?.on("error", callback);
  }
}

// Export a singleton instance
export const socketService = new SocketService();
