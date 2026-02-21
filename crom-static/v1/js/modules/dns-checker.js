// dns-checker.js
window.CromApp.registerTool({
    id: 'dns-checker',
    title: 'DNS Propagation Checker',
    desc: 'Verifique registros A, MX, TXT via DoH Global.',
    icon: 'globe',
    color: 'bg-emerald-600',
    category: 'Rede & SEO',
    popupSize: 'max-w-4xl', // Size definition as per app.js changes
    render: () => `
        <div class="space-y-6">
            <div class="flex gap-2">
                <input type="text" id="dns-domain" placeholder="Ex: google.com" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500">
                <select id="dns-type" class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500">
                    <option value="A">A</option>
                    <option value="AAAA">AAAA</option>
                    <option value="MX">MX</option>
                    <option value="TXT">TXT</option>
                    <option value="CNAME">CNAME</option>
                    <option value="NS">NS</option>
                </select>
                <button onclick="DnsChecker.check()" class="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">Testar</button>
            </div>
            
            <div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800 overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-xs">
                            <th class="p-4 font-bold">Servidor DNS</th>
                            <th class="p-4 font-bold">Status</th>
                            <th class="p-4 font-bold">Resposta (TTL)</th>
                        </tr>
                    </thead>
                    <tbody id="dns-results" class="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr><td colspan="3" class="p-8 text-center text-slate-400">Insira um domínio para verificar a propagação.</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    onOpen: () => {
        window.DnsChecker = {
            check: async () => {
                const domainInput = document.getElementById('dns-domain').value.trim();
                const type = document.getElementById('dns-type').value;
                if (!domainInput) return;

                let domain = domainInput;
                if (domain.includes('://')) domain = domain.split('://')[1];
                domain = domain.split('/')[0];
                const tbody = document.getElementById('dns-results');
                tbody.innerHTML = '';

                // Providers: Cloudflare e Google (We use DoH to simulate edge nodes propagation)
                const providers = [
                    { name: 'Cloudflare (Global)', url: `https://cloudflare-dns.com/dns-query?name=${domain}&type=${type}` },
                    { name: 'Google (Global)', url: `https://dns.google/resolve?name=${domain}&type=${type}` }
                ];

                for (const provider of providers) {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td class="p-4 font-medium">${provider.name}</td>
                        <td class="p-4"><div class="animate-pulse w-4 h-4 bg-amber-400 rounded-full"></div></td>
                        <td class="p-4 text-slate-400">Consultando...</td>
                    `;
                    tbody.appendChild(tr);

                    try {
                        const res = await fetch(provider.url, { headers: { 'accept': 'application/dns-json' } });
                        if (!res.ok) throw new Error();
                        const data = await res.json();

                        let answers = '';
                        if (data.Answer) {
                            answers = data.Answer.map(a => `<div class="font-mono text-sm break-all">${a.data} <span class="text-xs text-slate-400">(${a.TTL}s)</span></div>`).join('');
                        } else {
                            answers = '<span class="text-red-500">Não encontrado (NXDOMAIN)</span>';
                        }

                        tr.innerHTML = `
                            <td class="p-4 font-medium">${provider.name}</td>
                            <td class="p-4"><i data-lucide="check-circle" class="w-5 h-5 text-emerald-500"></i></td>
                            <td class="p-4">${answers}</td>
                        `;
                        lucide.createIcons();
                    } catch (e) {
                        tr.innerHTML = `
                            <td class="p-4 font-medium">${provider.name}</td>
                            <td class="p-4"><i data-lucide="x-circle" class="w-5 h-5 text-red-500"></i></td>
                            <td class="p-4 text-red-500">Falha na consulta</td>
                        `;
                        lucide.createIcons();
                    }
                }
            }
        };
    }
});
