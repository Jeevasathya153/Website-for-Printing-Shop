// Backend API base URL
const API_BASE_URL = "http://localhost:5001/api";

// Send contact message
export async function sendContactMessage(contactData) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });
    
    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server is not responding. Please make sure the backend server is running on http://localhost:5001");
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to send message");
    }
    
    return data;
  } catch (error) {
    if (error.message.includes("fetch")) {
      throw new Error("Cannot connect to server. Please ensure the backend is running on http://localhost:5001");
    }
    throw error;
  }
}
