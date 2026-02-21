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
                <button onclick="window.compareDiff()" class="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-500/30">Comparar</button>
            </div>
        </div>
    `,
});


// Global Helper
window.compareDiff = () => {
    const left = document.getElementById('diffLeft').value;
    const right = document.getElementById('diffRight').value;
    const container = document.getElementById('diffResult');

    container.innerHTML = '';

    // Utilize jsdiff library for word-level comparison
    if (typeof Diff === 'undefined') {
        container.innerHTML = '<div class="text-red-500 font-bold p-4 text-center">Erro: A biblioteca Diff.js não carregou da internet. Verifique sua conexão.</div>';
        container.classList.remove('hidden');
        return;
    }

    const diff = Diff.diffWordsWithSpace(left, right);
    const fragment = document.createDocumentFragment();

    // Create side-by-side or inline view? For standard word diff, an inline highlighted paragraph is much better for long strings.
    // The user issue was: Long string "asdasdasdasd" overflowed because no line breaks and bad table display.

    const div = document.createElement('div');
    // Important CSS for long unbroken strings: break-all and whitespace pre-wrap
    div.className = 'w-full text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words leading-relaxed p-4 font-mono text-sm tracking-tight';

    diff.forEach((part) => {
        // green for additions, red for deletions, grey for common parts
        const colorClass = part.added
            ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-bold px-1 rounded inline-block mx-0.5'
            : part.removed
                ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 line-through font-bold px-1 rounded inline-block mx-0.5'
                : 'text-slate-500 dark:text-slate-400';

        const span = document.createElement('span');
        span.className = colorClass;
        span.appendChild(document.createTextNode(part.value));
        div.appendChild(span);
    });

    fragment.appendChild(div);

    container.appendChild(fragment);
    container.classList.remove('hidden');
};
