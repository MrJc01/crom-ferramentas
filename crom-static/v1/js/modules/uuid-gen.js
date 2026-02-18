// --- UUID GENERATOR ---
window.CromApp.registerTool({
    id: 'uuid-gen',
    title: 'Gerador de UUID',
    category: 'Dev',
    desc: 'Gere UUIDs v4, IDs curtos e mais em massa.',
    icon: 'fingerprint',
    color: 'bg-violet-600',
    tags: ['uuid', 'id', 'guid', 'v4', 'nanoid'],
    render: () => `
        <div class="flex flex-col gap-6">
            <div class="flex gap-4 items-end bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
                 <div class="flex flex-col gap-1 w-32">
                    <span class="text-[10px] font-bold text-slate-400">QUANTIDADE</span>
                    <input type="number" id="uuidCount" value="5" min="1" max="100" class="p-2 rounded-lg border dark:border-slate-800 bg-white dark:bg-slate-950 font-bold">
                </div>
                 <div class="flex flex-col gap-1 w-40">
                    <span class="text-[10px] font-bold text-slate-400">TIPO</span>
                    <select id="uuidType" class="p-2 rounded-lg border dark:border-slate-800 bg-white dark:bg-slate-950">
                        <option value="v4">UUID v4 (Random)</option>
                        <option value="nano">NanoID (URL Safe)</option>
                        <option value="simple">Simples (Alphanum)</option>
                    </select>
                </div>
                <button onclick="generateUUIDs()" class="bg-violet-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-violet-700 h-10">Gerar</button>
            </div>
            
            <textarea id="uuidOutput" readonly class="flex-1 h-[400px] p-6 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-slate-600 dark:text-slate-300 leading-relaxed resize-none text-lg select-all"></textarea>
        </div>
    `
});

window.generateUUIDs = () => {
    const count = parseInt(document.getElementById('uuidCount').value) || 5;
    const type = document.getElementById('uuidType').value;
    const output = document.getElementById('uuidOutput');

    let result = [];

    for (let i = 0; i < count; i++) {
        if (type === 'v4') {
            result.push(crypto.randomUUID());
        } else if (type === 'nano') {
            result.push(nanoid(21));
        } else {
            result.push(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
        }
    }
    output.value = result.join('\n');
};

// Simple NanoID impl since we don't have modules/imports
function nanoid(size = 21) {
    const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
    let id = '';
    let i = size;
    while (i--) {
        id += urlAlphabet[(Math.random() * 64) | 0];
    }
    return id;
}
