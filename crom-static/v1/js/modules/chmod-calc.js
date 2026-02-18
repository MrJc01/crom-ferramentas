// --- CHMOD CALCULATOR ---
window.CromApp.registerTool({
    id: 'chmod-calc',
    title: 'Calculadora Chmod',
    category: 'Dev',
    desc: 'Permissões Unix (0777, rwxrwxrwx) visuais.',
    icon: 'terminal',
    color: 'bg-green-600',
    tags: ['chmod', 'unix', 'linux', 'permissions', 'terminal'],
    render: () => `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <!-- Grid -->
            <div class="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-6">
                <div class="grid grid-cols-4 gap-4 mb-4 text-center font-bold text-xs text-slate-400">
                    <div class="text-left">SCOPE</div>
                    <div>READ (4)</div>
                    <div>WRITE (2)</div>
                    <div>EXEC (1)</div>
                </div>
                
                ${['Owner', 'Group', 'Public'].map(scope => `
                    <div class="grid grid-cols-4 gap-4 items-center border-t dark:border-slate-800 py-4">
                        <div class="font-bold text-sm">${scope}</div>
                        <div class="flex justify-center"><input type="checkbox" onchange="calcChmod()" class="chmod-chk w-5 h-5 accent-green-600" data-scope="${scope}" data-val="4"></div>
                        <div class="flex justify-center"><input type="checkbox" onchange="calcChmod()" class="chmod-chk w-5 h-5 accent-green-600" data-scope="${scope}" data-val="2"></div>
                        <div class="flex justify-center"><input type="checkbox" onchange="calcChmod()" class="chmod-chk w-5 h-5 accent-green-600" data-scope="${scope}" data-val="1"></div>
                    </div>
                `).join('')}
            </div>

            <!-- Result -->
            <div class="space-y-6">
                <div>
                    <label class="text-[10px] font-bold text-slate-400">OCTAL</label>
                    <input type="text" id="chmodOctal" readonly value="000" class="w-full p-4 rounded-xl bg-slate-800 text-green-400 font-mono text-3xl font-bold text-center">
                </div>
                 <div>
                    <label class="text-[10px] font-bold text-slate-400">SYMBOLIC</label>
                    <input type="text" id="chmodSymbolic" readonly value="---------" class="w-full p-4 rounded-xl bg-slate-800 text-white font-mono text-xl text-center">
                </div>
                <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-200">
                    <i data-lucide="alert-triangle" class="inline w-4 h-4 mr-1"></i>
                    Comando: <span id="chmodCmd" class="font-mono font-bold">chmod 000 file.txt</span>
                </div>
            </div>
        </div>
    `
});

window.calcChmod = () => {
    let octal = '';
    let symbolic = '';

    ['Owner', 'Group', 'Public'].forEach(scope => {
        let val = 0;
        let sym = '';

        // Find checkboxes for this scope
        const inputs = Array.from(document.querySelectorAll(`.chmod-chk[data-scope="${scope}"]`));

        // Read 4
        if (inputs[0].checked) { val += 4; sym += 'r'; } else { sym += '-'; }
        // Write 2
        if (inputs[1].checked) { val += 2; sym += 'w'; } else { sym += '-'; }
        // Exec 1
        if (inputs[2].checked) { val += 1; sym += 'x'; } else { sym += '-'; }

        octal += val;
        symbolic += sym;
    });

    document.getElementById('chmodOctal').value = octal;
    document.getElementById('chmodSymbolic').value = symbolic;
    document.getElementById('chmodCmd').innerText = `chmod ${octal} file.txt`;
};
