// --- KEYCODE INFO ---
window.CromApp.registerTool({
    id: 'keycode-info',
    title: 'Visualizador de Teclas',
    category: 'Dev',
    desc: 'Descubra keyCodes, e.key e e.code.',
    icon: 'keyboard',
    color: 'bg-cyan-500',
    tags: ['key', 'keyboard', 'teclado', 'codigo', 'js'],
    render: () => `
        <div id="keyWait" class="py-32 text-center">
            <h3 class="text-2xl font-bold text-slate-400 animate-pulse">Pressione qualquer tecla...</h3>
        </div>
        
        <div id="keyInfo" class="hidden flex flex-col items-center gap-12 py-10">
            <div class="text-center">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">KeyboardEvent.key</span>
                <div id="kKey" class="text-8xl font-black text-cyan-500 mt-2">?</div>
            </div>
            
            <div class="grid grid-cols-3 gap-8">
                 <div class="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border dark:border-slate-800 text-center">
                    <span class="text-xs font-bold text-slate-400">e.code</span>
                    <div id="kCode" class="text-xl font-bold font-mono mt-1 text-slate-700 dark:text-slate-200">...</div>
                </div>
                 <div class="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border dark:border-slate-800 text-center">
                    <span class="text-xs font-bold text-slate-400">e.which</span>
                    <div id="kWhich" class="text-xl font-bold font-mono mt-1 text-slate-700 dark:text-slate-200">...</div>
                </div>
                 <div class="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border dark:border-slate-800 text-center">
                    <span class="text-xs font-bold text-slate-400">Location</span>
                    <div id="kLoc" class="text-xl font-bold font-mono mt-1 text-slate-700 dark:text-slate-200">...</div>
                </div>
            </div>
            
            <div class="text-sm text-slate-400">
                Pressione <span class="kbd">ESC</span> para sair da ferramenta.
            </div>
        </div>
    `
});

let keyListener = null;

// Hook into tool opening life-cycle? 
// Current architecture doesn't have onOpen/onClose hooks explicitly, 
// but we render string.
// We can attach global listener that checks if tool is active.
// BUT app.js adds specific openTool logic.
// We can use a script tag inside render to init? No, strict CSP might block.
// Or just attach to window and check active tool.

if (!window.keyInfoListenerAttached) {
    window.addEventListener('keydown', (e) => {
        // Only if tool active
        if (document.getElementById('keyWait') && !document.getElementById('keyWait').offsetParent === null) return; // Hidden check?
        const kKey = document.getElementById('kKey');
        if (kKey) {
            e.preventDefault();
            document.getElementById('keyWait').classList.add('hidden');
            document.getElementById('keyInfo').classList.remove('hidden');

            kKey.innerText = e.key === ' ' ? '(Space)' : e.key;
            document.getElementById('kCode').innerText = e.code;
            document.getElementById('kWhich').innerText = e.which;
            document.getElementById('kLoc').innerText = e.location;
        }
    });
    window.keyInfoListenerAttached = true;
}
