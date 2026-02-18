// --- JWT DEBUGGER ---
window.CromApp.registerTool({
    id: 'jwt-debug',
    title: 'Debug JWT',
    desc: 'Decodifique tokens JWT (Header & Payload) localmente.',
    icon: 'shield-check',
    color: 'bg-pink-600',
    category: 'Dev',
    tags: ['jwt', 'token', 'auth', 'decode', 'json'],
    render: () => `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
            <div class="flex flex-col gap-2">
                <span class="text-[10px] font-bold text-slate-400">TOKEN ENCODED</span>
                <textarea id="jwtInput" oninput="decodeJWT()" class="flex-1 p-4 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-sm outline-none focus:ring-2 focus:ring-pink-500 resize-none text-pink-600 break-all" placeholder="ey..."></textarea>
            </div>
            
            <div class="flex flex-col gap-4 h-full overflow-y-auto pr-2">
                <div class="flex flex-col gap-2">
                    <span class="text-[10px] font-bold text-slate-400">HEADER</span>
                    <pre id="jwtHeader" class="p-4 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-xs overflow-x-auto text-slate-600 dark:text-slate-300 min-h-[100px]"></pre>
                </div>
                <div class="flex flex-col gap-2 flex-1">
                    <span class="text-[10px] font-bold text-slate-400">PAYLOAD</span>
                    <pre id="jwtPayload" class="flex-1 p-4 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-xs overflow-x-auto text-slate-600 dark:text-slate-300"></pre>
                </div>
            </div>
        </div>
    `
});

window.decodeJWT = () => {
    const token = document.getElementById('jwtInput').value.trim();
    if (!token) {
        document.getElementById('jwtHeader').innerText = '';
        document.getElementById('jwtPayload').innerText = '';
        return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
        document.getElementById('jwtHeader').innerText = 'Token inválido (Formato incorreto)';
        document.getElementById('jwtPayload').innerText = '';
        return;
    }

    try {
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));

        document.getElementById('jwtHeader').innerText = JSON.stringify(header, null, 2);
        document.getElementById('jwtPayload').innerText = JSON.stringify(payload, null, 2);
    } catch (e) {
        document.getElementById('jwtHeader').innerText = 'Erro ao decodificar Base64/JSON';
        console.error(e);
    }
};
