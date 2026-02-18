window.CromApp.registerTool({
    id: 'text-diff',
    title: 'Comparador de Texto',
    desc: 'Diff visual lado a lado de dois textos.',
    icon: 'split',
    color: 'bg-purple-600',
    category: 'Desenvolvimento',
    popupSize: 'max-w-7xl',
    render: () => `
        <div class="h-full flex flex-col">
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="font-bold text-slate-500 ml-2">Original</div>
                <div class="font-bold text-slate-500 ml-2">Modificado</div>
            </div>
            <div class="grid grid-cols-2 gap-4 flex-1 min-h-[400px]">
                <textarea id="diffLeft" class="w-full h-full p-4 bg-slate-50 dark:bg-slate-800 rounded-lg font-mono text-sm resize-none focus:ring-2 ring-purple-500 outline-none border border-slate-200 dark:border-slate-700" placeholder="Cole o texto original aqui..."></textarea>
                <textarea id="diffRight" class="w-full h-full p-4 bg-slate-50 dark:bg-slate-800 rounded-lg font-mono text-sm resize-none focus:ring-2 ring-purple-500 outline-none border border-slate-200 dark:border-slate-700" placeholder="Cole o texto modificado aqui..."></textarea>
            </div>
            
            <div id="diffResult" class="hidden mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <!-- Diff output will go here -->
            </div>

            <div class="mt-4 text-right">
                <button onclick="CromModules.Diff.compare()" class="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-500/30">Comparar</button>
            </div>
        </div>
    `,
    init: () => {
        window.CromModules = window.CromModules || {};
        window.CromModules.Diff = {
            compare: () => {
                const left = document.getElementById('diffLeft').value;
                const right = document.getElementById('diffRight').value;
                const container = document.getElementById('diffResult');

                // Simple Line Diff Implementation
                const leftLines = left.split('\n');
                const rightLines = right.split('\n');

                let html = '<div class="w-full">';

                const max = Math.max(leftLines.length, rightLines.length);

                for (let i = 0; i < max; i++) {
                    const l = leftLines[i] || '';
                    const r = rightLines[i] || '';

                    if (l === r) {
                        html += `<div class="flex hover:bg-slate-50 dark:hover:bg-slate-800"><div class="w-1/2 p-1 border-r border-slate-100 dark:border-slate-800 text-slate-400 select-none text-right px-2">${i + 1}</div><div class="w-full p-1 pl-4 text-slate-600 dark:text-slate-400 whitespace-pre-wrap break-all">${escapeHtml(l)}</div></div>`;
                    } else {
                        html += `<div class="flex bg-red-50 dark:bg-red-900/10"><div class="w-12 p-1 border-r border-red-200 text-red-300 select-none text-right px-2">-</div><div class="w-1/2 p-1 pl-4 text-red-600 dark:text-red-400 whitespace-pre-wrap break-all">${escapeHtml(l)}</div>
                                 <div class="w-12 p-1 border-r border-green-200 text-green-300 select-none text-right px-2">+</div><div class="w-1/2 p-1 pl-4 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 whitespace-pre-wrap break-all">${escapeHtml(r)}</div></div>`;
                    }
                }
                html += '</div>';

                // Note: This is a very naive line-by-line diff. 
                // For production, we'd use 'diff' library (npm package) but we are staying vanilla/simple as requested or use a CDN lib if available.
                // Assuming simple visual check is enough for now.

                container.innerHTML = html;
                container.classList.remove('hidden');
            }
        };

        function escapeHtml(text) {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    }
});
