// --- OCR TOOL ---
window.CromApp.registerTool({
    id: 'ocr-tool',
    title: 'OCR (Texto de Imagem)',
    desc: 'Extraia texto de imagens digitalizadas ou fotos.',
    icon: 'scan-text',
    color: 'bg-orange-500',
    tags: ['ocr', 'texto', 'extrair', 'ler', 'imagem'],
    render: () => `
         <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[450px]">
            <div class="flex flex-col gap-2">
                 <div class="text-center py-10 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex-1 flex flex-col items-center justify-center">
                    <i data-lucide="scan-line" class="mx-auto w-10 h-10 text-orange-500 mb-4"></i>
                    <h3 class="text-lg font-bold">Envie uma Imagem</h3>
                    <div class="relative mt-4 inline-block">
                         <button class="bg-orange-500 text-white px-8 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors pointer-events-none">Upload</button>
                         <input type="file" accept="image/*" onchange="window.handleOCR(this)" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <span class="text-[10px] font-bold text-slate-400">TEXTO EXTRAÍDO</span>
                <textarea id="ocrResult" readonly class="flex-1 p-4 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs outline-none focus:ring-2 focus:ring-orange-500 resize-none" placeholder="O texto extraído aparecerá aqui..."></textarea>
                <button onclick="navigator.clipboard.writeText(document.getElementById('ocrResult').value)" class="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">Copiar Texto</button>
            </div>
        </div>
    `
});

window.handleOCR = async (input) => {
    const file = input.files[0];
    if (!file) return;

    const btn = input.parentElement.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Lendo...';
    document.getElementById('ocrResult').value = "Processando... aguarde.";

    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${window.CromApp.API_BASE}/heavy/ocr`, { method: 'POST', body: formData });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.details || data.error || 'Erro desconhecido');
        }

        document.getElementById('ocrResult').value = data.text || "Nenhum texto encontrado.";
    } catch (e) {
        console.error(e);
        document.getElementById('ocrResult').value = `ERRO: ${e.message}`;
    } finally {
        btn.innerText = originalText;
        input.value = '';
    }
};
