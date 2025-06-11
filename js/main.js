// js/main.js (Updated Version)
import { getEventDetails, createEvent, listEvents } from "./api.js";
import { renderEventDetails, renderEventList } from "./ui.js";

// --- DOM Element References ---
const addEventBtn = document.getElementById("add-event-btn");
const createEventModal = document.getElementById("create-event-modal");
const createEventForm = document.getElementById("create-event-form");
const eventListContainer = document.getElementById("event-list");
const initialView = document.querySelector(".initial-view");
const eventDetailsView = document.getElementById("event-details-view");

// --- Functions ---
function showCreateEventModal() {
  if (createEventModal) createEventModal.classList.remove("hidden");
}

function hideCreateEventModal() {
  if (createEventForm) createEventForm.reset();
  if (createEventModal) createEventModal.classList.add("hidden");
}

function showEventDetails() {
  if (initialView) initialView.style.display = "none";
  if (eventDetailsView) eventDetailsView.style.display = "block";
}

function showInitialView() {
  if (initialView) initialView.style.display = "flex";
  if (eventDetailsView) eventDetailsView.style.display = "none";
}

async function handleCreateEventSubmit(event) {
  event.preventDefault();
  const eventData = {
    eventName: document.getElementById("eventName").value,
    eventDate:
      document.getElementById("eventDate")?.value || "2026-01-01T12:00:00Z",
    capacity: parseInt(document.getElementById("capacity")?.value, 10) || 16,
    description: document.getElementById("description")?.value || "",
  };

  const result = await createEvent(eventData);
  if (result.eventId) {
    alert(`Event created successfully!`);
    hideCreateEventModal();
    loadInitialEvents();
  } else {
    alert("Failed to create event.");
  }
}

async function loadInitialEvents() {
  console.log("Fetching all events...");
  const events = await listEvents();
  renderEventList(events);
}

async function handleEventClick(event) {
  const clickedItem = event.target.closest(".event-list-item");
  if (!clickedItem) return;

  // De-select all other items and select the clicked one
  document
    .querySelectorAll(".event-list-item")
    .forEach((item) => item.classList.remove("active"));
  clickedItem.classList.add("active");

  // Show event details
  showEventDetails();

  const eventId = clickedItem.dataset.eventId;
  console.log(`Fetching details for event: ${eventId}`);

  if (eventId) {
    const eventDetails = await getEventDetails(eventId);
    renderEventDetails(eventDetails);
  }
}

function handleTabClick(event) {
  const clickedTab = event.target.closest(".tab-link");
  if (!clickedTab) return;

  // Remove active class from all tabs
  document
    .querySelectorAll(".tab-link")
    .forEach((tab) => tab.classList.remove("active"));

  // Add active class to clicked tab
  clickedTab.classList.add("active");

  // Here you can add logic to show different tab content
  const tabName = clickedTab.dataset.tab;
  console.log(`Switched to tab: ${tabName}`);
}

// --- Main Execution ---
document.addEventListener("DOMContentLoaded", () => {
  // Add event listeners with null checks
  if (addEventBtn) {
    addEventBtn.addEventListener("click", showCreateEventModal);
    console.log("Add event button listener attached");
  } else {
    console.error("Add event button not found");
  }

  if (createEventForm)
    createEventForm.addEventListener("submit", handleCreateEventSubmit);
  if (eventListContainer)
    eventListContainer.addEventListener("click", handleEventClick);

  // Add tab navigation
  const tabNav = document.querySelector(".tab-nav");
  if (tabNav) tabNav.addEventListener("click", handleTabClick);

  if (createEventModal) {
    createEventModal.addEventListener("click", (event) => {
      if (event.target === createEventModal) {
        hideCreateEventModal();
      }
    });
  }

  // Load the list of events when the page starts
  loadInitialEvents();

  // Show initial view by default
  showInitialView();
});
