// --- JSON TOOLS ---
window.CromApp.registerTool({
    id: 'json-tools',
    title: 'JSON Formatter & Validator',
    desc: 'Formatar, minificar e validar JSON localmente.',
    icon: 'braces',
    color: 'bg-yellow-500',
    tags: ['json', 'formatar', 'validar', 'dev'],
    render: () => `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[500px]">
            <div class="flex flex-col gap-2">
                <span class="text-[10px] font-bold text-slate-400">ENTRADA</span>
                <textarea id="jsonInput" oninput="processJSON()" class="flex-1 p-4 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-sm outline-none focus:ring-2 focus:ring-yellow-500 resize-none" placeholder='{"key": "value"}'></textarea>
                <div class="flex gap-2">
                    <button onclick="prettifyJSON()" class="flex-1 bg-yellow-500 text-white py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors">Formatar</button>
                    <button onclick="minifyJSON()" class="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-2 rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Minificar</button>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center">
                    <span class="text-[10px] font-bold text-slate-400">SAÍDA / STATUS</span>
                    <span id="jsonStatus" class="text-[10px] font-bold text-slate-400">AGUARDANDO</span>
                </div>
                <textarea id="jsonOutput" readonly class="flex-1 p-4 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-sm outline-none resize-none"></textarea>
                <div class="flex justify-end">
                     <button onclick="copyJSON()" class="text-sm text-yellow-600 hover:text-yellow-700 font-bold">Copiar Resultado</button>
                </div>
            </div>
        </div>
    `
});

window.processJSON = () => {
    const input = document.getElementById('jsonInput').value;
    const status = document.getElementById('jsonStatus');
    if (!input.trim()) {
        status.innerText = 'AGUARDANDO';
        status.className = 'text-[10px] font-bold text-slate-400';
        return;
    }
    try {
        JSON.parse(input);
        status.innerText = 'VÁLIDO';
        status.className = 'text-[10px] font-bold text-emerald-500';
    } catch (e) {
        status.innerText = 'INVÁLIDO';
        status.className = 'text-[10px] font-bold text-red-500';
    }
};

window.prettifyJSON = () => {
    const input = document.getElementById('jsonInput').value;
    try {
        const obj = JSON.parse(input);
        document.getElementById('jsonOutput').value = JSON.stringify(obj, null, 4);
        window.processJSON();
    } catch (e) {
        document.getElementById('jsonOutput').value = "Erro: " + e.message;
    }
};

window.minifyJSON = () => {
    const input = document.getElementById('jsonInput').value;
    try {
        const obj = JSON.parse(input);
        document.getElementById('jsonOutput').value = JSON.stringify(obj);
        window.processJSON();
    } catch (e) {
        document.getElementById('jsonOutput').value = "Erro: " + e.message;
    }
};

window.copyJSON = () => {
    const output = document.getElementById('jsonOutput');
    output.select();
    document.execCommand('copy');
    window.CromApp.UI.showToast('Copiado!'); // Assuming showToast exists or use simple alert/feedback
};
