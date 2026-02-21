// --- MARKDOWN TO PDF TOOL ---
if (typeof marked !== 'undefined') {
    marked.setOptions({
        gfm: true,
        breaks: true
    });
}
window.CromApp.registerTool({
    id: 'md-pdf',
    title: 'Markdown → PDF',
    desc: 'Editor e conversor local com prévia real.',
    icon: 'file-text',
    color: 'bg-blue-500',
    category: 'Documentos',
    tags: ['markdown', 'pdf', 'texto', 'converter'],
    render: () => `
        <div class="block w-full">
            <!-- Header Options -->
            <div class="flex flex-col lg:flex-row items-center justify-between gap-6 p-5 mb-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                
                <!-- Left Section: Select Theme -->
                <div class="w-full lg:w-1/3 flex flex-col gap-1.5">
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aparência do Documento</label>
                    <div class="relative">
                        <select id="mdTheme" onchange="updateMDPreview()" class="w-full appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 py-2.5 pl-4 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer">
                            <option value="modern">Moderno (Helvetica, Clean)</option>
                            <option value="classic">Clássico (Serif, Acadêmico)</option>
                            <option value="github">GitHub Style (Docs)</option>
                            <option value="custom">CSS Customizado...</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                            <i data-lucide="chevron-down" class="w-4 h-4"></i>
                        </div>
                    </div>
                </div>

                <!-- Center Section: Extra Options (Checkboxes) -->
                <div class="w-full lg:flex-1 flex flex-col md:flex-row items-center lg:justify-center gap-4 py-3 border-y lg:border-y-0 lg:border-x border-slate-100 dark:border-slate-800">
                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" id="mdShowMetadata" onchange="updateMDPreview()" class="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer">
                        <span class="text-[13px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Sem FrontMatter (---)</span>
                    </label>

                    <label class="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" id="mdJustify" onchange="updateMDPreview()" checked class="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer">
                        <span class="text-[13px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Texto Justificado</span>
                    </label>
                </div>

                <!-- Right Section: Action Button -->
                <div class="w-full lg:w-auto flex justify-end">
                    <button onclick="generatePDF(this)" class="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95">
                        <i data-lucide="printer" class="w-4 h-4"></i> Imprimir PDF
                    </button>
                </div>
            </div>

            <!-- Custom CSS Field (Hidden By Default) -->
            <div id="customCSSContainer" class="hidden mb-4 animate-in slide-in-from-top-2 duration-200">
                 <label class="block text-xs font-bold text-blue-500 mb-1 flex items-center gap-2">
                    <i data-lucide="code-2" class="w-3 h-3"></i> Injeção de CSS Customizado (&lt;style&gt;)
                 </label>
                 <textarea id="mdCustomCSS" rows="3" onkeyup="updateMDPreview()" placeholder="body { background: white; } ..." class="w-full p-4 rounded-xl bg-slate-900 text-green-400 border border-slate-700 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[400px]">
                <div class="relative h-full w-full">
                    <span class="text-[10px] font-bold text-slate-400 absolute -top-5 left-1">EDITOR <i data-lucide="markdown" class="w-4 h-4 inline"></i></span>
                    <textarea id="mdInput" onkeyup="updateMDPreview()" class="h-full w-full p-4 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="# Comece a escrever..."></textarea>
                </div>
                <div class="relative h-full w-full">
                    <span class="text-[10px] font-bold text-slate-400 absolute -top-5 left-1">PRÉVIA</span>
                    <div id="mdPreview" class="h-full w-full bg-white border border-slate-200 rounded-xl p-6 overflow-y-auto override-default-prose" style="color: black !important;"></div>
                </div>
            </div>
        </div>
    `,
    onOpen: () => {
        // Delaying initialization to allow DOM mounting (increased for slow browsers/animations)
        setTimeout(() => {
            const initialText = "# Meu Documento\n\nEste é um exemplo de geração em Markdown puro e limpo.\n\n- Lista 1\n- Lista 2\n\n**Teste de Negrito** e *Itálico*.";
            const mdInput = document.getElementById('mdInput');
            if (mdInput) {
                mdInput.value = initialText;
                window.updateMDPreview();
            } else {
                console.error("Markdown UI: Delayed setup failed to capture #mdInput from DOM.");
            }
        }, 250);
    }
});

