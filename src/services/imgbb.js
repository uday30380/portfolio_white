/**
 * ImgBB Image Upload Service
 * Provides direct, serverless image upload to ImgBB cloud storage
 * Returns permanent CDN image URLs (https://i.ibb.co/...)
 */

// Default API key (fallback if env var not set)
const DEFAULT_IMGBB_API_KEY = 'f410ef289973c372cc0f84e66515b974';

export const getImgBBApiKey = () => {
    try {
        const storedKey = localStorage.getItem('imgbb_api_key');
        if (storedKey && storedKey.trim()) return storedKey.trim();
    } catch {
        // Ignore localStorage errors in restricted environments
    }
    return import.meta.env.VITE_IMGBB_API_KEY || DEFAULT_IMGBB_API_KEY;
};

export const setImgBBApiKey = (key) => {
    try {
        if (!key || !key.trim()) {
            localStorage.removeItem('imgbb_api_key');
        } else {
            localStorage.setItem('imgbb_api_key', key.trim());
        }
        return true;
    } catch {
        return false;
    }
};

/**
 * Upload an image file or base64 data to ImgBB
 * @param {File|Blob|string} imageFile - File object, Blob, or base64 string
 * @param {Object} options - Optional parameters
 * @param {Function} options.onProgress - Callback with percentage (0-100)
 * @param {string} options.apiKey - Override API key
 * @param {number} options.expiration - Expiration time in seconds (60-15552000), omit for permanent
 * @returns {Promise<{ url: string, displayUrl: string, thumbUrl: string, deleteUrl: string, id: string, title: string }>}
 */
export const uploadToImgBB = (imageFile, options = {}) => {
    const { onProgress, apiKey: customKey, expiration } = options;
    const apiKey = customKey || getImgBBApiKey();

    return new Promise((resolve, reject) => {
        if (!imageFile) {
            reject(new Error('No image file provided for ImgBB upload'));
            return;
        }

        if (!apiKey || apiKey.trim() === '') {
            reject(new Error('ImgBB API key is missing. Please set it in Admin → Settings.'));
            return;
        }

        const formData = new FormData();
        formData.append('image', imageFile);

        let url = `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`;
        if (expiration) {
            url += `&expiration=${encodeURIComponent(expiration)}`;
        }

        // Simulated progress ticker (fires when XHR upload events are unavailable)
        let simInterval = null;
        let simPct = 0;
        const startSimProgress = () => {
            if (!onProgress) return;
            simInterval = setInterval(() => {
                // Asymptotically approach 90% while waiting for response
                simPct = simPct + (90 - simPct) * 0.08;
                onProgress(Math.min(Math.round(simPct), 89));
            }, 300);
        };
        const stopSimProgress = () => {
            if (simInterval) { clearInterval(simInterval); simInterval = null; }
        };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.timeout = 60000; // 60-second timeout

        let xhrProgressFired = false;
        if (xhr.upload && onProgress) {
            xhr.upload.onprogress = (event) => {
                xhrProgressFired = true;
                stopSimProgress();
                if (event.lengthComputable) {
                    const pct = Math.round((event.loaded / event.total) * 100);
                    onProgress(pct);
                }
            };
            xhr.upload.onloadstart = () => {
                // Start simulated progress; if real events fire, they override it
                setTimeout(() => {
                    if (!xhrProgressFired) startSimProgress();
                }, 600);
            };
        } else if (onProgress) {
            startSimProgress();
        }

        xhr.onload = () => {
            stopSimProgress();
            try {
                const response = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300 && response.success) {
                    if (onProgress) onProgress(100);
                    resolve({
                        url: response.data.url,
                        displayUrl: response.data.display_url,
                        thumbUrl: response.data.thumb?.url || response.data.url,
                        deleteUrl: response.data.delete_url,
                        id: response.data.id,
                        title: response.data.title || ''
                    });
                } else {
                    const msg = response?.error?.message ||
                        (xhr.status === 400 ? 'Invalid API key or image format' :
                        xhr.status === 429 ? 'ImgBB rate limit reached — try again later' :
                        `ImgBB upload failed (HTTP ${xhr.status})`);
                    reject(new Error(msg));
                }
            } catch (parseError) {
                reject(new Error(`Failed to parse ImgBB response: ${parseError.message}`));
            }
        };

        xhr.onerror = () => {
            stopSimProgress();
            reject(new Error('Network error — check your internet connection'));
        };

        xhr.ontimeout = () => {
            stopSimProgress();
            reject(new Error('Upload timed out after 60 seconds. Try a smaller image.'));
        };

        xhr.send(formData);
    });
};
