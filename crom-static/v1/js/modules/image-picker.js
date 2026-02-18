// --- IMAGE PICKER ---
window.CromApp.registerTool({
    id: 'image-picker',
    title: 'Color Picker',
    category: 'Imagem',
    desc: 'Extraia cores de qualquer imagem.',
    icon: 'pipette',
    color: 'bg-pink-500',
    tags: ['imagem', 'cor', 'picker', 'pipeta', 'hex'],
    render: () => `
        <div class="flex flex-col gap-6 items-center">
            <!-- Upload -->
            <div id="pickerUpload" class="w-full h-32 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 relative">
                <div class="text-slate-400 font-bold">Clique para carregar imagem</div>
                <input type="file" accept="image/*" onchange="loadPickerImage(this)" class="absolute inset-0 opacity-0 cursor-pointer">
            </div>

            <!-- Editor -->
            <div id="pickerEditor" class="hidden w-full flex flex-col md:flex-row gap-6">
                <div class="flex-1 relative border rounded-xl overflow-hidden bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWNgYGAQIylznzmKZddoQCNbaGg0IwAA3XIg6X4cC68AAAAASUVORK5CYII=')]">
                     <canvas id="pickerCanvas" class="max-w-full cursor-crosshair"></canvas>
                </div>
                
                <div class="w-full md:w-64 flex flex-col gap-4">
                    <div id="pickedColorPreview" class="w-full h-24 rounded-xl shadow-lg border dark:border-slate-700 bg-white"></div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-bold text-slate-400">HEX</label>
                        <input type="text" id="pickedHex" readonly class="w-full p-2 rounded-lg border dark:border-slate-800 font-mono text-center select-all">
                    </div>
                     <div class="space-y-2">
                        <label class="text-[10px] font-bold text-slate-400">RGB</label>
                        <input type="text" id="pickedRgb" readonly class="w-full p-2 rounded-lg border dark:border-slate-800 font-mono text-center select-all">
                    </div>
                </div>
            </div>
        </div>
    `
});

window.loadPickerImage = (input) => {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.getElementById('pickerCanvas');
            const ctx = canvas.getContext('2d');

            // Resize canvas to fit but keep aspect
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            document.getElementById('pickerUpload').classList.add('hidden');
            document.getElementById('pickerEditor').classList.remove('hidden');

            // Listeners
            canvas.onclick = (evt) => pickColor(ctx, evt);
            canvas.onmousemove = (evt) => {
                if (evt.buttons === 1) pickColor(ctx, evt);
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

function pickColor(ctx, evt) {
    const rect = evt.target.getBoundingClientRect();
    const scaleX = evt.target.width / rect.width;
    const scaleY = evt.target.height / rect.height;

    const x = (evt.clientX - rect.left) * scaleX;
    const y = (evt.clientY - rect.top) * scaleY;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0], g = pixel[1], b = pixel[2];
    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    const rgb = `rgb(${r}, ${g}, ${b})`;

    document.getElementById('pickedColorPreview').style.backgroundColor = rgb;
    document.getElementById('pickedHex').value = hex;
    document.getElementById('pickedRgb').value = rgb;
}
