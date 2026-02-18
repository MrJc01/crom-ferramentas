// --- MAIN APPLICATION LOGIC ---

window.CromApp = window.CromApp || {};

window.CromApp.state = {
    currentView: 'inicio',
    searchQuery: '',
    tools: []
};

// Tool Registry
window.CromApp.registerTool = (toolConfig) => {
    window.CromApp.state.tools.push(toolConfig);
};

// Render Helper
const renderCards = () => {
    const { searchQuery, tools } = window.CromApp.state;
    const filtered = tools.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
    );

    if (filtered.length === 0) return `<div class="col-span-full py-20 text-center text-slate-400">Nenhuma ferramenta encontrada.</div>`;

    return filtered.map(tool => `
        <div class="tool-card group p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all cursor-pointer" 
             onclick="CromApp.openTool('${tool.id}')">
            <div class="${tool.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                <i data-lucide="${tool.icon}"></i>
            </div>
            <h3 class="text-xl font-bold mb-2">${tool.title}</h3>
            <p class="text-slate-500 text-sm leading-relaxed">${tool.desc}</p>
        </div>
    `).join('');
};

// Application Methods
window.CromApp.init = () => {
    window.CromApp.initDB().then(() => window.CromApp.render());
    // Global Escape Listener
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.CromApp.closeTool();
    });
};

window.CromApp.render = () => {
    const container = document.getElementById('app');
    const { currentView, searchQuery } = window.CromApp.state;
    const Components = window.CromApp.Components;

    let viewContent = '';
    if (currentView === 'inicio') viewContent = Components.HomeView(renderCards, searchQuery);
    else if (currentView === 'sobre') viewContent = Components.SobreView();
    else if (currentView === 'historico') viewContent = Components.HistoricoView();

    container.innerHTML = `
        ${Components.Header(currentView)}
        <main>
            ${viewContent}
        </main>
        ${Components.Footer()}
    `;
    lucide.createIcons();

    if (currentView === 'inicio') {
        const search = document.getElementById('toolSearch');
        if (search) {
            search.focus();
            // Cursor at end
            const val = search.value;
            search.value = '';
            search.value = val;
        }
    }
    if (currentView === 'historico') {
        window.CromApp.loadHistory();
    }
};

window.CromApp.navigate = (viewId) => {
    window.CromApp.state.currentView = viewId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.CromApp.render();
};

window.CromApp.handleSearch = (val) => {
    window.CromApp.state.searchQuery = val;
    const grid = document.getElementById('toolsGrid');
    if (grid) {
        grid.innerHTML = renderCards();
        lucide.createIcons();
    }
};

window.CromApp.toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    window.CromApp.render();
};

window.CromApp.openTool = (id) => {
    const tool = window.CromApp.state.tools.find(t => t.id === id);
    if (!tool) return;

    document.getElementById('toolTitle').innerText = tool.title;
    document.getElementById('toolDesc').innerText = tool.desc;
    document.getElementById('toolIconContainer').className = `p-2 rounded-lg text-white ${tool.color}`;
    document.getElementById('toolIconContainer').innerHTML = `<i data-lucide="${tool.icon}"></i>`;
    document.getElementById('toolContent').innerHTML = tool.render();

    document.getElementById('toolStatus').classList.add('hidden');
    document.body.classList.add('tool-active');
    lucide.createIcons();
};

window.CromApp.closeTool = () => {
    document.body.classList.remove('tool-active');
};

window.CromApp.loadHistory = () => {
    if (!window.CromApp.db) return;
    const transaction = window.CromApp.db.transaction(['history'], 'readonly');
    const store = transaction.objectStore('history');
    const request = store.openCursor(null, 'prev'); // Newest first
    const list = document.getElementById('historyList');

    list.innerHTML = '';

    request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const item = cursor.value;
            const date = new Date(item.timestamp).toLocaleString();
            const el = document.createElement('div');
            el.className = 'bg-white dark:bg-slate-900 p-4 rounded-xl border dark:border-slate-800 flex justify-between items-center';
            el.innerHTML = `
                <div>
                    <div class="font-bold">${item.filename}</div>
                    <div class="text-xs text-slate-400">${item.tool} • ${date}</div>
                </div>
                <div class="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    ${(item.size / 1024).toFixed(1)} KB
                </div>
            `;
            list.appendChild(el);
            cursor.continue();
        } else {
            if (list.innerHTML === '') list.innerHTML = '<div class="text-slate-400">Nenhum histórico encontrado.</div>';
        }
    }
};
