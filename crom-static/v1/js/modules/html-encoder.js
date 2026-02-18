// --- HTML ENCODER ---
window.CromApp.registerTool({
    id: 'html-encoder',
    title: 'HTML Encoder',
    category: 'Dev',
    desc: 'Escape/Unescape de caracteres especiais HTML.',
    icon: 'code',
    color: 'bg-orange-600',
    tags: ['html', 'encode', 'escape', 'dev'],
    render: () => `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
            <div class="flex flex-col gap-2">
                <span class="text-[10px] font-bold text-slate-400">INPUT</span>
                <textarea id="htmlInput" class="flex-1 p-4 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-950 font-mono text-sm" placeholder="<div class='test'>&</div>"></textarea>
                <div class="flex gap-2">
                    <button onclick="htmlAction('encode')" class="flex-1 bg-orange-600 text-white py-2 rounded-lg font-bold">Encode &→</button>
                    <button onclick="htmlAction('decode')" class="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-2 rounded-lg font-bold">Decode &larr;</button>
                </div>
            </div>
            
             <div class="flex flex-col gap-2">
                <span class="text-[10px] font-bold text-slate-400">OUTPUT</span>
                <textarea id="htmlOutput" readonly class="flex-1 p-4 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-mono text-sm" placeholder="&lt;div class=..."></textarea>
                <button onclick="copyHtml()" class="text-orange-600 font-bold py-2">Copiar Resultado</button>
            </div>
        </div>
    `
});

window.htmlAction = (action) => {
    const input = document.getElementById('htmlInput').value;
    const output = document.getElementById('htmlOutput');

    if (action === 'encode') {
        output.value = input.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
            return '&#' + i.charCodeAt(0) + ';';
        });
    } else {
        const doc = new DOMParser().parseFromString(input, "text/html");
        output.value = doc.documentElement.textContent;
    }
};

window.copyHtml = () => {
    const el = document.getElementById('htmlOutput');
    el.select();
    document.execCommand('copy');
};
