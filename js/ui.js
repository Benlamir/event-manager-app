// A reference to the main content area for the event details
const mainContent = document.querySelector(".main-content");
const eventList = document.getElementById("event-list");

// This function now just renders the main content area for ONE event
export function renderEventDetails(eventItems) {
  if (!mainContent) return;

  const eventMetadata = eventItems.find((item) => item.SK === "METADATA");
  const participants = eventItems.filter((item) =>
    item.SK.startsWith("PARTICIPANT#")
  );

  if (!eventMetadata) {
    mainContent.innerHTML = "<h1>Error: Event Metadata Not Found!</h1>";
    return;
  }

  const finalHtml = `
        <div class="event-details-header">
            <h1>${eventMetadata.EventName}</h1>
            <p>Capacity: ${participants.length} / ${eventMetadata.Capacity}</p>
        </div>
        <div class="tabs-container">
             <nav class="tab-nav">
                <button class="tab-link active">Participants (${participants.length})</button>
            </nav>
            <div class="tab-content">
                <div class="tab-panel active">
                    <p>This event has ${participants.length} participant(s).</p>
                </div>
            </div>
        </div>
    `;
  mainContent.innerHTML = finalHtml;
}

// This NEW function renders the list of events in the sidebar
export function renderEventList(events) {
  if (!eventList) return;

  if (events.length === 0) {
    eventList.innerHTML = "<li>No events found. Create one!</li>";
    return;
  }

  const itemsHtml = events
    .map(
      (event) => `
        <li class="event-list-item" data-event-id="${event.PK.split("#")[1]}">
            ${event.EventName}
        </li>
    `
    )
    .join("");

  eventList.innerHTML = itemsHtml;
}
