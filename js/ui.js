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
 * Renders the list of events into the sidebar.
 * @param {Array} events - An array of event metadata objects.
 */
export function renderEventList(events) {
  const eventListEl = document.getElementById("event-list");
  if (!eventListEl) {
    console.error("Event list container not found!");
    return;
  }

  // Si la liste est vide, afficher le message et s'arrêter.
  if (!events || events.length === 0) {
    eventListEl.innerHTML = '<div class="event-list-item">No events found.</div>';
    return;
  }

  // Si la liste n'est pas vide, construire une chaîne HTML pour tous les éléments.
  const eventItemsHTML = events.map(event => {
      const eventId = event.PK ? event.PK.split("#")[1] : '';
      const eventName = event.EventName || 'Untitled Event';

      // Tronquer les noms trop longs pour un meilleur affichage
      const displayName = eventName.length > 30 ? eventName.substring(0, 27) + "..." : eventName;

      // Retourner la chaîne de caractères HTML pour cet élément
      return `<div class="event-list-item" data-event-id="${eventId}">${displayName}</div>`;
  }).join(""); // .join("") transforme le tableau de chaînes en une seule grande chaîne

  // Remplacer tout le contenu de la sidebar en une seule opération.
  eventListEl.innerHTML = eventItemsHTML;
}

/**
 * Updates the header title to match the currently active event
 */
export function updateHeaderTitle() {
  const activeEvent = document.querySelector(".event-list-item.active");
  const headerTitle = document.querySelector(".sidebar-title");

  if (activeEvent && headerTitle) {
    headerTitle.textContent = activeEvent.textContent.trim();
  }
}
