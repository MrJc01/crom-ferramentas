// --- COLOR CONVERTER ---
window.CromApp.registerTool({
    id: 'color-tools',
    title: 'Conversor de Cores',
    desc: 'Converta entre HEX, RGB e HSL com prévia.',
    icon: 'palette',
    color: 'bg-rose-500',
    category: 'Design',
    tags: ['cor', 'rgb', 'hex', 'hsl', 'design'],
    render: () => `
        <div class="max-w-2xl mx-auto space-y-8">
            <!-- Preview -->
            <div id="colorPreview" class="w-full h-32 rounded-2xl shadow-inner border dark:border-slate-700 transition-colors bg-rose-500 flex items-center justify-center">
                 <span id="contrastText" class="text-white font-bold text-2xl mix-blend-difference">Cor Atual</span>
            </div>

            <div class="grid grid-cols-1 gap-6">
                <!-- HEX -->
                <div class="flex flex-col gap-2">
                    <span class="text-[10px] font-bold text-slate-400">HEX</span>
                    <div class="relative">
                        <span class="absolute left-4 top-3 text-slate-400">#</span>
                        <input type="text" id="inputHex" value="f43f5e" oninput="updateColor('hex')" class="w-full p-3 pl-8 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono uppercase focus:ring-2 focus:ring-rose-500" maxlength="6">
                    </div>
                </div>

                <!-- RGB -->
                <div class="flex gap-4">
                    <div class="flex flex-col gap-2 flex-1">
                        <span class="text-[10px] font-bold text-slate-400">R</span>
                        <input type="number" id="inputR" value="244" min="0" max="255" oninput="updateColor('rgb')" class="w-full p-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono focus:ring-2 focus:ring-rose-500">
                    </div>
                    <div class="flex flex-col gap-2 flex-1">
                        <span class="text-[10px] font-bold text-slate-400">G</span>
                        <input type="number" id="inputG" value="63" min="0" max="255" oninput="updateColor('rgb')" class="w-full p-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono focus:ring-2 focus:ring-rose-500">
                    </div>
                    <div class="flex flex-col gap-2 flex-1">
                        <span class="text-[10px] font-bold text-slate-400">B</span>
                        <input type="number" id="inputB" value="94" min="0" max="255" oninput="updateColor('rgb')" class="w-full p-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono focus:ring-2 focus:ring-rose-500">
                    </div>
                </div>

                <!-- HSL -->
                <div class="flex gap-4">
                    <div class="flex flex-col gap-2 flex-1">
                        <span class="text-[10px] font-bold text-slate-400">H (°)</span>
                        <input type="number" id="inputH" value="350" min="0" max="360" oninput="updateColor('hsl')" class="w-full p-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono focus:ring-2 focus:ring-rose-500">
                    </div>
                    <div class="flex flex-col gap-2 flex-1">
                        <span class="text-[10px] font-bold text-slate-400">S (%)</span>
                        <input type="number" id="inputS" value="89" min="0" max="100" oninput="updateColor('hsl')" class="w-full p-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono focus:ring-2 focus:ring-rose-500">
                    </div>
                    <div class="flex flex-col gap-2 flex-1">
                        <span class="text-[10px] font-bold text-slate-400">L (%)</span>
                        <input type="number" id="inputL" value="60" min="0" max="100" oninput="updateColor('hsl')" class="w-full p-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 font-mono focus:ring-2 focus:ring-rose-500">
                    </div>
                </div>
            </div>
        </div>
    `
});

window.updateColor = (source) => {
    let r, g, b, h, s, l, hex;

    if (source === 'hex') {
        hex = document.getElementById('inputHex').value;
        if (hex.length < 3) return; // Wait for input
        // Expand shorthand
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        if (hex.length !== 6) return;

        const bigint = parseInt(hex, 16);
        r = (bigint >> 16) & 255;
        g = (bigint >> 8) & 255;
        b = bigint & 255;

        // Update RGB Inputs
        document.getElementById('inputR').value = r;
        document.getElementById('inputG').value = g;
        document.getElementById('inputB').value = b;

        // Calc HSL
        [h, s, l] = rgbToHsl(r, g, b);
        updateHSLInputs(h, s, l);

    } else if (source === 'rgb') {
        r = parseInt(document.getElementById('inputR').value) || 0;
        g = parseInt(document.getElementById('inputG').value) || 0;
        b = parseInt(document.getElementById('inputB').value) || 0;

        // Update Hex
        hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        document.getElementById('inputHex').value = hex;

        // Calc HSL
        [h, s, l] = rgbToHsl(r, g, b);
        updateHSLInputs(h, s, l);

    } else if (source === 'hsl') {
        h = parseInt(document.getElementById('inputH').value) || 0;
        s = parseInt(document.getElementById('inputS').value) || 0;
        l = parseInt(document.getElementById('inputL').value) || 0;

        [r, g, b] = hslToRgb(h / 360, s / 100, l / 100);

        // Update RGB
        document.getElementById('inputR').value = r;
        document.getElementById('inputG').value = g;
        document.getElementById('inputB').value = b;

        // Update Hex
        hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        document.getElementById('inputHex').value = hex;
    }

    // Update Preview
    document.getElementById('colorPreview').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
};

function updateHSLInputs(h, s, l) {
    document.getElementById('inputH').value = Math.round(h * 360);
    document.getElementById('inputS').value = Math.round(s * 100);
    document.getElementById('inputL').value = Math.round(l * 100);
}

// Helpers
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
