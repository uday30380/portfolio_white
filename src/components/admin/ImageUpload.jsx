import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars // eslint-disable-line no-unused-vars
import { useImageUpload } from '../../hooks/useImageUpload';

const ImageUpload = ({ currentImage, onImageUploaded, onImageRemoved }) => {
    const [preview, setPreview] = useState(currentImage || null);
    const { uploadImage, uploading, progress, error } = useImageUpload();

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(file);

        try {
            const result = await uploadImage(file);
            setPreview(result.url);
            onImageUploaded(result.url, result.path);
        } catch (err) {
            console.error('Upload error:', err);
            setPreview(currentImage);
        }
    }, [uploadImage, onImageUploaded, currentImage]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: 1,
        disabled: uploading
    });

    const handleRemove = () => {
        setPreview(null);
        onImageRemoved();
    };

    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                Project Image
            </label>

            {preview ? (
                <div className="relative group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-2xl border border-white/10"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all"
                        >
                            <X size={20} />
                        </button>
                        <div {...getRootProps()} className="cursor-pointer">
                            <input {...getInputProps()} />
                            <button
                                type="button"
                                className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-all"
                            >
                                <Upload size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`
                        relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                        ${isDragActive
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-white/20 hover:border-orange-500/50 bg-white/5 hover:bg-white/10'
                        }
                        ${uploading ? 'pointer-events-none opacity-50' : ''}
                    `}
                >
                    <input {...getInputProps()} />

                    <div className="flex flex-col items-center gap-4">
                        <div className={`p-6 rounded-full ${isDragActive ? 'bg-orange-500' : 'bg-white/10'} transition-colors`}>
                            {uploading ? (
                                <div className="w-12 h-12 border-4 border-white/20 border-t-orange-500 rounded-full animate-spin" />
                            ) : (
                                <ImageIcon size={48} className={isDragActive ? 'text-white' : 'text-gray-400'} />
                            )}
                        </div>

                        {uploading ? (
                            <div className="w-full max-w-xs">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Uploading...</span>
                                    <span className="text-orange-500 font-bold">{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <p className="text-white font-bold mb-1">
                                        {isDragActive ? 'Drop image here' : 'Drag & drop image here'}
                                    </p>
                                    <p className="text-gray-500 text-sm">or click to browse</p>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Supports: JPG, PNG, WebP (max 5MB)
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm"
                    >
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageUpload;
