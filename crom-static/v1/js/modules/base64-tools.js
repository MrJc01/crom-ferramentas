window.CromApp.registerTool({
    id: 'base64-tools',
    title: 'Base64 Converter',
    desc: 'Encoder e Decoder de strings e arquivos.',
    icon: 'binary',
    color: 'bg-blue-600',
    category: 'Desenvolvimento',
    render: () => `
        <div class="space-y-6">
            <div class="flex gap-4 border-b dark:border-slate-800 pb-4">
                <button onclick="CromModules.Base64.switchTab('text')" id="tab-text" class="text-blue-600 font-bold border-b-2 border-blue-600 pb-1">Texto</button>
                <button onclick="CromModules.Base64.switchTab('file')" id="tab-file" class="text-slate-500 font-bold pb-1 hover:text-blue-600">Arquivo para Base64</button>
            </div>

            <div id="view-text" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea id="b64Input" class="h-64 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-mono resize-none focus:ring-2 ring-blue-500 outline-none" placeholder="Cole seu texto aqui..."></textarea>
                <textarea id="b64Output" readonly class="h-64 p-4 rounded-lg bg-slate-100 dark:bg-slate-900 text-xs font-mono resize-none outline-none" placeholder="Resultado..."></textarea>
            </div>

            <div id="view-file" class="hidden text-center py-12 border-dashed border-2 border-slate-200 dark:border-slate-700 rounded-lg">
                <input type="file" onchange="CromModules.Base64.handleFile(this)" class="hidden" id="fileB64">
                <label for="fileB64" class="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">Selecionar Arquivo</label>
                <div id="fileResult" class="mt-6 max-w-xl mx-auto hidden">
                    <p class="text-xs text-slate-500 mb-2">Resultado (Copiado para área de transferência):</p>
                    <textarea id="fileOutput" class="w-full h-32 p-4 bg-slate-100 dark:bg-slate-900 rounded text-xs font-mono truncate"></textarea>
                </div>
            </div>

            <div class="flex justify-end gap-2" id="textActions">
                <button onclick="CromModules.Base64.process('encode')" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Encode</button>
                 <button onclick="CromModules.Base64.process('decode')" class="px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg font-bold hover:bg-slate-300">Decode</button>
            </div>
        </div>
    `,
    init: () => {
        window.CromModules = window.CromModules || {};
        window.CromModules.Base64 = {
            switchTab: (tab) => {
                document.getElementById('view-text').classList.toggle('hidden', tab !== 'text');
                document.getElementById('textActions').classList.toggle('hidden', tab !== 'text');
                document.getElementById('view-file').classList.toggle('hidden', tab !== 'file');

                document.getElementById('tab-text').className = tab === 'text' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-1' : 'text-slate-500 font-bold pb-1 hover:text-blue-600';
                document.getElementById('tab-file').className = tab === 'file' ? 'text-blue-600 font-bold border-b-2 border-blue-600 pb-1' : 'text-slate-500 font-bold pb-1 hover:text-blue-600';
            },
            process: (action) => {
                const input = document.getElementById('b64Input').value;
                const output = document.getElementById('b64Output');
                try {
                    if (action === 'encode') output.value = btoa(input);
                    else output.value = atob(input);
                } catch (e) {
                    output.value = "Erro: Input inválido para Base64";
                }
            },
            handleFile: (input) => {
                const file = input.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    const res = document.getElementById('fileResult');
                    const out = document.getElementById('fileOutput');
                    res.classList.remove('hidden');
                    out.value = e.target.result;
                    out.select();
                };
                reader.readAsDataURL(file);
            }
        };
    }
});
