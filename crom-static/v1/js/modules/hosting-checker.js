// hosting-checker.js
window.CromApp.registerTool({
    id: 'hosting-checker',
    title: 'Quem Hospeda? (Hosting Checker)',
    desc: 'Descubra a empresa de hospedagem e o IP de qualquer site.',
    icon: 'server',
    color: 'bg-indigo-600',
    category: 'Rede & SEO',
    render: () => `
        <div class="space-y-6">
            <div class="flex gap-2">
                <input type="text" id="hc-domain" placeholder="Ex: google.com" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500">
                <button onclick="HostingChecker.check()" class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Verificar</button>
            </div>
            <div id="hc-result" class="hidden p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800 space-y-4">
                <div class="flex justify-between items-center border-b pb-4 dark:border-slate-700">
                    <span class="text-slate-500 font-medium">Domínio</span>
                    <span id="hc-res-domain" class="font-bold"></span>
                </div>
                <div class="flex justify-between items-center border-b pb-4 dark:border-slate-700">
                    <span class="text-slate-500 font-medium">Endereço IPv4</span>
                    <span id="hc-res-ip" class="font-bold text-indigo-500"></span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-slate-500 font-medium">Provedor (ASN)</span>
                    <span id="hc-res-isp" class="font-bold text-amber-600 dark:text-amber-400"></span>
                </div>
                 <div class="flex justify-between items-center">
                    <span class="text-slate-500 font-medium">Organização / Roteamento</span>
                    <span id="hc-res-org" class="font-bold text-slate-700 dark:text-slate-300"></span>
                </div>
            </div>
             <div id="hc-error" class="hidden p-4 bg-red-50 text-red-600 rounded-xl border border-red-200"></div>
        </div>
    `,
    onOpen: () => {
        window.HostingChecker = {
            check: async () => {
                const domainInput = document.getElementById('hc-domain').value.trim();
                if (!domainInput) return;

                let domain = domainInput;
                if (domain.includes('://')) domain = domain.split('://')[1];
                domain = domain.split('/')[0];

                const btn = document.querySelector('button[onclick="HostingChecker.check()"]');
                const origText = btn.innerText;
                btn.innerText = 'Buscando...';
                btn.disabled = true;

                document.getElementById('hc-result').classList.add('hidden');
                document.getElementById('hc-error').classList.add('hidden');

                try {
                    // 1. Resolve IP via Cloudflare DoH public endpoint
                    const dnsRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`, {
                        headers: { 'accept': 'application/dns-json' }
                    });

                    if (!dnsRes.ok) throw new Error("Falha na resolução de DNS");

                    const dnsData = await dnsRes.json();
                    if (!dnsData.Answer || dnsData.Answer.length === 0) {
                        throw new Error("Domínio não possui registro A (IPv4)");
                    }

                    const ip = dnsData.Answer[dnsData.Answer.length - 1].data;

                    // 2. Resolve ISP/ORG via RDAP (ARIN/RIPE/LACNIC public apis)
                    // freeipapi is a good fallback since RDAP is disjointed across regions 
                    const rdapRes = await fetch(`https://freeipapi.com/api/json/${ip}`);

                    let isp = "Desconhecido";
                    let org = "Desconhecido";

                    if (rdapRes.ok) {
                        const rdapData = await rdapRes.json();
                        isp = "Consulte RDAP (via Terminal)"; // freeipapi doesn't always have ASN name for free, but let's try
                        org = rdapData.cityName ? `${rdapData.cityName}, ${rdapData.countryName}` : "Localização Indisponível";
                    }

                    // Attempt full RDAP format for ARIN
                    try {
                        const arinRes = await fetch(`https://rdap.arin.net/registry/ip/${ip}`);
                        if (arinRes.ok) {
                            const arinData = await arinRes.json();
                            if (arinData.name) isp = arinData.name;
                        }
                    } catch (silent) { }

                    document.getElementById('hc-res-domain').innerText = domain;
                    document.getElementById('hc-res-ip').innerText = ip;
                    document.getElementById('hc-res-isp').innerText = isp;
                    document.getElementById('hc-res-org').innerText = org;

                    document.getElementById('hc-result').classList.remove('hidden');

                } catch (e) {
                    const err = document.getElementById('hc-error');
                    err.innerText = e.message;
                    err.classList.remove('hidden');
                } finally {
                    btn.innerText = origText;
                    btn.disabled = false;
                }
            }
        }
    }
});
