// --- CONFIGURATION ---
window.CromApp = window.CromApp || {};
window.CromApp.API_BASE = 'http://localhost:3000/v1';

window.CromApp.services = {
    backend: {
        enabled: true,
        url: 'http://localhost:8082' // Aponta para o Caddy Dev Server 
    }
};

// Tailwind Config Removed - Now Handled via Build Step
