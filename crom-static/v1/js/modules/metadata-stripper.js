// --- METADATA STRIPPER TOOL ---
window.CromApp.registerTool({
    id: 'meta-strip',
    title: 'Metadata Stripper',
    desc: 'Remova dados ocultos (EXIF) de suas fotos para privacidade total.',
    icon: 'eraser',
    color: 'bg-purple-500',
    tags: ['exif', 'privacidade', 'limpar', 'foto'],
    render: () => `
         <div class="text-center py-20 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <i data-lucide="shield-check" class="mx-auto w-12 h-12 text-purple-500 mb-4"></i>
            <h3 class="text-xl font-bold">Limpeza de Metadados</h3>
            <p class="text-slate-400 mt-2">Remove GPS, modelo da câmera e data original.</p>
            <div class="relative mt-6 inline-block">
                 <button class="bg-purple-500 text-white px-10 py-3 rounded-xl font-bold hover:bg-purple-600 transition-colors pointer-events-none">Selecionar Fotos</button>
                 <input type="file" multiple accept="image/*" onchange="window.handleMetadataStrip(this)" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
            </div>
        </div>
    `
});

window.handleMetadataStrip = async (input) => {
    const files = input.files;
    if (!files || files.length === 0) return;

    const btn = input.parentElement.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Limpando...';

    window.CromApp.UI.showProgress('Iniciando limpeza...', true);
    window.CromApp.UI.updateProgress(0, 0, files.length);

    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            window.CromApp.UI.updateProgress(Math.floor((i / files.length) * 100), i + 1, files.length);
            document.getElementById('statusText').innerText = `Limpando ${file.name}...`;

            const formData = new FormData();
            formData.append('image', file);
            formData.append('action', 'strip');

            const response = await fetch(`${window.CromApp.API_BASE}/process/image`, { method: 'POST', body: formData });
            if (!response.ok) throw new Error('Falha no servidor');

            const blob = await response.blob();
            window.CromApp.UI.addResult(blob, `clean-${file.name}`);
        }
    } catch (e) {
        console.error(e);
        window.CromApp.UI.showError("Erro ao limpar metadados.");
    } finally {
        btn.innerText = originalText;
        input.value = '';
        window.CromApp.UI.updateProgress(100, files.length, files.length);
        window.CromApp.UI.hideProgress();
    }
};
