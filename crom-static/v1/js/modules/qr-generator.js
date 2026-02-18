// --- QR CODE GENERATOR ---
window.CromApp.registerTool({
    id: 'qr-gen',
    title: 'Gerador QR Code',
    desc: 'Crie QR Codes personalizados localmente.',
    icon: 'qr-code',
    color: 'bg-indigo-500',
    tags: ['qr', 'codigo', 'gerador', 'link'],
    render: () => `
        <div class="flex flex-col md:flex-row gap-8 items-start">
             <div class="flex-1 w-full space-y-4">
                <div class="flex flex-col gap-2">
                    <span class="text-[10px] font-bold text-slate-400">CONTEÚDO</span>
                    <input type="text" id="qrText" oninput="generateQR()" class="p-4 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Digite URL ou texto...">
                </div>
                <div class="grid grid-cols-2 gap-4">
                     <div class="flex flex-col gap-2">
                        <span class="text-[10px] font-bold text-slate-400">COR FRENTE</span>
                        <input type="color" id="qrColorDark" value="#000000" onchange="generateQR()" class="w-full h-10 rounded-lg cursor-pointer">
                    </div>
                     <div class="flex flex-col gap-2">
                        <span class="text-[10px] font-bold text-slate-400">COR FUNDO</span>
                        <input type="color" id="qrColorLight" value="#ffffff" onchange="generateQR()" class="w-full h-10 rounded-lg cursor-pointer">
                    </div>
                </div>
                <button onclick="downloadQR()" class="w-full bg-indigo-500 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors">Baixar PNG</button>
             </div>
             
             <div class="w-full md:w-auto flex justify-center items-center bg-white dark:bg-white p-8 rounded-2xl border dark:border-slate-800 shadow-sm">
                <div id="qrCodeContainer"></div>
             </div>
        </div>
    `
});

let qrCodeObj = null;

window.generateQR = () => {
    const text = document.getElementById('qrText').value;
    const colorDark = document.getElementById('qrColorDark').value;
    const colorLight = document.getElementById('qrColorLight').value;
    const container = document.getElementById('qrCodeContainer');

    container.innerHTML = '';

    if (!text) {
        container.innerHTML = '<div class="text-slate-300 text-xs text-center px-4">Digite algo...</div>';
        return;
    }

    if (typeof QRCode === 'undefined') {
        container.innerHTML = '<div class="text-red-500 text-xs">Erro: Biblioteca QRCode não carregada.</div>';
        return;
    }

    try {
        qrCodeObj = new QRCode(container, {
            text: text,
            width: 256,
            height: 256,
            colorDark: colorDark,
            colorLight: colorLight,
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div class="text-red-500 text-xs">Erro ao gerar.</div>';
    }
};

window.downloadQR = () => {
    const container = document.getElementById('qrCodeContainer');
    const img = container.querySelector('img');
    if (img) {
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = img.src;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert("Gere um QR Code primeiro!");
    }
};
