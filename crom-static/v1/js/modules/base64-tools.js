// --- BASE64 TOOLS ---
window.CromApp.registerTool({
    id: 'base64-tools',
    title: 'Codificador Base64',
    desc: 'Codifique e decodifique textos e arquivos para Base64.',
    icon: 'binary',
    color: 'bg-purple-500',
    category: 'Dev',
    tags: ['base64', 'encode', 'decode', 'texto', 'arquivo'],
    render: () => `
        <div class="flex flex-col gap-6">
            <!-- Text Section -->
            <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-800">
                <h4 class="font-bold mb-4 flex items-center gap-2"><i data-lucide="type" class="w-4 h-4"></i> Texto</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <textarea id="b64TextInput" class="p-3 rounded-lg border dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm h-32 resize-none" placeholder="Digite o texto aqui..."></textarea>
                    <textarea id="b64TextOutput" readonly class="p-3 rounded-lg border dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm h-32 resize-none" placeholder="Resultado..."></textarea>
                </div>
                <div class="flex gap-2 mt-4">
                    <button onclick="b64EncodeText()" class="bg-purple-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-600 transition-colors">Codificar</button>
                    <button onclick="b64DecodeText()" class="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-6 py-2 rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Decodificar</button>
                </div>
            </div>

            <!-- File Section -->
            <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border dark:border-slate-800">
                <h4 class="font-bold mb-4 flex items-center gap-2"><i data-lucide="file" class="w-4 h-4"></i> Arquivo para Base64</h4>
                <input type="file" id="b64FileInput" onchange="b64ProcessFile()" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-slate-800 dark:file:text-purple-400">
                <div class="mt-4 relative">
                    <textarea id="b64FileOutput" readonly class="w-full p-3 rounded-lg border dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm h-32 font-mono resize-none" placeholder="String Base64 do arquivo aparecerá aqui..."></textarea>
                    <button onclick="copyB64File()" class="absolute top-2 right-2 text-xs bg-white dark:bg-slate-800 border dark:border-slate-700 px-2 py-1 rounded shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700">Copiar</button>
                </div>
            </div>
        </div>
    `
});

window.b64EncodeText = () => {
    const input = document.getElementById('b64TextInput').value;
    try {
        document.getElementById('b64TextOutput').value = btoa(unescape(encodeURIComponent(input))); // Handle UTF-8
    } catch (e) {
        document.getElementById('b64TextOutput').value = "Erro: " + e.message;
    }
};

window.b64DecodeText = () => {
    const input = document.getElementById('b64TextInput').value;
    try {
        document.getElementById('b64TextOutput').value = decodeURIComponent(escape(atob(input))); // Handle UTF-8
    } catch (e) {
        document.getElementById('b64TextOutput').value = "Erro: Invalido Base64";
    }
};

window.b64ProcessFile = () => {
    const fileInput = document.getElementById('b64FileInput');
    if (fileInput.files.length === 0) return;
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('b64FileOutput').value = e.target.result;
    };
    reader.onerror = function (e) {
        document.getElementById('b64FileOutput').value = "Erro ao ler arquivo.";
    };
    reader.readAsDataURL(file);
};

window.copyB64File = () => {
    const output = document.getElementById('b64FileOutput');
    output.select();
    document.execCommand('copy');
};
