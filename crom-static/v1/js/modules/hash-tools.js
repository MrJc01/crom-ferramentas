// --- HASH TOOLS ---
window.CromApp.registerTool({
    id: 'hash-tools',
    title: 'Gerador de Hash',
    desc: 'Gere hashes SHA (1, 256, 384, 512) localmente.',
    icon: 'hash',
    color: 'bg-zinc-600',
    category: 'Segurança',
    tags: ['hash', 'sha', 'md5', 'criptografia', 'segurança'],
    render: () => `
        <div class="space-y-6">
            <div class="flex flex-col gap-2">
                <span class="text-[10px] font-bold text-slate-400">ENTRADA DE TEXTO</span>
                <textarea id="hashInput" oninput="generateHashes()" class="p-4 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-sm outline-none focus:ring-2 focus:ring-zinc-500 min-h-[120px]" placeholder="Digite o texto para gerar o hash..."></textarea>
            </div>
            
            <div class="grid grid-cols-1 gap-4">
                ${['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map(algo => `
                    <div class="relative group">
                        <span class="text-[10px] font-bold text-slate-400 mb-1 block">${algo}</span>
                        <input type="text" id="hash-${algo}" readonly class="w-full p-3 pr-12 rounded-lg border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-xs text-slate-600 dark:text-slate-300">
                        <button onclick="copyHash('hash-${algo}')" class="absolute right-2 top-6 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-500 transition-colors">
                            <i data-lucide="copy" class="w-4 h-4"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `
});

window.generateHashes = async () => {
    const text = document.getElementById('hashInput').value;
    if (!text) {
        ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].forEach(algo => {
            document.getElementById(`hash-${algo}`).value = '';
        });
        return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const algos = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

    for (const algo of algos) {
        try {
            const hashBuffer = await crypto.subtle.digest(algo, data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            document.getElementById(`hash-${algo}`).value = hashHex;
        } catch (e) {
            console.error(e);
        }
    }
};

window.copyHash = (id) => {
    const el = document.getElementById(id);
    el.select();
    document.execCommand('copy');
    window.CromApp.UI.showToast ? window.CromApp.UI.showToast('Hash copiado!') : alert('Copiado!');
};
