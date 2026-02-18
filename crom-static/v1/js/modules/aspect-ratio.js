// --- ASPECT RATIO CALCULATOR ---
window.CromApp.registerTool({
    id: 'aspect-ratio',
    title: 'Aspect Ratio',
    category: 'Design',
    desc: 'Calculadora de proporção para designers e devs.',
    icon: 'ratio',
    color: 'bg-fuchsia-600',
    tags: ['ratio', 'aspect', 'proporcao', 'design', 'tela'],
    render: () => `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="flex flex-col gap-6">
                <!-- Inputs -->
                <div class="flex gap-4 items-center">
                    <div class="flex-1">
                        <label class="text-[10px] font-bold text-slate-400">LARGURA</label>
                        <input type="number" id="arW" value="1920" oninput="calcRatio()" class="w-full p-4 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-xl">
                    </div>
                    <span class="text-xl font-bold text-slate-300">x</span>
                    <div class="flex-1">
                        <label class="text-[10px] font-bold text-slate-400">ALTURA</label>
                        <input type="number" id="arH" value="1080" oninput="calcRatio()" class="w-full p-4 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-xl">
                    </div>
                </div>

                <!-- Result -->
                <div class="bg-fuchsia-50 dark:bg-fuchsia-900/20 p-6 rounded-2xl border border-fuchsia-100 dark:border-fuchsia-800 text-center">
                    <span class="text-xs font-bold text-fuchsia-500 uppercase">Proporção</span>
                    <div id="arResult" class="text-4xl font-black text-slate-800 dark:text-white my-2">16:9</div>
                </div>
            </div>

            <!-- Preview -->
            <div class="flex items-center justify-center p-8 bg-slate-100 dark:bg-slate-900 rounded-2xl h-64">
                <div id="arPreview" class="bg-fuchsia-500 shadow-xl transition-all duration-300 flex items-center justify-center text-white font-bold" style="width: 160px; height: 90px;">
                    Preview
                </div>
            </div>
        </div>
    `
});

window.calcRatio = () => {
    let w = parseInt(document.getElementById('arW').value) || 0;
    let h = parseInt(document.getElementById('arH').value) || 0;

    if (w === 0 || h === 0) return;

    // GCD
    function gcd(a, b) {
        return b == 0 ? a : gcd(b, a % b);
    }

    const r = gcd(w, h);
    const ratio = `${w / r}:${h / r}`;

    document.getElementById('arResult').innerText = ratio;

    // Update Preview (Max 200px)
    const preview = document.getElementById('arPreview');
    const max = 200;
    let pw, ph;

    if (w > h) {
        pw = max;
        ph = (h / w) * max;
    } else {
        ph = max;
        pw = (w / h) * max;
    }

    preview.style.width = `${pw}px`;
    preview.style.height = `${ph}px`;
};
