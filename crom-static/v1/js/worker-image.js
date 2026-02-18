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

        // Convert to output format
        // Default to PNG if not specified
        const outFormat = format === 'jpeg' || format === 'jpg' ? 'image/jpeg' : 'image/png';
        const quality = outFormat === 'image/jpeg' ? 0.90 : undefined;

        const blobOutput = await offscreen.convertToBlob({
            type: outFormat,
            quality: quality
        });

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
            error: error.message
        });
    }
};
