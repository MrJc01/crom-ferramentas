window.CromApp.registerTool({
    id: 'json-tools',
    title: 'JSON Formatter & Validator',
    desc: 'Formatar, validar e minificar JSON.',
    icon: 'file-json',
    color: 'bg-yellow-500',
    category: 'Desenvolvimento',
    popupSize: 'max-w-6xl',
    render: () => `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-[500px]">
            <div class="flex flex-col">
                <label class="text-xs font-bold text-slate-500 mb-2">Entrada JSON</label>
                <textarea id="jsonInput" class="flex-1 w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-lg font-mono text-xs resize-none focus:ring-2 ring-yellow-500 outline-none" placeholder='{"key": "value"}'></textarea>
            </div>
            <div class="flex flex-col">
                <label class="text-xs font-bold text-slate-500 mb-2">Resultado / Erros</label>
                <textarea id="jsonOutput" readonly class="flex-1 w-full bg-slate-100 dark:bg-slate-900 p-4 rounded-lg font-mono text-xs resize-none outline-none"></textarea>
            </div>
        </div>
        <div class="mt-4 flex gap-2 justify-end">
            <button onclick="CromModules.JsonTools.process('minify')" class="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-sm">Minificar</button>
            <button onclick="CromModules.JsonTools.process('format')" class="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-bold text-sm">Formatar (Prettify)</button>
        </div>
    `,
    init: () => {
        window.CromModules = window.CromModules || {};
        window.CromModules.JsonTools = {
            process: (action) => {
                const input = document.getElementById('jsonInput').value;
                const outputEl = document.getElementById('jsonOutput');

                if (!input.trim()) {
                    outputEl.value = '';
                    return;
                }

                try {
                    const obj = JSON.parse(input);
                    if (action === 'format') {
                        outputEl.value = JSON.stringify(obj, null, 4);
                        outputEl.className = "flex-1 w-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg font-mono text-xs resize-none outline-none border border-green-200 dark:border-green-800";
                    } else {
                        outputEl.value = JSON.stringify(obj);
                        outputEl.className = "flex-1 w-full bg-slate-100 dark:bg-slate-900 p-4 rounded-lg font-mono text-xs resize-none outline-none";
                    }
                } catch (e) {
                    outputEl.value = "Erro de validação:\n" + e.message;
                    outputEl.className = "flex-1 w-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg font-mono text-xs resize-none outline-none border border-red-200 dark:border-red-800";
                }
            }
        };
    }
});
