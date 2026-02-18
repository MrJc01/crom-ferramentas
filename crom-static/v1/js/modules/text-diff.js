// --- TEXT DIFF TOOL ---
window.CromApp.registerTool({
    id: 'text-diff',
    title: 'Comparador de Texto',
    desc: 'Compare dois textos e veja as diferenças.',
    icon: 'git-compare',
    color: 'bg-orange-500',
    tags: ['diff', 'comparar', 'texto', 'diferença'],
    render: () => `
        <div class="flex flex-col h-[500px]">
             <div class="grid grid-cols-2 gap-4 h-1/2 mb-4">
                <div class="flex flex-col gap-2">
                    <span class="text-[10px] font-bold text-slate-400">ORIGINAL</span>
                    <textarea id="diffOriginal" class="flex-1 p-3 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm resize-none whitespace-pre" placeholder="Cole o texto original aqui..."></textarea>
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-[10px] font-bold text-slate-400">MODIFICADO</span>
                    <textarea id="diffModified" class="flex-1 p-3 rounded-lg border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm resize-none whitespace-pre" placeholder="Cole o texto modificado aqui..."></textarea>
                </div>
             </div>
             <div class="flex justify-center mb-4">
                <button onclick="computeDiff()" class="bg-orange-500 text-white px-8 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors">Comparar</button>
             </div>
             <div class="flex flex-col gap-2 h-1/2">
                <span class="text-[10px] font-bold text-slate-400">RESULTADO</span>
                <div id="diffResult" class="flex-1 overflow-y-auto p-4 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-sm"></div>
             </div>
        </div>
    `
});

window.computeDiff = () => {
    const original = document.getElementById('diffOriginal').value;
    const modified = document.getElementById('diffModified').value;

    const linesOrig = original.split('\n');
    const linesMod = modified.split('\n');

    // LCS (Longest Common Subsequence) Implementation
    const lcsMatrix = Array(linesOrig.length + 1).fill(null).map(() => Array(linesMod.length + 1).fill(0));

    for (let i = 1; i <= linesOrig.length; i++) {
        for (let j = 1; j <= linesMod.length; j++) {
            if (linesOrig[i - 1] === linesMod[j - 1]) {
                lcsMatrix[i][j] = lcsMatrix[i - 1][j - 1] + 1;
            } else {
                lcsMatrix[i][j] = Math.max(lcsMatrix[i - 1][j], lcsMatrix[i][j - 1]);
            }
        }
    }

    // Backtrack to find diff
    let i = linesOrig.length;
    let j = linesMod.length;
    const diff = [];

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && linesOrig[i - 1] === linesMod[j - 1]) {
            diff.unshift({ type: 'eq', content: linesOrig[i - 1], line: i });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || lcsMatrix[i][j - 1] >= lcsMatrix[i - 1][j])) {
            diff.unshift({ type: 'add', content: linesMod[j - 1], line: j });
            j--;
        } else {
            diff.unshift({ type: 'del', content: linesOrig[i - 1], line: i });
            i--;
        }
    }

    let html = '';
    diff.forEach((item, idx) => {
        if (item.type === 'eq') {
            html += `<div class="text-slate-500 py-0.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex"><span class="w-8 text-xs select-none opacity-50 text-right mr-4 border-r pr-2">${item.line}</span> <span>${escapeHtml(item.content || '')}</span></div>`;
        } else if (item.type === 'add') {
            html += `<div class="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 py-0.5 px-2 flex"><span class="w-8 text-xs select-none opacity-50 text-right mr-4 border-r pr-2">+ ${item.line}</span> <span>${escapeHtml(item.content)}</span></div>`;
        } else if (item.type === 'del') {
            html += `<div class="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 py-0.5 px-2 flex"><span class="w-8 text-xs select-none opacity-50 text-right mr-4 border-r pr-2">- ${item.line}</span> <span>${escapeHtml(item.content)}</span></div>`;
        }
    });

    document.getElementById('diffResult').innerHTML = html || '<div class="text-slate-400 italic">Sem dados.</div>';
};

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}
