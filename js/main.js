// Main JavaScript file for the Event Manager Dashboard
// This will be populated with our application logic in the next steps 

// Wait for the entire HTML document to be loaded and ready before running the script
document.addEventListener('DOMContentLoaded', () => {

    const tabContainer = document.querySelector('.tab-nav');

    // Add a single click listener to the container for efficiency (event delegation)
    tabContainer.addEventListener('click', (event) => {
        
        // Find the button that was actually clicked
        const clickedTab = event.target.closest('.tab-link');

        // If the click was not on a button, do nothing
        if (!clickedTab) {
            return;
        }

        // Get all the tab buttons and content panels
        const allTabs = document.querySelectorAll('.tab-link');
        const allPanels = document.querySelectorAll('.tab-panel');
        
        // Get the target panel's ID from the button's "data-tab" attribute
        const targetPanelId = clickedTab.dataset.tab;
        const targetPanel = document.getElementById(targetPanelId + '-tab');

        // Deactivate all tabs and panels first
        allTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        allPanels.forEach(panel => {
            panel.classList.remove('active');
        });

        // Activate the clicked tab and its corresponding panel
        clickedTab.classList.add('active');
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    });

}); 