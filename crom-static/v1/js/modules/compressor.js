// --- COMPRESSOR TOOL ---
window.CromApp.registerTool({
    id: 'compress',
    title: 'Compressor Pro',
    desc: 'Empacotamento e Redução de tamanho sem perda de qualidade (ZIP Archive).',
    icon: 'file-archive',
    color: 'bg-amber-500',
    tags: ['comprimir', 'zip', 'otimizar', 'tamanho'],
    render: () => `
        <div class="max-w-md mx-auto py-8 text-center">
            
            <!-- Upload Area -->
            <label id="compressUploadBox" for="compressInput" class="block w-full border-2 border-dashed border-amber-300 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-8 mb-6 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors">
                <input type="file" id="compressInput" class="hidden" onchange="window.processCompressionPreview(event)">
                <div class="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                     <i data-lucide="upload-cloud" class="w-8 h-8 text-amber-500"></i>
                </div>
                <h3 class="text-xl font-bold mb-2">Criar Arquivo .ZIP</h3>
                <p class="text-sm text-slate-500" id="compressFileName">Qualquer formato aceito</p>
            </label>

            <!-- Compression Controls (Hidden Initially) -->
            <div id="compressControls" class="hidden mb-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl text-left">
                <div class="flex justify-between items-center mb-2">
                    <label class="text-sm font-bold text-slate-600 dark:text-slate-300">Intensidade de Compressão ZIP</label>
                    <span id="compressLevelDisplay" class="text-amber-500 font-black">Nível Médio</span>
                </div>
                <!-- Real fflate ZIP levels 1-9 -->
                <input type="range" id="compressLevel" min="1" max="9" value="6" oninput="window.updateCompressionLevel(this.value)" class="w-full accent-amber-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer mb-6">
                
                <div class="bg-white dark:bg-slate-800 rounded-xl p-4 flex justify-between items-center border border-slate-100 dark:border-slate-700 mb-4">
                    <div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase">Original</div>
                        <div id="compressSizeOld" class="font-mono text-sm line-through text-slate-500">0.0 MB</div>
                    </div>
                    <i data-lucide="arrow-right" class="w-4 h-4 text-slate-300"></i>
                    <div class="text-right">
                        <div class="text-[10px] font-bold text-amber-500 uppercase">Comprimido</div>
                        <div id="compressSizeNew" class="font-mono font-bold text-lg text-green-500">0.0 MB</div>
                    </div>
                </div>
                
                <div class="flex text-[11px] text-slate-400 gap-2 items-start bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                    <i data-lucide="info" class="w-4 h-4 text-amber-500 shrink-0"></i>
                    <p>A tecnologia <b>ZIP Lossless</b> é ideal para arquivos puros (Textos, CSV, HTML, Códigos). Arquivos de mídia (JPG, MP4, PDFs) já vêm comprimidos de fábrica e não podem ser espremidos além do limite físico da física matemática.</p>
                </div>
            </div>

            <p id="compressStatus" class="text-slate-500 mb-6 line-clamp-2 min-h-[20px] text-sm"></p>
            
            <button id="compressDownloadBtn" disabled onclick="window.downloadCompressedFile()" class="w-full bg-amber-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white disabled:text-slate-500 py-4 rounded-xl font-black text-lg shadow-xl shadow-amber-500/20 disabled:shadow-none hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2">
                <i data-lucide="download" class="w-5 h-5"></i> Baixar Arquivo .ZIP
            </button>
        </div>
    `
});

// App State
window.currentFileToCompress = null;
window.compressedBlobUrl = null;

window.updateCompressionLevel = (val) => {
    const display = document.getElementById('compressLevelDisplay');
    if (val < 4) display.innerText = "Baixo (Rápido)";
    else if (val > 7) display.innerText = "Máximo (Lento)";
    else display.innerText = "Médio";

    // Auto re-process if file is loaded
    if (window.currentFileToCompress) {
        window.processCompressionPreview({ target: document.getElementById('compressInput') });
    }
}

window.processCompressionPreview = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    window.currentFileToCompress = file;
    document.getElementById('compressFileName').innerText = file.name;
    document.getElementById('compressControls').classList.remove('hidden');
    document.getElementById('compressUploadBox').classList.add('hidden');

    const downloadBtn = document.getElementById('compressDownloadBtn');
    const statusEl = document.getElementById('compressStatus');

    downloadBtn.disabled = true;
    statusEl.innerHTML = `<span class="text-amber-500 flex items-center justify-center gap-2"><i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Analisando...</span>`;
    lucide.createIcons();

    try {
        // Leitura do Buffer na Memória
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Puxa o Slider atual (1-9)
        const lvl = parseInt(document.getElementById('compressLevel').value) || 6;

        // FFlate: Realiza a compressão ZIP real criando a estrutura
        const zipConfig = {};
        zipConfig[file.name] = [uint8Array, { level: lvl }];
        const compressedUint8 = fflate.zipSync(zipConfig);

        // Reconstrói como Blob
        const blob = new Blob([compressedUint8], { type: 'application/zip' });

        // Download Trigger
        if (window.compressedBlobUrl) URL.revokeObjectURL(window.compressedBlobUrl);
        window.compressedBlobUrl = URL.createObjectURL(blob);

        // Math Metrics
        const originalSize = (file.size / 1024 / 1024).toFixed(3);
        const newSize = (blob.size / 1024 / 1024).toFixed(3);
        const ratio = Math.round((1 - (blob.size / file.size)) * 100);

        document.getElementById('compressSizeOld').innerText = originalSize + ' MB';
        document.getElementById('compressSizeNew').innerText = newSize + ' MB';

        if (ratio <= 2) {
            statusEl.innerHTML = `<span class="text-amber-600 dark:text-amber-400">Pronto! Arquivo Já Comprimido (${ratio}% redução). Embala num ZIP.</span>`;
        } else {
            statusEl.innerHTML = `<span class="text-green-500">Pronto! Redução enorme de ${ratio}%.</span>`;
        }

        downloadBtn.disabled = false;
    } catch (e) {
        console.error("Compression Error:", e);
        if (!window.fflate) {
            statusEl.innerHTML = `<span class="text-red-500">Biblioteca Engine FFlate Falhou ao Carregar. Pressione F5.</span>`;
        } else {
            statusEl.innerHTML = `<span class="text-red-500">O arquivo é grande demais para sua RAM local.</span>`;
        }
    }
};

window.downloadCompressedFile = () => {
    if (!window.compressedBlobUrl || !window.currentFileToCompress) return;

    // Tenta arrancar extensões antigas se o cara subir arquivo.txt.zip pra não ficar feio
    let baseName = window.currentFileToCompress.name;
    const a = document.createElement('a');
    a.href = window.compressedBlobUrl;
    a.download = baseName + '.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
}
