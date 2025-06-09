// A reference to the main content area for the event details
const mainContent = document.querySelector('.main-content');

// This function updates the UI with data from the API
export function renderEventDetails(eventItems) {
    if (!mainContent) return; // Exit if the main content area isn't on the page

    // TEMPORARY DEBUG: Let's see exactly what we're getting
    console.log("=== DEBUG: Raw eventItems ===");
    console.log("eventItems:", eventItems);
    console.log("eventItems length:", eventItems.length);
    eventItems.forEach((item, index) => {
        console.log(`Item ${index}:`, item);
        console.log(`Item ${index} SK:`, item.SK);
        console.log(`Item ${index} keys:`, Object.keys(item));
    });
    console.log("=== END DEBUG ===");

    // Find the event metadata (the item with SK = 'METADATA')
    const eventMetadata = eventItems.find(item => item.SK === 'METADATA');
    
    // Find all the participant items
    const participants = eventItems.filter(item => item.SK.startsWith('PARTICIPANT#'));

    if (!eventMetadata) {
        mainContent.innerHTML = '<h1>Event not found</h1>';
        return;
    }

    // Build the HTML for the list of participants
    const participantsHtml = participants.map(participant => `
        <li class="participant-item">
            <strong>${participant.InGameName}</strong>
            <span>(${participant.DiscordUsername || 'No Discord'})</span>
        </li>
    `).join(''); // .join('') combines the array of HTML strings into one big string

    // Create the final HTML for the entire main content area
    const finalHtml = `
        <div class="event-details-header">
            <h1>${eventMetadata.EventName}</h1>
        </div>
        
        <div class="tabs-container">
            <nav class="tab-nav">
                <button class="tab-link active">Participants (${participants.length})</button>
                </nav>

            <div class="tab-content">
                <div class="tab-panel active">
                    <h2>Participant List</h2>
                    <ul class="participant-list">
                        ${participantsHtml}
                    </ul>
                </div>
            </div>
        </div>
    `;

    // Replace the static content with our new, dynamic HTML
    mainContent.innerHTML = finalHtml;
} 