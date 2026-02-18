// --- TIME TOOLS ---
window.CromApp.registerTool({
    id: 'time-tools',
    title: 'Unix Timestamp',
    desc: 'Conversor de Data <-> Epoch Timestamp.',
    icon: 'clock',
    color: 'bg-teal-600',
    category: 'Utilitários',
    tags: ['tempo', 'data', 'epoch', 'unix', 'timestamp'],
    render: () => `
        <div class="max-w-2xl mx-auto space-y-8">
            <!-- Current Time -->
            <div class="text-center p-8 bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-100 dark:border-teal-800">
                <span class="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">Agora</span>
                <div id="currentEpoch" class="text-4xl md:text-6xl font-black font-mono my-2 text-slate-800 dark:text-slate-100">0000000000</div>
                <div id="currentDate" class="text-slate-500">...</div>
            </div>

            <!-- Converter -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Epoch to Date -->
                <div class="flex flex-col gap-4">
                    <h4 class="font-bold border-b pb-2">Epoch para Data</h4>
                    <input type="number" id="inputEpoch" placeholder="Ex: 1700000000" class="p-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono">
                    <button onclick="convertEpochToDate()" class="bg-teal-600 text-white py-2 rounded-lg font-bold hover:bg-teal-700">Converter ↓</button>
                    <div id="resultDate" class="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg min-h-[50px] text-sm text-slate-600 dark:text-slate-300"></div>
                </div>

                <!-- Date to Epoch -->
                <div class="flex flex-col gap-4">
                    <h4 class="font-bold border-b pb-2">Data para Epoch</h4>
                    <input type="datetime-local" id="inputDate" class="p-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono">
                    <button onclick="convertDateToEpoch()" class="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-2 rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-600">Converter ↓</button>
                    <div id="resultEpoch" class="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg min-h-[50px] text-sm font-mono text-slate-600 dark:text-slate-300"></div>
                </div>
            </div>
        </div>
    `
});

// Live Clock
setInterval(() => {
    const now = new Date();
    const epochEl = document.getElementById('currentEpoch');
    if (epochEl) {
        epochEl.innerText = Math.floor(now.getTime() / 1000);
        document.getElementById('currentDate').innerText = now.toLocaleString();
    }
}, 1000);

window.convertEpochToDate = () => {
    const val = document.getElementById('inputEpoch').value;
    if (!val) return;
    const date = new Date(val * 1000); // Assume Seconds
    document.getElementById('resultDate').innerHTML = `
        LOCAL: ${date.toLocaleString()}<br>
        ISO: ${date.toISOString()}
    `;
};

window.convertDateToEpoch = () => {
    const val = document.getElementById('inputDate').value;
    if (!val) return;
    const date = new Date(val);
    const epoch = Math.floor(date.getTime() / 1000);
    document.getElementById('resultEpoch').innerText = epoch;
};
