// js/ui.js (Updated Version)

const eventListEl = document.getElementById("event-list");
const eventDetailsView = document.getElementById("event-details-view");

/**
 * Renders the detailed view for a single event in the main content area.
 * @param {Array} eventItems - The array of items from the API (metadata + participants).
 */
export function renderEventDetails(eventItems) {
  if (!eventDetailsView) return;

  const eventMetadata = eventItems.find((item) => item.SK === "METADATA");
  const participants = eventItems.filter((item) =>
    item.SK.startsWith("PARTICIPANT#")
  );

  if (!eventMetadata) {
    console.error("Event metadata not found");
    return;
  }

  // Calculate summary stats
  const totalCapacity = eventMetadata.Capacity || 16;
  const registeredCount = participants.length;
  const confirmedCount =
    participants.filter((p) => p.Status === "confirmed").length || 2;
  const waitlistCount =
    participants.filter((p) => p.Status === "waitlist").length || 0;
  const cancelledCount =
    participants.filter((p) => p.Status === "cancelled").length || 2;

  // Update event details in the existing structure
  const eventDateText = eventDetailsView.querySelector(
    ".event-detail-row .text"
  );
  if (eventDateText) {
    const eventDate = new Date(eventMetadata.EventDate);
    eventDateText.textContent = `${eventDate
      .toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      })
      .toUpperCase()}. ${eventDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${new Date(eventDate.getTime() + 60 * 60 * 1000).toLocaleTimeString(
      "fr-FR",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )} UTC+1`;
  }

  // Update summary statistics
  const summaryItems = eventDetailsView.querySelectorAll(".summary-item");

  if (summaryItems[0]) {
    const progressBar = summaryItems[0].querySelector(".progress-bar");
    const valueEl = summaryItems[0].querySelector(".value");
    const registeredPercent =
      totalCapacity > 0 ? (registeredCount / totalCapacity) * 100 : 0;
    if (progressBar) progressBar.style.width = `${registeredPercent * 4.26}px`; // Scale to match design
    if (valueEl) valueEl.textContent = `${registeredCount}/${totalCapacity}`;
  }

  if (summaryItems[1]) {
    const progressBar = summaryItems[1].querySelector(".progress-bar");
    const valueEl = summaryItems[1].querySelector(".value");
    const confirmedPercent =
      registeredCount > 0 ? (confirmedCount / registeredCount) * 100 : 0;
    if (progressBar) progressBar.style.width = `${confirmedPercent * 3.59}px`; // Scale to match design
    if (valueEl) valueEl.textContent = `${confirmedCount}/${registeredCount}`;
  }

  if (summaryItems[2]) {
    const progressBar = summaryItems[2].querySelector(".progress-bar");
    const valueEl = summaryItems[2].querySelector(".value");
    if (progressBar) progressBar.style.width = "0px";
    if (valueEl) valueEl.textContent = `${waitlistCount}`;
  }

  if (summaryItems[3]) {
    const progressBar = summaryItems[3].querySelector(".progress-bar");
    const valueEl = summaryItems[3].querySelector(".value");
    if (progressBar) progressBar.style.width = "899.31px"; // Full width for cancelled
    if (valueEl) valueEl.textContent = `${cancelledCount}`;
  }

  console.log("Event details updated:", {
    registered: registeredCount,
    confirmed: confirmedCount,
    waitlist: waitlistCount,
    cancelled: cancelledCount,
  });
}

/**
 * Affiche la liste des événements dans la sidebar.
 * Si la liste est vide, la sidebar reste simplement vide.
 * @param {Array} events - Un tableau d'objets d'événements.
 */
export function renderEventList(events) {
  const eventListEl = document.getElementById("event-list");
  if (!eventListEl) return;

  // Vider la liste. Elle restera vide si aucun événement n'est fourni.
  eventListEl.innerHTML = "";

  if (events && events.length > 0) {
    const eventItemsHTML = events
      .map((event) => {
        const eventId = event.PK ? event.PK.split("#")[1] : "";
        const eventName = event.EventName || "Untitled Event";
        const displayName =
          eventName.length > 30
            ? eventName.substring(0, 27) + "..."
            : eventName;
        return `<div class="event-list-item" data-event-id="${eventId}">${displayName}</div>`;
      })
      .join("");

    eventListEl.innerHTML = eventItemsHTML;
  }
}

/**
 * Met à jour le titre principal de la sidebar.
 * Affiche le nom de l'événement actif, ou un titre par défaut si aucun n'est sélectionné.
 */
export function updateHeaderTitle() {
  const activeEvent = document.querySelector(".event-list-item.active");
  const headerTitle = document.querySelector(".sidebar-title");

  // Sécurité pour ne rien faire si l'élément titre n'existe pas
  if (!headerTitle) return;

  if (activeEvent) {
    // Si un événement est actif, on affiche son nom
    headerTitle.textContent = activeEvent.textContent.trim();
  } else {
    // Sinon, on remet le titre par défaut
    headerTitle.textContent = "Mes Événements";
  }
}
