// --- REGEX TESTER ---
window.CromApp.registerTool({
    id: 'regex-tester',
    title: 'Testador de Regex',
    desc: 'Teste expressões regulares em tempo real.',
    icon: 'code-2',
    color: 'bg-cyan-600',
    category: 'Dev',
    tags: ['regex', 'expressao', 'regular', 'dev', 'codigo'],
    render: () => `
        <div class="flex flex-col gap-6 h-[500px]">
            <!-- Inputs -->
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1 relative">
                    <span class="absolute left-3 top-3 text-slate-400 font-mono">/</span>
                    <input type="text" id="regexPattern" oninput="testRegex()" class="w-full p-3 px-6 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-950 font-mono focus:ring-2 focus:ring-cyan-500" placeholder="Padrão (ex: [a-z]+)">
                    <span class="absolute right-3 top-3 text-slate-400 font-mono">/</span>
                </div>
                <div class="w-32">
                    <input type="text" id="regexFlags" oninput="testRegex()" class="w-full p-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-950 font-mono focus:ring-2 focus:ring-cyan-500" placeholder="Flags (gm)">
                </div>
            </div>

            <!-- Test String & Result area -->
            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                <div class="flex flex-col gap-2">
                    <span class="text-[10px] font-bold text-slate-400">TEXTO DE TESTE</span>
                    <textarea id="regexText" oninput="testRegex()" class="flex-1 p-4 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-sm resize-none focus:ring-2 focus:ring-cyan-500" placeholder="Cole seu texto aqui..."></textarea>
                </div>
                <div class="flex flex-col gap-2">
                     <span class="text-[10px] font-bold text-slate-400">MATCHES (<span id="matchCount">0</span>)</span>
                     <div id="regexOutput" class="flex-1 p-4 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-sm overflow-y-auto whitespace-pre-wrap"></div>
                </div>
            </div>
        </div>
    `
});

window.testRegex = () => {
    const pattern = document.getElementById('regexPattern').value;
    const flags = document.getElementById('regexFlags').value;
    const text = document.getElementById('regexText').value;
    const output = document.getElementById('regexOutput');
    const count = document.getElementById('matchCount');

    if (!text || !pattern) {
        output.innerText = text;
        count.innerText = '0';
        return;
    }

    try {
        const regex = new RegExp(pattern, flags);

        // Highlight logic: Replace matches with span
        // We need to be careful with overlapping matches or HTML injection.
        // Simple approach: global replace if 'g' flag, otherwise first.

        let html = text.replace(/[&<>"']/g, function (m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
        }); // Escape HTML first

        // Note: Actual highlighting on escaped HTML is tricky because regex runs on raw string.
        // A robust highlighter tokenizes. 
        // For this simple tool, let's run regex on raw string, find indices, and construct valid HTML.

        let match;
        let chunks = [];
        let lastIndex = 0;

        // Ensure global flag for loop, or just one pass
        const safeRegex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');

        while ((match = safeRegex.exec(text)) !== null) {
            chunks.push(escapeRegexHtml(text.slice(lastIndex, match.index)));
            chunks.push(`<span class="bg-cyan-200 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200 rounded px-0.5">${escapeRegexHtml(match[0])}</span>`);
            lastIndex = safeRegex.lastIndex;
            if (!flags.includes('g') && lastIndex > 0) break;
            if (match[0].length === 0) safeRegex.lastIndex++; // Avoid infinite loop on zero-width
        }
        chunks.push(escapeRegexHtml(text.slice(lastIndex)));

        output.innerHTML = chunks.join('');

        const matches = text.match(new RegExp(pattern, flags)); // Count 'real' matches logic
        count.innerText = matches ? matches.length : 0;

    } catch (e) {
        output.innerHTML = `<span class="text-red-500">Erro na Regex: ${e.message}</span>`;
    }
};

function escapeRegexHtml(text) {
    return text ? text.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m])) : '';
}
