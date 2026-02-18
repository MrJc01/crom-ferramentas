// --- URL TOOLS ---
window.CromApp.registerTool({
    id: 'url-tools',
    title: 'Ferramentas de URL',
    desc: 'Encode, Decode e Parser de Parâmetros.',
    icon: 'link',
    color: 'bg-blue-600',
    category: 'Dev',
    tags: ['url', 'link', 'encode', 'decode', 'parser'],
    render: () => `
        <div class="flex flex-col gap-6">
            <!-- Encode/Decode -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea id="urlInput" class="p-3 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm h-32" placeholder="Cola sua URL ou texto aqui..."></textarea>
                <div class="flex flex-col gap-2 justify-center">
                     <button onclick="doUrl('encode')" class="bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">Encode URI Component</button>
                     <button onclick="doUrl('decode')" class="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-2 rounded-lg font-bold hover:bg-slate-300">Decode URI Component</button>
                     <button onclick="parseUrl()" class="border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 py-2 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800">Parsear Parâmetros ↓</button>
                </div>
            </div>
            <textarea id="urlOutput" readonly class="p-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 text-sm h-32 font-mono" placeholder="Resultado..."></textarea>
            
            <!-- Params Table -->
            <div id="urlParamsResult" class="hidden">
                <h4 class="font-bold mb-2 text-xs text-slate-400">PARÂMETROS DA URL</h4>
                <div class="overflow-x-auto rounded-xl border dark:border-slate-800">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-slate-100 dark:bg-slate-800 text-slate-500">
                            <tr>
                                <th class="p-3">Chave</th>
                                <th class="p-3">Valor</th>
                            </tr>
                        </thead>
                        <tbody id="urlParamsBody" class="bg-white dark:bg-slate-900 divide-y dark:divide-slate-800">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
});

window.doUrl = (action) => {
    const input = document.getElementById('urlInput').value;
    const output = document.getElementById('urlOutput');
    try {
        if (action === 'encode') output.value = encodeURIComponent(input);
        else output.value = decodeURIComponent(input);
    } catch (e) {
        output.value = "Erro: " + e.message;
    }
};

window.parseUrl = () => {
    const input = document.getElementById('urlInput').value;
    try {
        const url = new URL(input.startsWith('http') ? input : 'http://placeholder.com?' + input);
        const params = new URLSearchParams(url.search);

        const tbody = document.getElementById('urlParamsBody');
        tbody.innerHTML = '';

        let count = 0;
        params.forEach((value, key) => {
            count++;
            tbody.innerHTML += `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="p-3 font-mono font-bold text-blue-600">${key}</td>
                    <td class="p-3 font-mono break-all">${value}</td>
                </tr>
            `;
        });

        if (count > 0) {
            document.getElementById('urlParamsResult').classList.remove('hidden');
        } else {
            document.getElementById('urlInput').focus();
            alert("Nenhum parâmetro encontrado.");
        }

    } catch (e) {
        alert("URL inválida para parse.");
    }
};
