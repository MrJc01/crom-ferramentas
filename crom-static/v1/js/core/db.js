// --- INDEXEDDB (HISTORY) ---
const DB_NAME = 'CromToolsDB';
const DB_VERSION = 1;

window.CromApp.db = null;

window.CromApp.initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('history')) {
                const store = db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
        request.onsuccess = (event) => {
            window.CromApp.db = event.target.result;
            console.log('IndexedDB initialized');
            resolve(window.CromApp.db);
        };
        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.error);
            reject(event.target.error);
        };
    });
};

window.CromApp.addToHistory = (tool, filename, resultBlob) => {
    if (!window.CromApp.db) return;
    const transaction = window.CromApp.db.transaction(['history'], 'readwrite');
    const store = transaction.objectStore('history');
    const item = {
        tool: tool,
        filename: filename,
        timestamp: new Date(),
        size: resultBlob.size,
        type: resultBlob.type
    };
    store.add(item);
};
