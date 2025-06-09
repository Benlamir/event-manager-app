// Main JavaScript file for the Event Manager Dashboard
// This will be populated with our application logic in the next steps 

// Import functions from our modules
import { getEventDetails } from './api.js';
import { renderEventDetails } from './ui.js';

// This function runs when the page loads
async function loadAndDisplayEvent() {
    // For this test, let's use the eventId from our last successful curl test
    const eventId = "916a1425-08c0-4f87-9321-6956a71e2f9f"; // Use a real ID from your tests

    console.log(`Fetching data for event: ${eventId}`);
    const eventData = await getEventDetails(eventId);
    console.log("Data received from API:", eventData);

    // Instead of just logging, let's render the data to the page!
    renderEventDetails(eventData);
}

// Wait for the entire HTML document to be loaded and ready before running the script
document.addEventListener('DOMContentLoaded', () => {
    // We are simplifying for now and removing the tab logic
    // We will add it back later when we build the other panels

    // Load initial data when the page loads
    loadAndDisplayEvent();
}); 