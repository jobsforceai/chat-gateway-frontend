"use server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080/api/v1";

/**
 * Fetches a guest token from the backend to join a Bolt session.
 * @param sessionId The ID of the session to join.
 * @param displayName The name the guest will use in the chat.
 * @returns The server's JSON response.
 */
export async function getGuestToken(sessionId: string, displayName: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/bolt/guest-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, displayName }),
    });

    const data = await response.json();

    if (!response.ok) {
      // If the server returned an error (like "Room is full"),
      // use the message from the server.
      console.error("Failed to get guest token:", data.message);
      return {
        success: false,
        message: data.message || "An error occurred.",
      };
    }

    return data; // This will be the { success, message, data: { guestToken } } object
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return {
      success: false,
      message: "An unexpected network or server error occurred.",
    };
  }
}
