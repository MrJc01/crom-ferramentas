// --- MARKDOWN TO PDF TOOL ---
if (typeof marked !== 'undefined') {
    marked.setOptions({
        gfm: true,
        breaks: true
    });
}
window.CromApp.registerTool({
    id: 'md-pdf',
    title: 'Markdown → PDF',
    desc: 'Editor e conversor local com prévia real.',
    icon: 'file-text',
    color: 'bg-blue-500',
    category: 'Documentos',
    tags: ['markdown', 'pdf', 'texto', 'converter'],
    render: () => `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[450px]">
            <div class="flex flex-col gap-2">
                <span class="text-[10px] font-bold text-slate-400">EDITOR</span>
                <textarea id="mdInput" onkeyup="updateMDPreview()" class="flex-1 p-4 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="# Comece a escrever..."></textarea>
            </div>
            <div class="flex flex-col gap-2">
                <span class="text-[10px] font-bold text-slate-400">PRÉVIA</span>
                <div id="mdPreview" class="flex-1 bg-white dark:bg-slate-800 border dark:border-slate-800 rounded-xl p-6 overflow-y-auto prose dark:prose-invert"></div>
            </div>
        </div>
        <div class="mt-8 flex justify-end"><button onclick="generatePDF(this)" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">Imprimir / Salvar PDF</button></div>
    `
});

// Helpers attached to window for event attributes
window.updateMDPreview = () => {
    const input = document.getElementById('mdInput').value;
    const html = typeof marked !== 'undefined'
        ? marked.parse(input)
        : input.replace(/\n/g, '<br>');
    document.getElementById('mdPreview').innerHTML = html || '<p class="text-slate-300">Digite algo...</p>';
};

window.generatePDF = (btn) => {
    const htmlContent = document.getElementById('mdPreview').innerHTML;
    if (!htmlContent || htmlContent === '<p class="text-slate-300">Digite algo...</p>') {
        return alert('O conteúdo está vazio!');
    }
    window.print();
};
