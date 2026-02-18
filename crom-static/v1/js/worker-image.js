// Image Processing Worker - Enhanced for Batch Processing
self.onmessage = async function (e) {
    const { files, file, action, format } = e.data;

    // Normalize input: handle both single file and array of files
    const inputFiles = files ? files : (file ? [file] : []);

    if (inputFiles.length === 0) {
        self.postMessage({ success: false, error: "No files provided" });
        return;
    }

    const total = inputFiles.length;
    let processed = 0;

    for (let i = 0; i < total; i++) {
        const currentFile = inputFiles[i];
        try {
            // Report start of processing for this file
            self.postMessage({ type: 'progress', index: i, total: total, status: 'processing' });

            const bitmap = await createImageBitmap(currentFile);
            const offscreen = new OffscreenCanvas(bitmap.width, bitmap.height);
            const ctx = offscreen.getContext('2d');

            ctx.drawImage(bitmap, 0, 0);

            // Conversion logic
            const blob = await offscreen.convertToBlob({
                type: format === 'png' ? 'image/png' : 'image/jpeg',
                quality: 0.85
            });

            // Send result for this specific file
            self.postMessage({
                success: true,
                blob: blob,
                fileName: currentFile.name,
                index: i,
                total: total,
                type: 'result'
            });

            processed++;
        } catch (error) {
            self.postMessage({
                success: false,
                error: error.message,
                fileName: currentFile.name,
                index: i,
                total: total,
                type: 'result'
            });
        }
    }

    // Signal batch completion
    self.postMessage({ type: 'complete', processed: processed, total: total });
};
