// --- IMAGE CONVERTER TOOL ---
window.CromApp.registerTool({
    id: 'img-conv',
    title: 'Conversor de Imagem',
    desc: 'WebP, PNG, JPG processados localmente ou via nuvem.',
    icon: 'image',
    color: 'bg-emerald-500',
    category: 'Imagem',
    tags: ['imagem', 'foto', 'conversor', 'png', 'jpg'],
    render: () => `
        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border dark:border-slate-800">
                    <label class="block text-sm font-bold text-slate-500 mb-2">Formato de Saída</label>
                    <select id="img-format" class="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="webp">WebP (Recomendado)</option>
                        <option value="png">PNG (Transparente)</option>
                        <option value="jpeg">JPG (Fotografia)</option>
                    </select>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border dark:border-slate-800">
                    <div class="flex justify-between">
                        <label class="block text-sm font-bold text-slate-500 mb-2">Qualidade/Compressão</label>
                        <span id="img-quality-val" class="font-bold text-emerald-500">80%</span>
                    </div>
                    <input type="range" id="img-quality" min="1" max="100" value="80" class="w-full accent-emerald-500" oninput="document.getElementById('img-quality-val').innerText = this.value + '%'">
                </div>
            </div>

            <div class="text-center py-20 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative">
                <i data-lucide="upload" class="mx-auto w-12 h-12 text-emerald-500 mb-4"></i>
                <h3 class="text-xl font-bold">Arraste seus arquivos</h3>
                <p class="text-slate-400 mt-2">Processamento Híbrido: < 2MB (Local), > 2MB (Nuvem Segura)</p>
                <div class="relative mt-6 inline-block">
                    <button class="bg-emerald-500 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors pointer-events-none">Escolher Arquivos</button>
                    <input type="file" multiple onchange="window.handleImageUpload(this)" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
                </div>
            </div>
        </div>
    `
});

// Logic
async function processImageBatch(files) {
    const MAX_LOCAL_SIZE = 2 * 1024 * 1024; // 2MB
    const total = files.length;

    window.CromApp.UI.showProgress('Iniciando processamento...', true);
    window.CromApp.UI.updateProgress(0, 0, total);

    const format = document.getElementById('img-format').value;
    const quality = document.getElementById('img-quality').value / 100;

    for (let i = 0; i < total; i++) {
        const file = files[i];
        window.CromApp.UI.updateProgress(Math.floor((i / total) * 100), i + 1, total);
        document.getElementById('statusText').innerText = `Processando ${file.name}...`;

        try {
            let blob;
            if (file.size > MAX_LOCAL_SIZE) {
                console.log(`File ${file.name} > 2MB, sending to server.`);
                blob = await processImageServer(file, format, quality);
            } else {
                console.log(`File ${file.name} < 2MB, processing locally.`);
                blob = await processImageLocal(file, format, quality);
            }
            window.CromApp.UI.addResult(blob, `processed-${file.name}`);
        } catch (e) {
            console.error(`Error processing ${file.name}:`, e);
            // Optionally show specific error for file
        }
    }

    window.CromApp.UI.updateProgress(100, total, total);
    window.CromApp.UI.hideProgress();
}

async function processImageServer(file, format, quality) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('action', 'convert');
    formData.append('format', format);
    formData.append('quality', quality);

    const response = await fetch(`${window.CromApp.API_BASE}/process/image`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) throw new Error('Server Error');
    return await response.blob();
}

let imageWorkerPool = null;
function getImageWorkerPool() {
    if (!imageWorkerPool) {
        const concurrency = navigator.hardwareConcurrency || 4;
        imageWorkerPool = new window.CromApp.WorkerPool('crom-static/v1/js/worker-image.js', concurrency);
    }
    return imageWorkerPool;
}

function processImageLocal(file, format, quality) {
    return new Promise((resolve, reject) => {
        if (window.Worker) {
            // Read file as ArrayBuffer first
            const reader = new FileReader();
            reader.onload = function (e) {
                const buffer = e.target.result;

                getImageWorkerPool().run({
                    buffer: buffer,
                    type: file.type,
                    name: file.name,
                    action: 'convert',
                    format: format,
                    quality: quality
                }, []).then(data => { // Empty transfer list
                    resolve(data.blob);
                }).catch(err => {
                    reject(err);
                });
            };
            reader.onerror = (e) => reject("Failed to read file: " + e);
            reader.readAsArrayBuffer(file);
        } else {
            reject("Web Workers not supported");
        }
    });
}

window.handleImageUpload = async (input) => {
    const files = input.files;
    if (!files || files.length === 0) return;

    const btn = input.parentElement.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Processando...';

    try {
        await processImageBatch(files);
    } catch (e) {
        console.error(e);
        window.CromApp.UI.showError("Erro inesperado no processamento de imagens.");
    } finally {
        btn.innerText = originalText;
        input.value = '';
    }
};
