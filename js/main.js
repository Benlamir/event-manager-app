// js/main.js (Final Version)
import { getEventDetails, createEvent, listEvents } from './api.js';
import { renderEventDetails, renderEventList } from './ui.js';

// --- DOM Element References ---
const addEventBtn = document.getElementById('add-event-btn');
const createEventModal = document.getElementById('create-event-modal');
const createEventForm = document.getElementById('create-event-form');
const eventListContainer = document.getElementById('event-list');

// --- Functions ---

function showCreateEventModal() {
    createEventModal.classList.remove('hidden');
}

// ** RESTORED "WARN ON CLOSE" LOGIC **
function hideCreateEventModal() {
    const eventNameInput = document.getElementById('eventName');
    if (eventNameInput.value.trim() !== '') {
        const userIsSure = confirm("You have unsaved changes. Are you sure you want to close?");
        if (!userIsSure) {
            return;
        }
    }
    createEventForm.reset();
    createEventModal.classList.add('hidden');
}

async function handleCreateEventSubmit(event) {
    event.preventDefault();
    const eventData = {
        eventName: document.getElementById('eventName').value,
        eventDate: "2026-05-20T19:00:00Z", // Placeholder
        capacity: 16, // Placeholder
        description: "Event created from the UI!",
    };
    const result = await createEvent(eventData);
    if (result.eventId) {
        alert(`Event created successfully!`);
        hideCreateEventModal();
        loadInitialEvents(); // Refresh the event list after creating a new one
    } else {
        alert("Failed to create event.");
    }
}

// ** NEW: Fetches and displays the list of events in the sidebar **
async function loadInitialEvents() {
    console.log("Fetching all events...");
    const events = await listEvents();
    renderEventList(events);
}

// ** NEW: Handles clicks on an event in the sidebar **
async function handleEventClick(event) {
    const clickedItem = event.target.closest('.event-list-item');
    if (!clickedItem) return;

    const eventId = clickedItem.dataset.eventId;
    console.log(`Sidebar item clicked. Fetching details for event: ${eventId}`);
    
    const eventDetails = await getEventDetails(eventId);
    renderEventDetails(eventDetails);
}

// --- Main Execution ---
document.addEventListener('DOMContentLoaded', () => {
    addEventBtn.addEventListener('click', showCreateEventModal);
    createEventForm.addEventListener('submit', handleCreateEventSubmit);
    eventListContainer.addEventListener('click', handleEventClick); // Listen for clicks on the sidebar

    createEventModal.addEventListener('click', (event) => {
        if (event.target === createEventModal) {
            hideCreateEventModal();
        }
    });

    // Load the list of events when the page starts
    loadInitialEvents();
});