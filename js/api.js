// The base URL of your live API Gateway endpoint
// IMPORTANT: Replace this with the URL from your 'sam deploy' output
const API_BASE_URL = "http://127.0.0.1:3000";

/**
 * Fetches all data for a specific event (metadata and participants).
 * @param {string} eventId The ID of the event to fetch.
 * @returns {Promise<Array>} A promise that resolves to an array of items.
 */
export async function getEventDetails(eventId) {
  const url = `${API_BASE_URL}/events/${eventId}/participants`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // If the server response is not 2xx, throw an error
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to get event details:", error);
    // In a real app, you'd show this error to the user
    return []; // Return an empty array on failure
  }
}

/**
 * Creates a new event by sending data to the backend API.
 * @param {object} eventData The data for the new event.
 * @returns {Promise<object>} A promise that resolves to the API response.
 */
export async function createEvent(eventData) {
  const url = `${API_BASE_URL}/events`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create event:", error);
    // Return an object that indicates failure
    return { success: false, message: error.message };
  }
}

/**
 * Fetches a list of all event metadata items.
 * @returns {Promise<Array>} A promise that resolves to an array of events.
 */
export async function listEvents() {
  const url = `${API_BASE_URL}/events`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to list events:", error);
    return [];
  }
}

export async function deleteEvent(eventId) {
  const url = `${API_BASE_URL}/events/${eventId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    // Check if response has content before parsing as JSON
    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : { success: true };

  } catch (error) {
    console.error("Failed to delete event:", error);
    return { success: false, message: error.message };
  }
}

