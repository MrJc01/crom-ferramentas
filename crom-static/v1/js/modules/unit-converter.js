// --- UNIT CONVERTER ---
window.CromApp.registerTool({
    id: 'unit-converter',
    title: 'Conversor de Unidades',
    desc: 'Pixels/REM, Temperatura, Peso e Distância.',
    icon: 'ruler',
    color: 'bg-lime-600',
    category: 'Utilitários',
    tags: ['unidade', 'conversor', 'px', 'rem', 'celsius', 'kg'],
    render: () => `
        <div class="max-w-xl mx-auto flex flex-col gap-8">
            <!-- Type Selector -->
            <div class="flex justify-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                 <button onclick="setUnitMode('web')" class="flex-1 py-2 rounded-lg font-bold text-sm bg-white dark:bg-slate-700 shadow-sm transition-all focus:ring-2">Web (PX/REM)</button>
                 <button onclick="setUnitMode('temp')" class="flex-1 py-2 rounded-lg font-bold text-sm text-slate-500 hover:bg-white/50 transition-all focus:ring-2">Temp</button>
            </div>

            <!-- Web Converter -->
            <div id="unit-web" class="flex flex-col gap-4">
                 <div class="flex items-center gap-4">
                    <div class="flex-1">
                        <label class="text-[10px] font-bold text-slate-400">PIXELS (px)</label>
                        <input type="number" id="inputPx" value="16" oninput="convertWeb('px')" class="w-full p-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 text-lg font-bold">
                    </div>
                    <i data-lucide="arrow-right-left" class="text-slate-300"></i>
                    <div class="flex-1">
                        <label class="text-[10px] font-bold text-slate-400">REM</label>
                        <input type="number" id="inputRem" value="1" oninput="convertWeb('rem')" class="w-full p-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 text-lg font-bold">
                    </div>
                 </div>
                 <div class="text-center text-xs text-slate-400">Base: 16px</div>
            </div>

             <!-- Temp Converter -->
            <div id="unit-temp" class="hidden flex flex-col gap-4">
                 <div class="flex items-center gap-4">
                    <div class="flex-1">
                        <label class="text-[10px] font-bold text-slate-400">CELSIUS (°C)</label>
                        <input type="number" id="inputC" value="0" oninput="convertTemp('c')" class="w-full p-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 text-lg font-bold">
                    </div>
                    <i data-lucide="arrow-right-left" class="text-slate-300"></i>
                    <div class="flex-1">
                        <label class="text-[10px] font-bold text-slate-400">FAHRENHEIT (°F)</label>
                        <input type="number" id="inputF" value="32" oninput="convertTemp('f')" class="w-full p-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 text-lg font-bold">
                    </div>
                 </div>
            </div>
        </div>
    `
});

window.setUnitMode = (mode) => {
    document.getElementById('unit-web').classList.add('hidden');
    document.getElementById('unit-temp').classList.add('hidden');
    document.getElementById(`unit-${mode}`).classList.remove('hidden');
};

window.convertWeb = (source) => {
    if (source === 'px') {
        const px = document.getElementById('inputPx').value;
        document.getElementById('inputRem').value = px / 16;
    } else {
        const rem = document.getElementById('inputRem').value;
        document.getElementById('inputPx').value = rem * 16;
    }
};

window.convertTemp = (source) => {
    if (source === 'c') {
        const c = document.getElementById('inputC').value;
        document.getElementById('inputF').value = (c * 9 / 5) + 32;
    } else {
        const f = document.getElementById('inputF').value;
        document.getElementById('inputC').value = (f - 32) * 5 / 9;
    }
};
