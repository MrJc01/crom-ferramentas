// --- POMODORO ---
window.CromApp.registerTool({
    id: 'pomodoro',
    title: 'Foco Pomodoro',
    category: 'Utilitários',
    desc: 'Timer de foco (25/5/15) com notificações.',
    icon: 'timer',
    color: 'bg-red-500',
    tags: ['pomodoro', 'tempo', 'foco', 'timer'],
    render: () => `
        <div class="text-center py-10">
            <div class="mb-10">
                 <div id="pomoTimer" class="text-9xl font-black font-mono text-slate-800 dark:text-white tabular-nums tracking-tight">25:00</div>
                 <div id="pomoStatus" class="text-xl font-bold text-slate-400 mt-4 uppercase tracking-widest">Pronto para focar?</div>
            </div>
            
            <div class="flex justify-center gap-4 mb-8">
                <button onclick="setPomoMode(25)" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 font-bold">Pomodoro (25)</button>
                <button onclick="setPomoMode(5)" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 font-bold">Curta (5)</button>
                <button onclick="setPomoMode(15)" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 font-bold">Longa (15)</button>
            </div>

            <button id="pomoAction" onclick="togglePomo()" class="bg-red-500 text-white w-24 h-24 rounded-full text-4xl shadow-2xl hover:scale-110 transition-transform flex items-center justify-center">
                <i data-lucide="play" class="fill-current ml-2"></i>
            </button>
        </div>
    `
});

let pomoInterval = null;
let pomoTime = 25 * 60;
let isRunning = false;

window.setPomoMode = (min) => {
    stopPomo();
    pomoTime = min * 60;
    updateDisplay();
    document.getElementById('pomoStatus').innerText = min === 25 ? 'Modo Foco' : 'Modo Pausa';
};

window.togglePomo = () => {
    if (isRunning) stopPomo();
    else startPomo();
};

window.startPomo = () => {
    if (pomoInterval) return;

    // Permission for notification
    if (Notification.permission === 'default') Notification.requestPermission();

    isRunning = true;
    updateBtn(true);

    pomoInterval = setInterval(() => {
        pomoTime--;
        updateDisplay();

        if (pomoTime <= 0) {
            stopPomo();
            new Notification("Crom Tools", { body: "O tempo acabou!" });
            // Simple beep
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.play().catch(e => { });
        }
    }, 1000);
};

window.stopPomo = () => {
    clearInterval(pomoInterval);
    pomoInterval = null;
    isRunning = false;
    updateBtn(false);
};

function updateDisplay() {
    const m = Math.floor(pomoTime / 60).toString().padStart(2, '0');
    const s = (pomoTime % 60).toString().padStart(2, '0');
    const el = document.getElementById('pomoTimer');
    if (el) el.innerText = `${m}:${s}`;
    document.title = `${m}:${s} - Pomodoro`;
}

function updateBtn(running) {
    const btn = document.getElementById('pomoAction');
    if (btn) {
        btn.innerHTML = running
            ? '<i data-lucide="pause" class="fill-current"></i>'
            : '<i data-lucide="play" class="fill-current ml-2"></i>';
        lucide.createIcons();
    }
}
