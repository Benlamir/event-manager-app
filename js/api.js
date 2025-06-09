// The base URL of your live API Gateway endpoint
// IMPORTANT: Replace this with the URL from your 'sam deploy' output
const API_BASE_URL = 'https://e7rli8hasl.execute-api.us-east-1.amazonaws.com';

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

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to get event details:", error);
        // In a real app, you'd show this error to the user
        return []; // Return an empty array on failure
    }
} 