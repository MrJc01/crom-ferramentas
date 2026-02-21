// --- TEXT STATS ---
window.CromApp.registerTool({
    id: 'text-stats',
    title: 'Analisador de Texto',
    category: 'Texto',
    desc: 'Contagem de palavras, leitura estimada e frequência.',
    icon: 'text-cursor-input',
    color: 'bg-emerald-600',
    tags: ['texto', 'palavras', 'caracteres', 'stats', 'seo'],
    render: () => `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
            <div class="md:col-span-2 flex flex-col gap-2">
                <span class="text-[10px] font-bold text-slate-400">SEU TEXTO</span>
                <textarea id="statsInput" oninput="analyzeText()" class="flex-1 p-4 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-sm resize-none focus:ring-2 focus:ring-emerald-500" placeholder="Cole seu texto aqui..."></textarea>
            </div>
            
            <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-6 flex flex-col gap-6 overflow-y-auto">
                <div>
                    <span class="text-[10px] font-bold text-slate-400">PALAVRAS</span>
                    <div id="statWords" class="text-4xl font-black text-slate-800 dark:text-slate-100">0</div>
                </div>
                <div>
                    <span class="text-[10px] font-bold text-slate-400">CARACTERES</span>
                    <div id="statChars" class="text-2xl font-bold text-slate-600 dark:text-slate-300">0</div>
                </div>
                 <div>
                    <span class="text-[10px] font-bold text-slate-400">TEMPO DE LEITURA</span>
                    <div id="statTime" class="text-xl font-bold text-emerald-600">0 seg</div>
                </div>
                 <div>
                    <span class="text-[10px] font-bold text-slate-400 border-b block pb-2 mb-2">TOP PALAVRAS</span>
                    <ul id="statTop" class="text-sm space-y-1 text-slate-500">
                    </ul>
                </div>
            </div>
        </div>
    `
});

window.analyzeText = () => {
    const text = document.getElementById('statsInput').value;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const charCount = text.length;

    document.getElementById('statWords').innerText = words.length;
    document.getElementById('statChars').innerText = charCount;

    // Read time (avg 200 wpm)
    const totalSeconds = Math.ceil((words.length / 200) * 60);
    if (words.length === 0) {
        document.getElementById('statTime').innerText = '0 seg';
    } else if (totalSeconds < 60) {
        document.getElementById('statTime').innerText = `${totalSeconds} seg`;
    } else {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        document.getElementById('statTime').innerText = secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
    }

    // Freq
    const freq = {};
    words.forEach(w => {
        const clean = w.toLowerCase().replace(/[.,!?;:()]/g, '');
        if (clean.length > 3) freq[clean] = (freq[clean] || 0) + 1;
    });

    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
    document.getElementById('statTop').innerHTML = sorted.map(([w, c]) => `
        <li class="flex justify-between">
            <span>${w}</span>
            <span class="font-bold">${c}x</span>
        </li>
    `).join('');
};
