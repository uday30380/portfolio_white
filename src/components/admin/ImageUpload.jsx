import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertCircle, Sparkles, Link as LinkIcon } from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';

const ImageUpload = ({
    currentImage = '',
    onImageUploaded,
    onImageRemoved,
    label = 'Image',
    helperText = 'Upload direct to ImgBB or paste a direct image URL',
    compact = false
}) => {
    const [preview, setPreview] = useState(currentImage || '');
    const [urlInput, setUrlInput] = useState(currentImage || '');
    const [prevImage, setPrevImage] = useState(currentImage);
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url'
    const { uploadImage, uploading, progress, error } = useImageUpload();

    // Sync state when prop changes without cascading effect renders
    if (currentImage !== prevImage) {
        setPrevImage(currentImage);
        setPreview(currentImage || '');
        setUrlInput(currentImage || '');
    }

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Local instant preview
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(file);

        try {
            const result = await uploadImage(file, { provider: 'imgbb' });
            if (result && result.url) {
                setPreview(result.url);
                setUrlInput(result.url);
                if (onImageUploaded) onImageUploaded(result.url, result.path);
            }
        } catch (err) {
            console.error('ImgBB upload error:', err);
            setPreview(currentImage || '');
        }
    }, [uploadImage, onImageUploaded, currentImage]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
        },
        maxFiles: 1,
        disabled: uploading
    });

    const handleRemove = (e) => {
        e?.stopPropagation();
        setPreview('');
        setUrlInput('');
        if (onImageRemoved) onImageRemoved();
    };

    const handleApplyUrl = (val) => {
        setUrlInput(val);
        setPreview(val);
        if (onImageUploaded) onImageUploaded(val, 'external_url');
    };

    return (
        <div className="space-y-3 w-full">
            {/* Header & Mode Switch */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                    <label className="text-xs font-medium text-[#102A28] block">
                        {label}
                    </label>
                    {helperText && (
                        <span className="text-xs text-[#8A9B98]">
                            {helperText}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1 bg-[#EEF4F3] p-1 rounded-[8px] border border-[#DDE7E5] text-xs">
                    <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className={`px-3 py-1 rounded-[6px] font-medium transition-colors flex items-center gap-1.5 ${
                            activeTab === 'upload'
                                ? 'bg-white text-[#102A28] shadow-sm'
                                : 'text-[#4B5F5C] hover:text-[#0F766E]'
                        }`}
                    >
                        <Sparkles size={12} />
                        ImgBB Direct
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('url')}
                        className={`px-3 py-1 rounded-[6px] font-medium transition-colors flex items-center gap-1.5 ${
                            activeTab === 'url'
                                ? 'bg-white text-[#102A28] shadow-sm'
                                : 'text-[#4B5F5C] hover:text-[#0F766E]'
                        }`}
                    >
                        <LinkIcon size={12} />
                        Link URL
                    </button>
                </div>
            </div>

            {/* Preview Card if image exists */}
            {preview?.trim() && (
                <div className="relative group rounded-[8px] overflow-hidden border border-[#DDE7E5] bg-[#F7FAFA] shadow-sm">
                    <img
                        src={preview}
                        alt="Uploaded preview"
                        className={`w-full ${compact ? 'h-36' : 'h-52'} object-cover`}
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="px-3.5 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-[6px] text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                            <X size={14} /> Remove
                        </button>
                        <div {...getRootProps()} className="cursor-pointer">
                            <input {...getInputProps()} />
                            <button
                                type="button"
                                className="px-3.5 py-1.5 bg-[#102A28] hover:bg-[#0B5C56] text-white rounded-[6px] text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                                <Upload size={14} /> Replace
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Direct ImgBB Upload Tab */}
            {activeTab === 'upload' && (
                <div
                    {...getRootProps()}
                    className={`
                        relative border-2 border-dashed rounded-[8px] text-center cursor-pointer transition-colors
                        ${compact ? 'p-4' : 'p-6'}
                        ${isDragActive
                            ? 'border-[#102A28] bg-[#EEF4F3]'
                            : 'border-[#DDE7E5] hover:border-[#7CC7BD] bg-[#F7FAFA] hover:bg-[#EEF4F3]'
                        }
                        ${uploading ? 'pointer-events-none opacity-60' : ''}
                    `}
                >
                    <input {...getInputProps()} />

                    <div className="flex flex-col items-center gap-2">
                        <div className="p-3 rounded-full bg-[#EEF4F3] text-[#102A28]">
                            {uploading ? (
                                <div className="w-6 h-6 border-2 border-[#DDE7E5] border-t-[#0F766E] rounded-full animate-spin" />
                            ) : (
                                <Upload size={compact ? 20 : 24} />
                            )}
                        </div>

                        {uploading ? (
                            <div className="w-full max-w-xs space-y-2">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-[#4B5F5C]">Uploading to ImgBB...</span>
                                    <span className="text-[#102A28]">{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-[#DDE7E5] rounded-full overflow-hidden">
                                    <div
                                        style={{ width: `${progress}%` }}
                                        className="h-full bg-[#102A28] rounded-full transition-all"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm font-medium text-[#102A28]">
                                    {isDragActive ? 'Drop image here' : 'Click or drag & drop to upload'}
                                </p>
                                <p className="text-xs text-[#8A9B98] mt-0.5">
                                    JPG, PNG, WebP, GIF
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* URL Input Tab */}
            {activeTab === 'url' && (
                <div className="space-y-1.5">
                    <div className="relative">
                        <LinkIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9B98]" />
                        <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => handleApplyUrl(e.target.value)}
                            placeholder="https://... image URL"
                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] pl-10 pr-3.5 h-[40px] text-[#102A28] text-sm focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors placeholder:text-[#8A9B98]"
                        />
                    </div>
                    <p className="text-xs text-[#8A9B98]">
                        Paste any public image URL
                    </p>
                </div>
            )}

            {/* Error Notification */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-[#EEF4F3] border border-[#DDE7E5] rounded-[8px] text-[#102A28] text-xs font-medium">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
