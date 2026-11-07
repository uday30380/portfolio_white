import { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { uploadToImgBB, getImgBBApiKey, setImgBBApiKey } from '../services/imgbb';

export { getImgBBApiKey, setImgBBApiKey };

export const useImageUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const uploadImage = async (file, pathOrOptions = 'projects') => {
        if (!file) {
            throw new Error('No file provided');
        }

        // Parse arguments (supports string path or options object)
        let path = 'projects';
        let provider = 'imgbb'; // Default to ImgBB as requested

        if (typeof pathOrOptions === 'string') {
            path = pathOrOptions;
        } else if (typeof pathOrOptions === 'object' && pathOrOptions !== null) {
            path = pathOrOptions.path || 'projects';
            if (pathOrOptions.provider) provider = pathOrOptions.provider;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            const err = new Error('Invalid file type. Please upload JPG, PNG, WebP, or GIF');
            setError(err.message);
            throw err;
        }

        // Validate file size (max 32MB for ImgBB)
        const maxSize = 32 * 1024 * 1024;
        if (file.size > maxSize) {
            const err = new Error('File too large. Maximum size is 32MB');
            setError(err.message);
            throw err;
        }

        setUploading(true);
        setProgress(0);
        setError(null);

        // ImgBB Upload Flow
        if (provider === 'imgbb') {
            try {
                const result = await uploadToImgBB(file, {
                    onProgress: (pct) => setProgress(pct)
                });
                setUploading(false);
                setProgress(100);
                return {
                    url: result.url,
                    displayUrl: result.displayUrl,
                    thumbUrl: result.thumbUrl,
                    deleteUrl: result.deleteUrl,
                    path: 'imgbb',
                    filename: file.name
                };
            } catch (imgbbErr) {
                // Surface the real error to the user instead of silently falling back
                const errMsg = imgbbErr?.message || 'ImgBB upload failed. Check your API key in Settings.';
                setError(errMsg);
                setUploading(false);
                setProgress(0);
                throw imgbbErr;
            }
        }

        // Firebase Storage Flow (Fallback or explicit)
        return new Promise((resolve, reject) => {
            const fallbackToBase64 = () => {
                const reader = new FileReader();
                reader.onload = () => {
                    setUploading(false);
                    setProgress(100);
                    resolve({
                        url: reader.result,
                        path: `local_${Date.now()}`,
                        filename: file.name
                    });
                };
                reader.onerror = (readErr) => {
                    setError('Failed to process image');
                    setUploading(false);
                    reject(readErr);
                };
                reader.readAsDataURL(file);
            };

            const timestamp = Date.now();
            const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

            try {
                const storageRef = ref(storage, `${path}/${filename}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(prog);
                    },
                    (err) => {
                        console.warn('Firebase Storage upload failed, falling back to Base64:', err);
                        fallbackToBase64();
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            setUploading(false);
                            setProgress(100);
                            resolve({
                                url: downloadURL,
                                path: uploadTask.snapshot.ref.fullPath,
                                filename
                            });
                        } catch (err) {
                            console.warn('Failed to get download URL, falling back to Base64:', err);
                            fallbackToBase64();
                        }
                    }
                );
            } catch (err) {
                console.warn('Failed to initialize storage upload, falling back to Base64:', err);
                fallbackToBase64();
            }
        });
    };

    const deleteImage = async (imagePath) => {
        if (!imagePath || imagePath === 'imgbb' || imagePath.startsWith('local_')) {
            return true;
        }
        try {
            const imageRef = ref(storage, imagePath);
            await deleteObject(imageRef);
            return true;
        } catch (err) {
            console.error('Error deleting image:', err);
            setError(err.message);
            return false;
        }
    };

    return {
        uploadImage,
        deleteImage,
        uploading,
        progress,
        error
    };
};
