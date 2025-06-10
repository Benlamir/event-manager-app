// Main JavaScript file for the Event Manager Dashboard
// This will be populated with our application logic in the next steps

// Import functions from our modules
import { getEventDetails, createEvent } from "./api.js";
import { renderEventDetails, renderEventList } from "./ui.js";

// --- DOM Element References ---
// We get references to all the elements we need to interact with
const addEventBtn = document.getElementById("add-event-btn");
const createEventModal = document.getElementById("create-event-modal");
const cancelCreateBtn = document.getElementById("cancel-create-btn");
const createEventForm = document.getElementById("create-event-form");
const eventListContainer = document.getElementById("event-list");

// Debug: Log if elements are found
console.log("Add Event Button:", addEventBtn);
console.log("Create Event Modal:", createEventModal);
console.log("Cancel Create Button:", cancelCreateBtn);
console.log("Create Event Form:", createEventForm);
console.log("Event List Container:", eventListContainer);

// --- Functions ---

// Shows the "Create Event" modal
function showCreateEventModal() {
  console.log("Showing modal...");
  createEventModal.classList.remove("hidden");
  console.log("Modal classes after showing:", createEventModal.classList);
}

// Hides the "Create Event" modal
function hideCreateEventModal() {
  console.log("Hiding modal...");
  createEventModal.classList.add("hidden");
  console.log("Modal classes after hiding:", createEventModal.classList);
  createEventForm.reset();
}

// Handles the submission of the "Create Event" form
async function handleCreateEventSubmit(event) {
  event.preventDefault(); // Prevent the default form submission (which reloads the page)

  // Get the values from the form inputs
  const eventData = {
    eventName: document.getElementById("eventName").value,
    eventDate: document.getElementById("eventDate").value,
    capacity: parseInt(document.getElementById("capacity").value, 10),
    description: document.getElementById("description").value,
  };

  console.log("Submitting new event data:", eventData);

  const result = await createEvent(eventData);

  if (result.eventId) {
    alert(`Event created successfully! New Event ID: ${result.eventId}`);
    hideCreateEventModal();

    // ** THE CLOSED LOOP **
    // Immediately fetch and display the event we just created
    const fullEventDetails = await getEventDetails(result.eventId);
    renderEventDetails(fullEventDetails);
  } else {
    alert("Failed to create event. Check the console for errors.");
  }
}

async function loadAndDisplayEvent() {
  // We will get a fresh ID in the next steps.
  const eventId = "e75f8180-43c4-4bc3-bfa9-107fbc41fd76";

  console.log(`Fetching data for event: ${eventId}`);
  const eventData = await getEventDetails(eventId);
  console.log("Data received from API:", eventData);

  renderEventDetails(eventData);
}

// --- Main Execution ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded");

  // --- Event Listeners ---
  if (addEventBtn) {
    console.log("Adding click listener to add event button");
    addEventBtn.addEventListener("click", showCreateEventModal);
  } else {
    console.error("Add Event Button not found!");
  }

  if (cancelCreateBtn) {
    console.log("Adding click listener to cancel button");
    cancelCreateBtn.addEventListener("click", hideCreateEventModal);
  } else {
    console.error("Cancel Create Button not found!");
  }

  if (createEventForm) {
    console.log("Adding submit listener to form");
    createEventForm.addEventListener("submit", handleCreateEventSubmit);
  } else {
    console.error("Create Event Form not found!");
  }

  // For now, we'll just load one event to test.
  loadAndDisplayEvent();
});
