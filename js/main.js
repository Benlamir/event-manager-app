// js/main.js
import { getEventDetails, createEvent, listEvents, deleteEvent } from "./api.js";
import {
  renderEventDetails,
  renderEventList,
  updateHeaderTitle,
} from "./ui.js";

// --- DOM Element References ---
const addEventBtn = document.getElementById("add-event-btn");
const createEventModal = document.getElementById("create-event-modal");
const createEventForm = document.getElementById("create-event-form");
const eventListContainer = document.getElementById("event-list");
const initialView = document.querySelector(".initial-view");
const eventDetailsView = document.getElementById("event-details-view");
const deleteEventBtn = document.getElementById("delete-event-btn"); // Référence au bouton supprimer

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
  } else if (result.message) {
    alert(`Error: ${result.message}`);
  } else {
    alert("An unknown error occurred while creating the event.");
  }
}

async function handleDeleteEvent() {
    const activeEvent = document.querySelector(".event-list-item.active");
    if (!activeEvent) {
        alert("Please select an event to delete.");
        return;
    }

    const eventId = activeEvent.dataset.eventId;
    const eventName = activeEvent.textContent.trim();

    if (confirm(`Are you sure you want to permanently delete the event "${eventName}"? This action cannot be undone.`)) {
        console.log(`Deleting event: ${eventId}`);
        const result = await deleteEvent(eventId);

        if (result.success) {
            alert(`Event "${eventName}" was deleted successfully.`);
            showInitialView();
            loadInitialEvents();
        } else {
            alert(`Failed to delete event. Error: ${result.message}`);
        }
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

  document
    .querySelectorAll(".event-list-item")
    .forEach((item) => item.classList.remove("active"));
  clickedItem.classList.add("active");

  const headerTitle = document.querySelector(".sidebar-title");
  if (headerTitle) {
    headerTitle.textContent = clickedItem.textContent.trim();
  }

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

  document
    .querySelectorAll(".tab-link")
    .forEach((tab) => tab.classList.remove("active"));
  clickedTab.classList.add("active");

  const tabName = clickedTab.dataset.tab;
  console.log(`Switched to tab: ${tabName}`);

  document.querySelectorAll(".tab-content").forEach(panel => {
      if(panel) panel.style.display = "none";
  });

  const contentToShow = document.getElementById(`${tabName}-tab-content`);
  if (contentToShow) {
      contentToShow.style.display = "block";
  }
}

// --- Main Execution ---
document.addEventListener("DOMContentLoaded", () => {
  // Add event listeners with null checks
  if (addEventBtn) {
    addEventBtn.addEventListener("click", showCreateEventModal);
  }

  if (createEventForm) {
    createEventForm.addEventListener("submit", handleCreateEventSubmit);
  }

  if (eventListContainer) {
    eventListContainer.addEventListener("click", handleEventClick);
  }
  
  // Attacher l'écouteur pour la suppression
  if(deleteEventBtn) {
    deleteEventBtn.addEventListener('click', handleDeleteEvent);
  }

  const tabNav = document.querySelector(".tab-nav");
  if (tabNav) {
    tabNav.addEventListener("click", handleTabClick);
  }

  if (createEventModal) {
    createEventModal.addEventListener("click", (event) => {
      if (event.target === createEventModal) {
        hideCreateEventModal();
      }
    });
  }

  loadInitialEvents();
  showInitialView();
  updateHeaderTitle();
});