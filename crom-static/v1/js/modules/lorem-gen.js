// --- LOREM IPSUM GENERATOR ---
window.CromApp.registerTool({
    id: 'lorem-gen',
    title: 'Lorem Ipsum',
    desc: 'Gerador de texto placeholder rápido.',
    icon: 'align-left',
    color: 'bg-slate-500',
    category: 'Texto',
    tags: ['lorem', 'ipsum', 'texto', 'gerador', 'design'],
    render: () => `
        <div class="flex flex-col gap-6">
            <!-- Controls -->
            <div class="flex gap-4 items-end bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
                <div class="flex flex-col gap-1 w-32">
                    <span class="text-[10px] font-bold text-slate-400">QUANTIDADE</span>
                    <input type="number" id="loremCount" value="3" min="1" max="50" class="p-2 rounded-lg border dark:border-slate-800 bg-white dark:bg-slate-950 font-bold">
                </div>
                <div class="flex flex-col gap-1 w-40">
                    <span class="text-[10px] font-bold text-slate-400">TIPO</span>
                    <select id="loremType" class="p-2 rounded-lg border dark:border-slate-800 bg-white dark:bg-slate-950">
                        <option value="paragraphs">Parágrafos</option>
                        <option value="sentences">Frases</option>
                        <option value="words">Palavras</option>
                    </select>
                </div>
                <button onclick="generateLorem()" class="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 h-10">Gerar</button>
                <div class="flex-1"></div>
                <button onclick="copyLorem()" class="text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg font-bold transition-colors">Copiar</button>
            </div>

            <!-- Output -->
            <textarea id="loremOutput" readonly class="flex-1 h-[400px] p-6 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 leading-relaxed resize-none text-lg"></textarea>
        </div>
    `
});

const LOREM_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

window.generateLorem = () => {
    const count = parseInt(document.getElementById('loremCount').value) || 3;
    const type = document.getElementById('loremType').value;
    const output = document.getElementById('loremOutput');

    let result = [];
    const baseSentences = LOREM_TEXT.split('. ').map(s => s.trim().replace('.', ''));

    // Simple logic: Repeat base sentences randomly
    if (type === 'paragraphs') {
        for (let i = 0; i < count; i++) {
            let paragraph = '';
            // 4-8 sentences per paragraph
            const len = 4 + Math.floor(Math.random() * 4);
            for (let j = 0; j < len; j++) {
                paragraph += baseSentences[j % baseSentences.length] + '. ';
            }
            result.push(paragraph.trim());
        }
        output.value = result.join('\n\n');
    } else if (type === 'sentences') {
        for (let i = 0; i < count; i++) {
            result.push(baseSentences[i % baseSentences.length] + '.');
        }
        output.value = result.join(' ');
    } else {
        // Words
        const words = LOREM_TEXT.replace(/[,.]/g, '').split(' ');
        for (let i = 0; i < count; i++) {
            result.push(words[i % words.length]);
        }
        output.value = result.join(' ');
    }
};

window.copyLorem = () => {
    const el = document.getElementById('loremOutput');
    el.select();
    document.execCommand('copy');
};
