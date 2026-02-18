// --- COMPRESSOR TOOL ---
window.CromApp.registerTool({
    id: 'compress',
    title: 'Compressor Pro',
    desc: 'Redução de tamanho sem perda de qualidade.',
    icon: 'file-archive',
    color: 'bg-amber-500',
    tags: ['comprimir', 'zip', 'otimizar', 'tamanho'],
    render: () => `
        <div class="max-w-md mx-auto py-12 text-center">
            <div class="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <i data-lucide="minimize" class="w-10 h-10 text-amber-500"></i>
            </div>
            <h3 class="text-2xl font-black mb-4">Redução Inteligente</h3>
            <p class="text-slate-500 mb-8">Nossa tecnologia local otimiza seus arquivos em segundos.</p>
            <button class="w-full bg-amber-500 text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-shadow">Selecionar Arquivo</button>
        </div>
    `
});
// Logic for compressor (placeholder in original code too, but modularized now)
