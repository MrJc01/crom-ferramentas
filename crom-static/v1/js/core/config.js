// --- CONFIGURATION ---
window.CromApp = window.CromApp || {};
window.CromApp.API_BASE = 'http://localhost:3000/v1';

window.CromApp.services = {
    backend: {
        url: window.CromApp.API_BASE,
        enabled: true
    }
};

// Tailwind Config Removed - Now Handled via Build Step
