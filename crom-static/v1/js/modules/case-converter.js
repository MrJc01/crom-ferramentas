// --- CASE CONVERTER ---
window.CromApp.registerTool({
    id: 'case-converter',
    title: 'Case Converter',
    category: 'Texto',
    desc: 'CamelCase, snake_case, UPPERCASE e mais.',
    icon: 'type',
    color: 'bg-orange-500',
    tags: ['case', 'texto', 'camel', 'snake', 'formatar'],
    render: () => `
        <div class="flex flex-col gap-6">
            <textarea id="caseInput" placeholder="Digite seu texto..." class="h-32 p-4 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono"></textarea>
            
            <div class="flex flex-wrap gap-3 justify-center">
                <button onclick="convertCase('upper')" class="btn-case">UPPERCASE</button>
                <button onclick="convertCase('lower')" class="btn-case">lowercase</button>
                <button onclick="convertCase('title')" class="btn-case">Title Case</button>
                <button onclick="convertCase('sentence')" class="btn-case">Sentence case</button>
                <div class="w-full md:w-auto border-r dark:border-slate-800 mx-2"></div>
                <button onclick="convertCase('camel')" class="btn-case font-mono text-orange-600">camelCase</button>
                <button onclick="convertCase('pascal')" class="btn-case font-mono text-orange-600">PascalCase</button>
                <button onclick="convertCase('snake')" class="btn-case font-mono text-orange-600">snake_case</button>
                <button onclick="convertCase('kebab')" class="btn-case font-mono text-orange-600">kebab-case</button>
            </div>

             <textarea id="caseOutput" readonly placeholder="Resultado" class="h-32 p-4 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"></textarea>
        </div>
        <style>
            .btn-case {
                @apply px-4 py-2 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm;
            }
        </style>
    `
});

window.convertCase = (type) => {
    let text = document.getElementById('caseInput').value;
    if (!text) return;

    let result = '';

    switch (type) {
        case 'upper': result = text.toUpperCase(); break;
        case 'lower': result = text.toLowerCase(); break;
        case 'title': result = text.toLowerCase().replace(/(?:^|\s)\w/g, a => a.toUpperCase()); break;
        case 'sentence': result = text.toLowerCase().replace(/(^\w|\.\s+\w)/gm, a => a.toUpperCase()); break;
        case 'camel':
            result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
            break;
        case 'pascal':
            result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
            result = result.charAt(0).toUpperCase() + result.slice(1);
            break;
        case 'snake':
            result = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                .map(x => x.toLowerCase()).join('_');
            break;
        case 'kebab':
            result = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                .map(x => x.toLowerCase()).join('-');
            break;
    }
    document.getElementById('caseOutput').value = result;
};
