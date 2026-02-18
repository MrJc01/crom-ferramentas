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
        <header class="sticky top-0 z-50 glass-effect border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl transition-all duration-300">
            <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <!-- Minimalist Logo Icon Only -->
                <a href="javascript:void(0)" onclick="CromApp.navigate('inicio')" class="flex items-center gap-2 group hover:scale-105 transition-transform">
                     <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <i data-lucide="box" class="w-5 h-5"></i>
                     </div>
                </a>
                
                <nav class="hidden md:flex items-center gap-1 text-sm font-medium bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-full border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
                    <button onclick="CromApp.navigate('inicio')" class="px-5 py-1.5 rounded-full transition-all ${currentView === 'inicio' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}">Início</button>
                    <button onclick="CromApp.navigate('sobre')" class="px-5 py-1.5 rounded-full transition-all ${currentView === 'sobre' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}">Sobre</button>
                    <button onclick="CromApp.navigate('historico')" class="px-5 py-1.5 rounded-full transition-all ${currentView === 'historico' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}">Histórico</button>
                </nav>

                <div class="flex items-center gap-3">
                
                    <button onclick="CromApp.toggleDark()" class="p-2.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-500 transition-all hover:rotate-12">
                        <i data-lucide="${document.documentElement.classList.contains('dark') ? 'sun' : 'moon'}" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
        </header>
    `,
    HomeView: (renderCardsFn, searchQuery, renderCategoriesFn) => `
        <div class="animate-in fade-in duration-700">
            <!-- Hero Section -->
            <section class="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center relative overflow-hidden">
                <!-- Decorative Background Elements -->
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
                
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/30 shadow-xl shadow-indigo-500/5 mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-100">
                    <span class="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                    <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Crom Ferramentas</span>
                </div>

                <h1 class="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900 dark:text-white leading-tight animate-in slide-in-from-bottom-6 duration-500 delay-200">
                    Ferramentas <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Poderosas</span>.<br>
                    Privacidade <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Absoluta</span>.
                </h1>
                
                <p class="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-6 duration-500 delay-300">
                    Uma coleção de utilitários de engenharia que rodam diretamente no seu navegador. 
                    <span class="text-slate-800 dark:text-slate-200 font-semibold">Sem uploads desnecessários. Sem rastreamento.</span>
                </p>
 
                <div class="relative max-w-2xl mx-auto mb-16 group animate-in slide-in-from-bottom-8 duration-500 delay-400 z-10">
                    <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <i data-lucide="search" class="text-slate-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5"></i>
                    </div>
                    <input 
                        type="text" 
                        id="toolSearch"
                        placeholder="Busque por imagem, pdf, json..."
                        class="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-lg transition-all"
                        onkeyup="CromApp.handleSearch(this.value)"
                        value="${searchQuery}"
                    >
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 pointer-events-none">
                        <kbd class="hidden sm:inline-block px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs rounded-lg font-mono border dark:border-slate-700">/</kbd>
                    </div>
                </div>

                <!-- CATEGORIES -->
                ${renderCategoriesFn ? renderCategoriesFn() : ''}

                <div id="toolsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-left animate-in slide-in-from-bottom-10 duration-700 delay-500">
                    ${renderCardsFn()}
                </div>
            </section>
        </div>
    `,
    SobreView: () => `
        <div class="animate-in slide-in-from-bottom-4 duration-500">
            <section class="max-w-4xl mx-auto px-6 py-20">
                 <div class="text-center mb-16">
                    <div class="inline-flex items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl mb-8">
                        <i data-lucide="shield-check" class="w-12 h-12 text-indigo-600 dark:text-indigo-400"></i>
                    </div>
                    <h2 class="text-4xl font-black mb-6">Arquitetura Local-First</h2>
                    <p class="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
                        Acreditamos que seus dados são seus. Diferente de outros sites, o Crom Tools processa 
                        90% das tarefas utilizando <span class="font-bold text-slate-800 dark:text-slate-200">WebAssembly</span> e 
                        <span class="font-bold text-slate-800 dark:text-slate-200">Web Workers</span> diretamente na sua máquina.
                    </p>
                </div>
                
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="p-6 bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 shadow-lg">
                        <h3 class="font-bold text-lg mb-2">Zero Uploads</h3>
                        <p class="text-sm text-slate-500">Imagens, JSONs e textos simples nunca saem do seu dispositivo.</p>
                    </div>
                    <div class="p-6 bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 shadow-lg">
                        <h3 class="font-bold text-lg mb-2">Backend Seguro</h3>
                        <p class="text-sm text-slate-500">Apenas tarefas pesadas (Vídeo/OCR) usam nosso servidor, com exclusão imediata pós-processo.</p>
                    </div>
                    <div class="p-6 bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 shadow-lg">
                        <h3 class="font-bold text-lg mb-2">Open Source</h3>
                        <p class="text-sm text-slate-500">Código auditável e transparente. Construído pela comunidade para a comunidade.</p>
                    </div>
                </div>

                 <div class="text-center mt-16">
                    <button onclick="CromApp.navigate('inicio')" class="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl">Explorar Ferramentas</button>
                 </div>
            </section>
        </div>
    `,
    HistoricoView: () => `
        <div class="animate-in slide-in-from-bottom-4 duration-500">
            <section class="max-w-4xl mx-auto px-6 py-20">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 class="text-3xl font-black">Histórico Local</h2>
                        <p class="text-slate-500 text-sm mt-1">Dados armazenados apenas no seu navegador (IndexedDB).</p>
                    </div>
                    <button onclick="CromApp.clearHistory()" class="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 font-bold text-sm transition-colors flex items-center gap-2">
                        <i data-lucide="trash-2" class="w-4 h-4"></i> Limpar
                    </button>
                </div>
                
                <div id="historyList" class="space-y-3">
                    <div class="p-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <i data-lucide="history" class="w-8 h-8 mx-auto mb-3 opacity-50"></i>
                        Carregando histórico...
                    </div>
                </div>
            </section>
        </div>
    `,
    Footer: () => `
        <footer class="mt-32 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
            <!-- First Footer: Branding & Info -->
            <div class="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div class="md:col-span-2">
                    <div class="flex items-center gap-2 mb-6">
                        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                            <i data-lucide="box" class="w-5 h-5"></i>
                        </div>
                        <span class="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Crom Ferramentas</span>
                    </div>
                    <p class="text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                        Uma suíte de ferramentas de desenvolvimento projetada com foco em privacidade, performance e simplicidade. 
                        Construído para engenheiros que valorizam seus dados.
                    </p>
                    <div class="flex gap-4 mt-8">
                        <a href="#" class="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-colors"><i data-lucide="github" class="w-5 h-5"></i></a>
                        <a href="#" class="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"><i data-lucide="twitter" class="w-5 h-5"></i></a>
                        <a href="#" class="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:text-pink-600 transition-colors"><i data-lucide="heart" class="w-5 h-5"></i></a>
                    </div>
                </div>
                
                <div>
                    <h4 class="font-bold text-slate-900 dark:text-white mb-6">Ferramentas Populares</h4>
                    <ul class="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                        <li><a href="javascript:CromApp.openTool('img-conv')" class="hover:text-indigo-600 transition-colors">Conversor de Imagem</a></li>
                        <li><a href="javascript:CromApp.openTool('json-tools')" class="hover:text-indigo-600 transition-colors">JSON Validator</a></li>
                        <li><a href="javascript:CromApp.openTool('ocr-tool')" class="hover:text-indigo-600 transition-colors">OCR Inteligente</a></li>
                        <li><a href="javascript:CromApp.openTool('qr-generator')" class="hover:text-indigo-600 transition-colors">Gerador QR Code</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-bold text-slate-900 dark:text-white mb-6">Legal & Privacidade</h4>
                    <ul class="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                        <li><a href="#" class="hover:text-indigo-600 transition-colors">Política de Privacidade</a></li>
                        <li><a href="#" class="hover:text-indigo-600 transition-colors">Termos de Uso</a></li>
                        <li><a href="#" class="hover:text-indigo-600 transition-colors">Relatar Bug</a></li>
                        <li>
                            <div class="flex items-center gap-2 mt-4 text-xs bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-lg">
                                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span>Status: Operacional</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Second Footer: Copyright -->
            <div class="border-t border-slate-100 dark:border-slate-900 py-8 text-center bg-slate-50 dark:bg-slate-950/50">
                <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2026 Crom Tools Inc • Powered by Antigravity</p>
            </div>
        </footer>
    `
};