const getThemeCSS = () => {
    const theme = document.getElementById('mdTheme').value;
    const customContainer = document.getElementById('customCSSContainer');

    if (theme === 'custom') {
        customContainer.classList.remove('hidden');
        return document.getElementById('mdCustomCSS').value;
    } else {
        customContainer.classList.add('hidden');
    }

    switch (theme) {
        case 'classic': return `
            body { font-family: "Georgia", serif; line-height: 1.6; color: #111; max-width: 800px; margin: 0 auto; padding: 2cm; }
            h1, h2, h3 { font-family: "Times New Roman", serif; margin-top: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
            p { margin-bottom: 1.2em; }
            li { margin-bottom: 0.5em; }
            code { font-family: monospace; background: #f4f4f4; padding: 2px 5px; }
            pre { background: #f4f4f4; padding: 1em; overflow-x: auto; }
        `;
        case 'github': return `
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; line-height: 1.5; color: #24292f; max-width: 900px; margin: 0 auto; padding: 2rem; }
            h1, h2 { border-bottom: 1px solid #hsla(210,18%,87%,1); padding-bottom: .3em; margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; }
            h1 { font-size: 2em; } h2 { font-size: 1.5em; }
            blockquote { padding: 0 1em; color: #57606a; border-left: .25em solid #d0d7de; }
            code { background-color: rgba(175,184,193,0.2); border-radius: 6px; padding: .2em .4em; font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace; }
            pre code { background-color: transparent; padding: 0; }
            pre { padding: 16px; overflow: auto; background-color: #f6f8fa; border-radius: 6px; }
            table { border-spacing: 0; border-collapse: collapse; margin-bottom: 16px; }
            table th, table td { padding: 6px 13px; border: 1px solid #d0d7de; }
            table tr:nth-child(2n) { background-color: #f6f8fa; }
        `;
        default: return `
            body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 850px; margin: 0 auto; padding: 40px; }
            h1, h2, h3, h4 { color: #222; margin-top: 1.2em; font-weight: 700; }
            p { margin-bottom: 1rem; }
            a { color: #2563eb; text-decoration: none; }
            ul, ol { padding-left: 1.5rem; margin-bottom: 1rem; }
            pre { background: #1e293b; color: #f8fafc; padding: 1rem; border-radius: 8px; overflow-x: auto; font-family: monospace; }
        `;
    }
}

// Helpers attached to window for event attributes
window.updateMDPreview = () => {
    const mdInput = document.getElementById('mdInput');
    const previewDiv = document.getElementById('mdPreview');

    // Guard clause: Return silently if DOM hasn't finished painting
    if (!mdInput || !previewDiv) return;

    let input = mdInput.value;
    const showMeta = document.getElementById('mdShowMetadata')?.checked;
    const isJustified = document.getElementById('mdJustify')?.checked;

    // Filter Frontmatter/Metadata se mostrar estiver apagado
    if (!showMeta) {
        input = input.replace(/^---\n([\s\S]*?)\n---\n/, '');
    }

    const html = typeof marked !== 'undefined'
        ? marked.parse(input)
        : input.replace(/\n/g, '<br>');

    // Inject local Preview Styles
    let baseCss = getThemeCSS();
    if (isJustified) baseCss += '\n body { text-align: justify; }';

    const css = baseCss.replace(/body\s*{/g, '#mdPreview {').replace(/max-width:[^;]+;/g, '');
    previewDiv.innerHTML = `<style>${css}</style>` + (html || '<p class="text-slate-300">Digite algo para inicializar a prévia...</p>');
};

window.generatePDF = (btn) => {
    const mdInput = document.getElementById('mdInput');
    if (!mdInput || !mdInput.value) return alert('O conteúdo está vazio!');

    let input = mdInput.value;
    const showMeta = document.getElementById('mdShowMetadata')?.checked;
    const isJustified = document.getElementById('mdJustify')?.checked;

    // Filter Frontmatter/Metadata se ocultar
    if (!showMeta) {
        input = input.replace(/^---\n([\s\S]*?)\n---\n/, '');
    }

    const rawHtml = typeof marked !== 'undefined' ? marked.parse(input) : input.replace(/\n/g, '<br>');
    let css = getThemeCSS();
    if (isJustified) css += '\n body { text-align: justify; }';

    // Create a pristine invisible iframe or new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert('O bloqueador de Pop-ups impediu a janela de impressão. Permita pop-ups para este site.');

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Documento Markdown</title>
            <style>
                ${css}
                @media print {
                    @page { margin: 0; size: auto; }
                    body { 
                        -webkit-print-color-adjust: exact; 
                        print-color-adjust: exact; 
                        padding: 20mm !important; 
                        margin: 0 !important; 
                        max-width: none !important; 
                    }
                }
            </style>
        </head>
        <body>
            ${rawHtml}
            <script>
                // Dá um pequeno delay para carregar fontes
                setTimeout(() => {
                    window.print();
                    window.onafterprint = () => window.close();
                }, 500);
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
};
