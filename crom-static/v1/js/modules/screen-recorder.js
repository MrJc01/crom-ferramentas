// --- SCREEN RECORDER ---
window.CromApp.registerTool({
    id: 'screen-recorder',
    title: 'Gravador de Tela',
    desc: 'Grave sua tela sem instalar nada. 100% Local.',
    icon: 'video',
    color: 'bg-red-600',
    category: 'Vídeo',
    tags: ['gravador', 'tela', 'video', 'screen', 'record'],
    render: () => `
        <div class="text-center py-10 flex flex-col items-center gap-6">
            <div id="recorderStatus" class="hidden animate-pulse text-red-500 font-bold flex items-center gap-2">
                <span class="w-3 h-3 bg-red-500 rounded-full"></span> GRAVANDO
            </div>

            <video id="previewVideo" class="w-full max-w-3xl rounded-xl shadow-2xl bg-black aspect-video hidden" controls></video>

            <div class="flex gap-4">
                <button id="btnStart" onclick="startRecording()" class="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 flex items-center gap-2 transition-all">
                    <i data-lucide="circle-dot"></i> Iniciar Gravação
                </button>
                <button id="btnStop" onclick="stopRecording()" class="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 hidden flex items-center gap-2 transition-all">
                    <i data-lucide="square"></i> Parar
                </button>
                <button id="btnDownload" onclick="downloadRecording()" class="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 hidden flex items-center gap-2 transition-all">
                    <i data-lucide="download"></i> Baixar Vídeo
                </button>
            </div>
            
            <p class="text-slate-400 text-sm max-w-md">O navegador pedirá permissão para escolher qual janela ou tela gravar. O vídeo é processado na memória e não é enviado para nenhum servidor.</p>
        </div>
    `
});

let mediaRecorder;
let recordedChunks = [];
let recordedUrl = null;

window.startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: "screen" },
            audio: true // System audio if supported
        });

        recordedChunks = [];
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) recordedChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            recordedUrl = URL.createObjectURL(blob);

            const video = document.getElementById('previewVideo');
            video.src = recordedUrl;
            video.classList.remove('hidden');

            document.getElementById('btnStart').classList.remove('hidden');
            document.getElementById('btnStart').innerText = 'Gravar Novamente';
            document.getElementById('btnStop').classList.add('hidden');
            document.getElementById('btnDownload').classList.remove('hidden');
            document.getElementById('recorderStatus').classList.add('hidden');

            // Stop all tracks to clear "sharing" indicator
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();

        document.getElementById('btnStart').classList.add('hidden');
        document.getElementById('btnStop').classList.remove('hidden');
        document.getElementById('btnDownload').classList.add('hidden');
        document.getElementById('previewVideo').classList.add('hidden');
        document.getElementById('recorderStatus').classList.remove('hidden');

        // Handle user clicking "Stop sharing" native browser button
        stream.getVideoTracks()[0].onended = () => {
            if (mediaRecorder.state !== 'inactive') stopRecording();
        };

    } catch (e) {
        console.error(e);
        alert("Permissão negada ou erro ao iniciar gravação.");
    }
};

window.stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
};

window.downloadRecording = () => {
    if (recordedUrl) {
        const a = document.createElement('a');
        a.href = recordedUrl;
        a.download = `gravacao-${new Date().getTime()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};
