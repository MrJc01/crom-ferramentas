// --- DEVICE INFO ---
window.CromApp.registerTool({
    id: 'device-info',
    title: 'Info do Dispositivo',
    desc: 'Analise seu navegador, tela e capacidades.',
    icon: 'monitor-smartphone',
    color: 'bg-indigo-800',
    category: 'Utilitários',
    tags: ['device', 'info', 'browser', 'screen', 'ua'],
    render: () => `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Main Info -->
            <div class="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                <h4 class="font-bold text-indigo-800 dark:text-indigo-300 mb-4 flex items-center gap-2"><i data-lucide="globe"></i> Navegador</h4>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between"><span class="text-slate-500">Browser:</span> <span class="font-bold">${getBrowserName()}</span></div>
                     <div class="flex justify-between"><span class="text-slate-500">Idioma:</span> <span class="font-bold">${navigator.language}</span></div>
                     <div class="flex justify-between"><span class="text-slate-500">Plataforma:</span> <span class="font-bold">${navigator.platform}</span></div>
                     <div class="flex justify-between"><span class="text-slate-500">Cores:</span> <span class="font-bold">${screen.colorDepth}-bit</span></div>
                </div>
            </div>

            <div class="bg-fuchsia-50 dark:bg-fuchsia-900/20 p-6 rounded-2xl border border-fuchsia-100 dark:border-fuchsia-800">
                <h4 class="font-bold text-fuchsia-800 dark:text-fuchsia-300 mb-4 flex items-center gap-2"><i data-lucide="maximize"></i> Tela</h4>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between"><span class="text-slate-500">Resolução:</span> <span class="font-bold">${screen.width} x ${screen.height}</span></div>
                     <div class="flex justify-between"><span class="text-slate-500">Janela:</span> <span class="font-bold" id="winSize">...</span></div>
                     <div class="flex justify-between"><span class="text-slate-500">PixelRatio:</span> <span class="font-bold">${window.devicePixelRatio}x</span></div>
                     <div class="flex justify-between"><span class="text-slate-500">Orientação:</span> <span class="font-bold">${screen.orientation ? screen.orientation.type : 'N/A'}</span></div>
                </div>
            </div>

            <!-- User Agent -->
            <div class="col-span-1 md:col-span-2 p-6 rounded-2xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <h4 class="font-bold text-xs text-slate-400 mb-2">USER AGENT</h4>
                <div class="font-mono text-xs break-all text-slate-600 dark:text-slate-300 bg-white dark:bg-black p-4 rounded-lg border dark:border-slate-800 select-all">
                    ${navigator.userAgent}
                </div>
            </div>
        </div>
    `
});

// Helpers
function getBrowserName() {
    const ua = navigator.userAgent;
    if (ua.includes("Chrome")) return "Chrome / Chromium";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    return "Desconhecido";
}

// Live Updater
window.updateDeviceInfo = () => {
    const el = document.getElementById('winSize');
    if (el) {
        el.innerText = `${window.innerWidth} x ${window.innerHeight}`;
    }
};

window.addEventListener('resize', window.updateDeviceInfo);

// Initial check (and periodically to catch when tool opens)
setInterval(window.updateDeviceInfo, 500);
