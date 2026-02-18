// --- QR CODE GENERATOR ---
window.CromApp.registerTool({
    id: 'qr-gen',
    title: 'Gerador QR Code',
    desc: 'Crie QR Codes personalizados (Links, Texto, Wi-Fi).',
    icon: 'qr-code',
    color: 'bg-indigo-500',
    category: 'Utilitários',
    tags: ['qr', 'codigo', 'gerador', 'link', 'wifi'],
    render: () => `
        <div class="flex flex-col md:flex-row gap-8 items-start">
             <div class="flex-1 w-full space-y-4">
                
                <!-- Mode Switcher -->
                <div class="flex gap-2 mb-4 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                    <button onclick="setQRMode('text')" id="btn-mode-text" class="flex-1 py-2 rounded-md text-sm font-bold bg-white dark:bg-slate-800 shadow-sm transition-all">Texto / URL</button>
                    <button onclick="setQRMode('wifi')" id="btn-mode-wifi" class="flex-1 py-2 rounded-md text-sm font-bold text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all">Wi-Fi</button>
                </div>

                <!-- Text Mode Input -->
                <div id="qr-input-text" class="flex flex-col gap-2">
                    <span class="text-[10px] font-bold text-slate-400">CONTEÚDO</span>
                    <input type="text" id="qrText" oninput="generateQR()" class="p-4 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Digite URL ou texto...">
                </div>

                <!-- WiFi Mode Inputs -->
                <div id="qr-input-wifi" class="hidden flex-col gap-3">
                    <div class="flex flex-col gap-1">
                        <span class="text-[10px] font-bold text-slate-400">REDE (SSID)</span>
                        <input type="text" id="wifiSSID" oninput="generateQR()" class="p-3 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Nome da Rede">
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-[10px] font-bold text-slate-400">SENHA</span>
                        <input type="text" id="wifiPass" oninput="generateQR()" class="p-3 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Senha da Rede">
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-[10px] font-bold text-slate-400">SEGURANÇA</span>
                        <select id="wifiType" onchange="generateQR()" class="p-3 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="WPA">WPA/WPA2</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">Sem Senha</option>
                        </select>
                    </div>
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
let currentQRMode = 'text';

window.setQRMode = (mode) => {
    currentQRMode = mode;
    const btnText = document.getElementById('btn-mode-text');
    const btnWifi = document.getElementById('btn-mode-wifi');
    const divText = document.getElementById('qr-input-text');
    const divWifi = document.getElementById('qr-input-wifi');

    if (mode === 'text') {
        btnText.className = "flex-1 py-2 rounded-md text-sm font-bold bg-white dark:bg-slate-800 shadow-sm transition-all";
        btnWifi.className = "flex-1 py-2 rounded-md text-sm font-bold text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all";
        divText.classList.remove('hidden');
        divWifi.classList.add('hidden');
    } else {
        btnWifi.className = "flex-1 py-2 rounded-md text-sm font-bold bg-white dark:bg-slate-800 shadow-sm transition-all";
        btnText.className = "flex-1 py-2 rounded-md text-sm font-bold text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all";
        divWifi.classList.remove('hidden');
        divText.classList.add('hidden');
    }
    generateQR();
};

window.generateQR = () => {
    let text = '';

    if (currentQRMode === 'text') {
        text = document.getElementById('qrText').value;
    } else {
        const ssid = document.getElementById('wifiSSID').value;
        const pass = document.getElementById('wifiPass').value;
        const type = document.getElementById('wifiType').value;
        if (ssid) {
            text = `WIFI:T:${type};S:${ssid};P:${pass};;`;
        }
    }

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
