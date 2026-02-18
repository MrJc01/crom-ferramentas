// --- PASSWORD GENERATOR TOOL ---
window.CromApp.registerTool({
    id: 'pwd-gen',
    title: 'Gerador de Senha',
    desc: 'Crie senhas fortes localmente. Nenhuma dado sai do seu dispositivo.',
    icon: 'lock',
    color: 'bg-rose-500',
    tags: ['senha', 'segurança', 'privacidade', 'gerador'],
    render: () => `
        <div class="max-w-md mx-auto py-8">
            <div class="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl mb-6 flex items-center justify-between">
                <span id="pwdDisplay" class="font-mono text-xl tracking-wider select-all">Clique em Gerar</span>
                <button onclick="navigator.clipboard.writeText(document.getElementById('pwdDisplay').innerText)" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"><i data-lucide="copy"></i></button>
            </div>
            <button onclick="document.getElementById('pwdDisplay').innerText = Array(20).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()').map(x => x[Math.floor(Math.random() * x.length)]).join('')" class="w-full bg-rose-500 text-white py-4 rounded-xl font-bold hover:bg-rose-600 transition-colors">Gerar Nova Senha</button>
        </div>
    `
});
