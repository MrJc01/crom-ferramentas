// meta-preview.js
window.CromApp.registerTool({
    id: 'meta-preview',
    title: 'Pré-visualizador de Metatags',
    desc: 'Simule o cartão OpenGraph de uma URL em redes sociais (Twitter, Google).',
    icon: 'layout-template',
    color: 'bg-blue-600',
    category: 'Rede & SEO',
    layoutType: 'fullscreen', // Abstração nova de visual
    render: () => `
        <div class="flex h-full bg-slate-50 dark:bg-slate-900 border-x dark:border-slate-800">
            <!-- Sidebar / Settings -->
            <div class="w-96 border-r dark:border-slate-800 p-6 flex flex-col gap-6 bg-white dark:bg-slate-950 overflow-y-auto z-10">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="font-black text-xl flex items-center gap-2">
                        <i data-lucide="scan-line" class="text-blue-500"></i> MetaPreview
                    </h3>
                </div>
                
                <div class="space-y-3">
                    <label class="text-sm font-bold text-slate-500">URL para Analisar (via API)</label>
                    <div class="flex gap-2">
                        <input type="text" id="mp-url" placeholder="https://exemplo.com" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500">
                    </div>
                    <button onclick="MetaPreviewer.scrape()" class="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2">
                        <i data-lucide="download-cloud" class="w-4 h-4"></i> Extrair Metatags
                    </button>
                    <div id="mp-error" class="hidden text-red-500 text-xs mt-2 bg-red-50 p-2 rounded-lg border border-red-100"></div>
                </div>
                
                <div class="border-t dark:border-slate-800 pt-6 space-y-4">
                    <h4 class="text-sm font-bold text-slate-500 uppercase tracking-widest">Editor Manual</h4>
                    
                    <div class="space-y-1">
                        <label class="text-xs font-bold text-slate-400">Title</label>
                        <input type="text" id="mp-title" value="Meu Site Incrível" oninput="MetaPreviewer.updateView()" class="w-full p-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 border dark:border-slate-700">
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-bold text-slate-400">Description</label>
                        <textarea id="mp-desc" oninput="MetaPreviewer.updateView()" rows="3" class="w-full p-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 border dark:border-slate-700">A melhor descrição possível para atrair cliques na timeline e indexar no Google organicamente.</textarea>
                    </div>
                     <div class="space-y-1">
                        <label class="text-xs font-bold text-slate-400">Dominio (Display)</label>
                        <input type="text" id="mp-domain" value="exemplo.com" oninput="MetaPreviewer.updateView()" class="w-full p-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 border dark:border-slate-700">
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-bold text-slate-400">Imagem Primária (URL)</label>
                        <input type="text" id="mp-img" value="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" oninput="MetaPreviewer.updateView()" class="w-full p-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 border dark:border-slate-700">
                    </div>
                </div>
            </div>
            
            <!-- Context Canvas Area -->
            <div class="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-slate-100 dark:bg-[#0a0a0a]">
                <div class="max-w-3xl mx-auto space-y-12 pb-24">
                    
                    <!-- Google Search Preview -->
                    <div class="space-y-3">
                        <h4 class="font-bold text-slate-500 flex items-center gap-2"><i data-lucide="search" class="w-4 h-4"></i> Busca do Google</h4>
                        <div class="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border dark:border-slate-800 max-w-[650px]">
                            <div class="flex items-center gap-3 mb-1">
                                <div class="w-7 h-7 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs">🌐</div>
                                <div>
                                    <div class="text-sm font-medium text-[#202124] dark:text-[#dadce0]">Site/Marca</div>
                                    <div class="text-[12px] text-[#4d5156] dark:text-[#bdc1c6] truncate w-64">https://<span id="p-google-domain">exemplo.com</span></div>
                                </div>
                            </div>
                            <h3 id="p-google-title" class="text-xl text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer">Meu Site Incrível</h3>
                            <p id="p-google-desc" class="text-sm text-[#4d5156] dark:text-[#bdc1c6] mt-1 line-clamp-2">A melhor descrição possível para atrair cliques na timeline e indexar no Google organicamente.</p>
                        </div>
                    </div>
                    
                    <!-- Twitter/X Large Image Preview -->
                    <div class="space-y-3">
                        <h4 class="font-bold text-slate-500 flex items-center gap-2"><i data-lucide="twitter" class="w-4 h-4 text-[#1DA1F2]"></i> Twitter / X</h4>
                        <div class="w-[500px] border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-black font-sans shadow-md">
                            <div class="w-full h-[260px] bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                                <img id="p-tw-img" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" class="w-full h-full object-cover">
                            </div>
                            <div class="p-4">
                                <div id="p-tw-domain" class="text-sm text-slate-500 dark:text-slate-400">exemplo.com</div>
                                <h3 id="p-tw-title" class="text-base text-black dark:text-white mt-0.5 truncate font-medium">Meu Site Incrível</h3>
                                <p id="p-tw-desc" class="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">A melhor descrição possível para atrair cliques na timeline e indexar no Google organicamente.</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- LinkedIn/Facebook Preview -->
                    <div class="space-y-3">
                        <h4 class="font-bold text-slate-500 flex items-center gap-2"><i data-lucide="facebook" class="w-4 h-4 text-[#1877F2]"></i> LinkedIn / Facebook</h4>
                        <div class="w-[500px] bg-[#f0f2f5] dark:bg-[#18191a] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 font-sans shadow-sm">
                            <div class="w-full h-[260px] bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                <img id="p-fb-img" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" class="w-full h-full object-cover">
                            </div>
                            <div class="p-3 bg-[#e4e6eb] dark:bg-[#242526]">
                                <div id="p-fb-domain" class="text-[12px] uppercase text-slate-500 dark:text-[#b0b3b8]">EXEMPLO.COM</div>
                                <h3 id="p-fb-title" class="text-base font-bold text-black dark:text-[#e4e6eb] mt-0.5">Meu Site Incrível</h3>
                                <p id="p-fb-desc" class="text-[13px] text-slate-600 dark:text-[#b0b3b8] mt-1 line-clamp-1">A melhor descrição possível para atrair cliques na timeline e indexar no Google organicamente.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    onOpen: () => {
        window.MetaPreviewer = {
            updateView: () => {
                const title = document.getElementById('mp-title').value || 'Sem Título';
                const desc = document.getElementById('mp-desc').value || 'Sem descrição definida.';
                const domain = document.getElementById('mp-domain').value || 'exemplo.com';
                const img = document.getElementById('mp-img').value;

                // Sync Google
                document.getElementById('p-google-title').innerText = title;
                document.getElementById('p-google-desc').innerText = desc;
                document.getElementById('p-google-domain').innerText = domain;

                // Sync Twitter
                document.getElementById('p-tw-title').innerText = title;
                document.getElementById('p-tw-desc').innerText = desc;
                document.getElementById('p-tw-domain').innerText = domain;
                if (img) document.getElementById('p-tw-img').src = img;

                // Sync Facebook/LinkedIn
                document.getElementById('p-fb-title').innerText = title;
                document.getElementById('p-fb-desc').innerText = desc;
                document.getElementById('p-fb-domain').innerText = domain.toUpperCase();
                if (img) document.getElementById('p-fb-img').src = img;
            },
            scrape: async () => {
                const urlInput = document.getElementById('mp-url').value;
                const err = document.getElementById('mp-error');
                err.classList.add('hidden');

                if (!urlInput) return;

                // Using allorigins to bypass CORS
                try {
                    const btn = document.querySelector('button[onclick="MetaPreviewer.scrape()"]');
                    const origBtnText = btn.innerHTML;
                    btn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Lendo URL...';
                    lucide.createIcons();
                    // Proxy avoiding CORS returning raw HTML
                    const apiUrl = window.CromApp.services.backend.url || 'http://localhost:8082';
                    const proxyUrl = `${apiUrl}/v1/proxy/meta?url=${encodeURIComponent(urlInput)}`;
                    const res = await fetch(proxyUrl);
                    if (!res.ok) throw new Error("Erro de Proxy Local");
                    const html = await res.text();

                    if (!html) throw new Error("A página não retornou HTML");

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");

                    const getMeta = (propOptions, nameOptions) => {
                        let selectors = [];
                        if (propOptions) propOptions.forEach(p => selectors.push(`meta[property="${p}"]`));
                        if (nameOptions) nameOptions.forEach(n => selectors.push(`meta[name="${n}"]`));

                        const el = doc.querySelector(selectors.join(','));
                        return el ? el.getAttribute("content") : '';
                    }

                    const title = getMeta(["og:title", "twitter:title"], ["title"]) || doc.title || "";
                    const desc = getMeta(["og:description", "twitter:description"], ["description"]) || "";
                    let img = getMeta(["og:image", "twitter:image"], []) || "";

                    if (img && !img.startsWith('http')) {
                        try {
                            const baseObj = new URL(urlInput);
                            img = new URL(img, baseObj.origin).href;
                        } catch (e) { }
                    }

                    const domainObj = new URL(urlInput);
                    const domain = domainObj.hostname;

                    document.getElementById('mp-title').value = title;
                    document.getElementById('mp-desc').value = desc;
                    document.getElementById('mp-domain').value = domain;
                    document.getElementById('mp-img').value = img;

                    window.MetaPreviewer.updateView();
                    btn.innerHTML = origBtnText;
                    lucide.createIcons();

                } catch (e) {
                    err.innerText = "Falha ao extrair metatags. O site alvo bloqueou o acesso ou CORS falhou.";
                    err.classList.remove('hidden');
                    const btn = document.querySelector('button[onclick="MetaPreviewer.scrape()"]');
                    btn.innerHTML = '<i data-lucide="download-cloud" class="w-4 h-4"></i> Extrair Metatags';
                    lucide.createIcons();
                }
            }
        };

        setTimeout(() => window.MetaPreviewer.updateView(), 100);
    }
});
