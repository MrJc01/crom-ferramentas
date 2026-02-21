window.CromApp.registerTool({
    id: 'qr-generator',
    title: 'Gerador de QR Code',
    desc: 'Gera códigos QR instantaneamente no navegador.',
    icon: 'qr-code',
    color: 'bg-black dark:bg-white dark:text-black',
    category: 'Utilidades',
    render: () => `
        <div class="flex flex-col items-center gap-6 py-10">
            <input type="text" id="qrText" placeholder="Digite URL ou texto..." 
                class="w-full max-w-lg px-6 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-transparent text-lg text-center focus:border-indigo-500 outline-none transition-colors"
                onkeyup="window.generateQR(this.value)">
            
            <div id="qrCanvasContainer" class="p-4 bg-white rounded-xl shadow-lg border border-slate-100 hidden">
                <div id="qrcode"></div>
            </div>
            
            <button onclick="window.downloadQR()" id="qrDownloadBtn" class="hidden text-sm text-indigo-500 hover:underline">Baixar Imagem</button>
        </div>
    `
});

// Global Helpers
window.generateQR = (text) => {
    const container = document.getElementById('qrcode');
    const wrapper = document.getElementById('qrCanvasContainer');
    const btn = document.getElementById('qrDownloadBtn');

    container.innerHTML = ''; // Clear

    if (!text.trim()) {
        wrapper.classList.add('hidden');
        btn.classList.add('hidden');
        return;
    }

    wrapper.classList.remove('hidden');

    try {
        new QRCode(container, {
            text: text,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel ? QRCode.CorrectLevel.H : 2 // Fallback to 2 (H) if enum missing
        });
        btn.classList.remove('hidden');
    } catch (e) {
        console.error("QRCode generation failed:", e);
        container.innerHTML = '<div class="text-red-500 text-sm py-4">Erro ao gerar código. Biblioteca ausente?</div>';
    }
};

window.downloadQR = () => {
    const img = document.querySelector('#qrcode img');
    if (img) {
        const a = document.createElement('a');
        a.href = img.src;
        a.download = 'qrcode.png';
        a.click();
    }
};
