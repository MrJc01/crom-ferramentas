// Image Processing Worker - Optimized for ArrayBuffer
self.onmessage = async function (e) {
    const { buffer, type, action, format, name } = e.data;

    try {
        if (!buffer) throw new Error("No buffer provided");

        // Report progress (optional, but good for UI if we hook it up later)
        self.postMessage({ type: 'progress', status: 'decoding' });

        // Create Blob from ArrayBuffer
        const blobInput = new Blob([buffer], { type: type });

        // Create Bitmap
        const bitmap = await createImageBitmap(blobInput);

        // Prepare Canvas
        const { width, height } = bitmap;
        const offscreen = new OffscreenCanvas(width, height);
        const ctx = offscreen.getContext('2d');

        // Draw
        ctx.drawImage(bitmap, 0, 0);

        let outFormat = 'image/png';
        if (format === 'jpeg' || format === 'jpg') outFormat = 'image/jpeg';
        else if (format === 'webp') outFormat = 'image/webp';

        const q = (outFormat === 'image/jpeg' || outFormat === 'image/webp') ? e.data.quality : undefined;

        // Ensure async conversion completes
        const blobOutput = await offscreen.convertToBlob({
            type: outFormat,
            quality: q
        });

        if (!blobOutput) throw new Error("Conversion resulted in empty blob");

        // Send Success
        self.postMessage({
            success: true,
            type: 'result',
            blob: blobOutput,
            name: name
        });

    } catch (error) {
        self.postMessage({
            success: false,
            type: 'result',
            error: error.message || "Unknown Worker Error"
        });
    }
};
