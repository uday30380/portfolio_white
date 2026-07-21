import { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

export const useImageUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const uploadImage = (file, path = 'projects') => {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No file provided'));
                return;
            }

            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                reject(new Error('Invalid file type. Please upload JPG, PNG, or WebP'));
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                reject(new Error('File too large. Maximum size is 5MB'));
                return;
            }

            setUploading(true);
            setProgress(0);
            setError(null);

            // Create unique filename
            const timestamp = Date.now();
            const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const storageRef = ref(storage, `${path}/${filename}`);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(prog);
                },
                (err) => {
                    setError(err.message);
                    setUploading(false);
                    reject(err);
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
                        setError(err.message);
                        setUploading(false);
                        reject(err);
                    }
                }
            );
        });
    };

    const deleteImage = async (imagePath) => {
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
