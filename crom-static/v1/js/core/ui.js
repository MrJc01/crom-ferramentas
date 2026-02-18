// --- UI HELPERS & COMPONENTS ---

window.CromApp.UI = {};

// Progress & Status
window.CromApp.UI.showProgress = (text, isBatch = false) => {
    document.getElementById('toolStatus').classList.remove('hidden');
    document.getElementById('progressBarContainer').style.display = 'block';
    document.getElementById('statusText').innerText = text;
    document.getElementById('errorMessage').classList.add('hidden');
    document.getElementById('resultsContainer').innerHTML = '';
    document.getElementById('resultsContainer').classList.add('hidden');

    if (isBatch) {
        document.getElementById('batchCount').classList.remove('hidden');
    } else {
        document.getElementById('batchCount').classList.add('hidden');
    }
    window.CromApp.UI.updateProgress(5);
};

window.CromApp.UI.updateProgress = (percent, current, total) => {
    document.getElementById('progressBar').style.width = percent + '%';
    document.getElementById('statusPercent').innerText = percent + '%';

    if (current !== undefined && total !== undefined) {
        document.getElementById('batchCount').innerText = `${current}/${total}`;
    }
};

window.CromApp.UI.hideProgress = () => {
    document.getElementById('progressBarContainer').style.display = 'none';
    document.getElementById('statusText').innerText = 'Concluído!';
};

window.CromApp.UI.showError = (msg) => {
    document.getElementById('toolStatus').classList.remove('hidden');
    document.getElementById('progressBarContainer').style.display = 'none';
    const errDiv = document.getElementById('errorMessage');
    errDiv.innerText = msg;
    errDiv.classList.remove('hidden');
    document.getElementById('statusText').innerText = 'Erro';
};

window.CromApp.UI.addResult = (blob, filename) => {
    const container = document.getElementById('resultsContainer');
    container.classList.remove('hidden');

    const url = URL.createObjectURL(blob);

    const div = document.createElement('div');
    div.className = 'p-2 border rounded-lg flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-800';
    div.innerHTML = `
         <div class="h-20 w-full bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center overflow-hidden">
            ${blob.type.startsWith('image') ? `<img src="${url}" class="h-full object-contain">` : '<i data-lucide="file" class="w-8 h-8"></i>'}
         </div>
         <span class="text-xs truncate w-full text-center" title="${filename}">${filename}</span>
         <a href="${url}" download="${filename}" class="text-xs bg-indigo-600 text-white px-2 py-1 rounded w-full text-center hover:bg-indigo-700">Baixar</a>
     `;
    container.appendChild(div);
    lucide.createIcons();

    // We infer tool type roughly or pass it? For now let's assume image-conversion for generic
    // Ideally the caller should pass the tool ID. 
    // But to keep signature compatible or simple, we just log it.
    window.CromApp.addToHistory('processed-file', filename, blob);
};

// Components
window.CromApp.Components = {
    Header: (currentView) => `
        <header class="sticky top-0 z-50 glass-effect border-b dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
            <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <a href="javascript:void(0)" onclick="CromApp.navigate('inicio')" class="flex items-center gap-2 group">
                    <span class="text-xl font-black tracking-tighter text-slate-800 dark:text-white">Crom Ferramentas</span>
                </a>
                <nav class="hidden md:flex items-center gap-8 text-sm font-semibold">
                    <button onclick="CromApp.navigate('inicio')" class="nav-link ${currentView === 'inicio' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'} transition-colors">Início</button>
                    <button onclick="CromApp.navigate('sobre')" class="nav-link ${currentView === 'sobre' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'} transition-colors">Sobre</button>
                     <button onclick="CromApp.navigate('historico')" class="nav-link ${currentView === 'historico' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'} transition-colors">Histórico</button>
                </nav>
                <div class="flex items-center gap-4">
                    <button onclick="CromApp.toggleDark()" class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                        <i data-lucide="${document.documentElement.classList.contains('dark') ? 'sun' : 'moon'}"></i>
                    </button>
                </div>
            </div>
        </header>
    `,
    HomeView: (renderCardsFn, searchQuery, renderCategoriesFn) => `
        <div class="animate-in fade-in duration-500">
            <section class="max-w-7xl mx-auto px-6 py-12 md:py-20 text-center">
                <h1 class="text-4xl md:text-6xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">
                    Simples. Rápido. Privado.
                </h1>
                <p class="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
                    Ferramentas essenciais para desenvolvedores e criativos, rodando diretamente no seu navegador.
                </p>

                 <div class="relative max-w-2xl mx-auto mb-10 group">
                    <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <i data-lucide="search" class="text-slate-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5"></i>
                    </div>
                    <input 
                        type="text" 
                        id="toolSearch"
                        placeholder="O que você precisa hoje?"
                        class="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none focus:border-indigo-500 outline-none text-lg transition-all"
                        onkeyup="CromApp.handleSearch(this.value)"
                        value="${searchQuery}"
                    >
                </div>

                <!-- CATEGORIES -->
                ${renderCategoriesFn ? renderCategoriesFn() : ''}

                <div id="toolsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    ${renderCardsFn()}
                </div>
            </section>
        </div>
    `,
    SobreView: () => `
        <div class="animate-in slide-in-from-bottom-4 duration-500">
            <section class="max-w-4xl mx-auto px-6 py-20">
                 <div class="text-center mb-16">
                    <h2 class="text-4xl font-black mb-6">Nossa Filosofia</h2>
                    <p class="text-xl text-slate-500">Ferramentas que respeitam sua privacidade. Processamento local sempre que possível.</p>
                </div>
                 <div class="text-center">
                    <button onclick="CromApp.navigate('inicio')" class="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Explorar Ferramentas</button>
                 </div>
            </section>
        </div>
    `,
    HistoricoView: () => `
        <div class="animate-in slide-in-from-bottom-4 duration-500">
            <section class="max-w-4xl mx-auto px-6 py-20">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-3xl font-black">Histórico Local</h2>
                    <button onclick="CromApp.clearHistory()" class="text-sm text-red-500 hover:text-red-700 font-bold">Limpar</button>
                </div>
                <p class="text-slate-500 mb-8">Seus arquivos processados recentemente (Metadados apenas).</p>
                
                <div id="historyList" class="space-y-4">
                    <div class="p-8 text-center text-slate-400">Carregando histórico...</div>
                </div>
            </section>
        </div>
    `,
    Footer: () => `
        <footer class="py-12 px-6 text-center border-t dark:border-slate-800 mt-20 bg-white dark:bg-slate-950">
            <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2026 Crom Tools • Local First</p>
        </footer>
    `
};
