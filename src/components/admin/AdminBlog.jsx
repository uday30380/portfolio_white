import React, { useState, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, X, Calendar, Clock, Save, Upload, Link as LinkIcon, AlertCircle, ExternalLink } from 'lucide-react';
import { uploadToImgBB, getImgBBApiKey, setImgBBApiKey } from '../../services/imgbb';
import { useDropzone } from 'react-dropzone';

/* ─────────────────────────────────────────────
   BLOG IMAGE UPLOADER — ImgBB Direct Upload
───────────────────────────────────────────── */
const BlogImageUploader = ({ onImageUploaded }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState('');

    const handleFileDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        setProgress(0);

        try {
            const result = await uploadToImgBB(file, {
                onProgress: (pct) => setProgress(pct)
            });
            onImageUploaded(result.url);
        } catch (err) {
            console.error('ImgBB upload error:', err);
            setError(err.message || 'Upload failed. Try adding a URL manually.');
        } finally {
            setUploading(false);
        }
    }, [onImageUploaded]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleFileDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
        maxFiles: 1,
        disabled: uploading,
        maxSize: 32 * 1024 * 1024,
    });

    const handleUrlAdd = () => {
        if (urlInput.trim()) {
            onImageUploaded(urlInput.trim());
            setUrlInput('');
            setShowUrlInput(false);
        }
    };

    return (
        <div className="space-y-3">
            {/* Drop Zone */}
            <div
                {...getRootProps()}
                className={`
                    relative border-2 border-dashed rounded-[8px] p-4 text-center cursor-pointer transition-colors
                    ${isDragActive
                        ? 'border-[#102A28] bg-[#EEF4F3]'
                        : 'border-[#DDE7E5] hover:border-[#7CC7BD] bg-[#F7FAFA]'
                    }
                    ${uploading ? 'pointer-events-none opacity-60' : ''}
                `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center gap-1.5">
                    <div className="p-2 rounded-full bg-[#EEF4F3] text-[#102A28]">
                        {uploading ? (
                            <div className="w-5 h-5 border-2 border-[#DDE7E5] border-t-[#0F766E] rounded-full animate-spin" />
                        ) : (
                            <Upload size={18} />
                        )}
                    </div>

                    {uploading ? (
                        <div className="w-full max-w-xs space-y-1.5">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-[#4B5F5C]">Uploading...</span>
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
                            <p className="text-xs font-medium text-[#102A28]">
                                {isDragActive ? 'Drop image here' : 'Click or drag image to upload'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="flex items-start gap-2 p-2.5 bg-[#EEF4F3] border border-[#DDE7E5] rounded-[8px] text-[#102A28] text-xs">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* URL fallback toggle */}
            <div>
                <button
                    type="button"
                    onClick={() => setShowUrlInput(v => !v)}
                    className="text-xs text-[#0F766E] hover:underline flex items-center gap-1"
                >
                    <LinkIcon size={12} />
                    <span>{showUrlInput ? 'Hide URL input' : 'Add via direct image URL'}</span>
                </button>
                {showUrlInput && (
                    <div className="flex gap-2 mt-2">
                        <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUrlAdd()}
                            placeholder="https://example.com/image.jpg"
                            className="flex-1 bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-9 px-3 text-xs text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                        />
                        <button
                            type="button"
                            onClick={handleUrlAdd}
                            className="btn-secondary !h-9 text-xs"
                        >
                            Add
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   IMGBB API KEY CONFIGURATOR
───────────────────────────────────────────── */
const ImgBBKeyConfig = () => {
    const [editing, setEditing] = useState(false);
    const [key, setKey] = useState('');
    const [saved, setSaved] = useState(false);

    const handleOpen = () => {
        setKey(getImgBBApiKey());
        setEditing(true);
    };
    const handleSave = () => {
        setImgBBApiKey(key);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-[#8A9B98]">
                ImgBB: {saved ? <span className="text-[#15803D]">Key saved</span> : 'Active'}
            </span>
            <button
                type="button"
                onClick={handleOpen}
                className="text-xs text-[#0F766E] hover:underline"
            >
                Configure key
            </button>
            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditing(false)} />
                    <div className="relative bg-white w-full max-w-sm rounded-[12px] border border-[#DDE7E5] p-6 shadow-lg z-10">
                        <h3 className="text-base font-semibold text-[#102A28] mb-1">ImgBB API key</h3>
                        <p className="text-xs text-[#4B5F5C] mb-4">
                            Optional custom key from api.imgbb.com.
                        </p>
                        <input
                            type="text"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Your ImgBB key"
                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-xs text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] font-mono mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setEditing(false)} className="btn-secondary !h-8 text-xs">Cancel</button>
                            <button onClick={handleSave} className="btn-primary !h-8 text-xs">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   MAIN ADMIN BLOG COMPONENT
───────────────────────────────────────────── */
const AdminBlog = () => {
    const { data, updateData } = useData();
    const blogPosts = data.blog || [];
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    const emptyPost = {
        id: '',
        title: '',
        excerpt: '',
        content: '',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        readTime: '5 min read',
        image: '',
        images: [],
        tags: []
    };

    const handleEdit = (post) => {
        setCurrentPost({ ...post, images: post.images || [] });
        setIsEditing(true);
    };

    const handleAdd = () => {
        setCurrentPost({ ...emptyPost, id: Date.now(), tags: [], images: [] });
        setIsEditing(true);
    };

    const handleImageUploaded = (url) => {
        setCurrentPost(prev => {
            const newImages = [...(prev.images || []), url];
            return { ...prev, images: newImages, image: newImages[0] };
        });
    };

    const handleRemoveImage = (index) => {
        setCurrentPost(prev => {
            const newImages = prev.images.filter((_, i) => i !== index);
            return { ...prev, images: newImages, image: newImages.length > 0 ? newImages[0] : '' };
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this article?')) {
            const updatedBlog = blogPosts.filter(p => p.id !== id);
            await updateData('blog', updatedBlog);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        let updatedBlog;
        const existingIndex = blogPosts.findIndex(p => p.id === currentPost.id);

        if (existingIndex >= 0) {
            updatedBlog = [...blogPosts];
            updatedBlog[existingIndex] = currentPost;
        } else {
            updatedBlog = [...blogPosts, currentPost];
        }

        await updateData('blog', updatedBlog);
        setIsEditing(false);
        setCurrentPost(null);
    };

    return (
        <div className="space-y-6 text-[#102A28]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-[#102A28]">Blog articles</h2>
                    <p className="text-xs text-[#8A9B98]">Manage published posts and articles</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="btn-primary"
                >
                    <Plus size={16} />
                    <span>New article</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white rounded-[12px] border border-[#DDE7E5] overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                        <div>
                            <div className="h-44 bg-[#EEF4F3] border-b border-[#DDE7E5] overflow-hidden relative">
                                <img
                                    src={post.image?.trim() ? post.image : '/uday-portrait.png'}
                                    alt={post.title}
                                    onError={(e) => { e.currentTarget.src = '/uday-portrait.png'; }}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3 flex gap-1.5">
                                    <a
                                        href={`/blog/${post.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 bg-white/90 text-[#4B5F5C] hover:text-[#0F766E] border border-[#DDE7E5] rounded-[6px] transition-colors"
                                        title="View article"
                                    >
                                        <ExternalLink size={15} />
                                    </a>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex items-center gap-4 text-xs text-[#8A9B98] mb-2">
                                    <span className="flex items-center gap-1.5"><Calendar size={13} /> {post.date}</span>
                                    <span className="flex items-center gap-1.5"><Clock size={13} /> {post.readTime}</span>
                                </div>
                                <h3 className="text-base font-semibold text-[#102A28] mb-1.5 line-clamp-1">{post.title}</h3>
                                <p className="text-xs text-[#4B5F5C] leading-relaxed line-clamp-2">{post.excerpt}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-[#F7FAFA] border-t border-[#DDE7E5] flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => handleEdit(post)}
                                className="btn-secondary !h-8 !px-3 text-xs"
                            >
                                <Edit2 size={13} />
                                <span>Edit</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(post.id)}
                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-white border border-[#DDE7E5] text-[#DC2626] hover:bg-[#FEF2F2] text-xs font-medium transition-colors"
                            >
                                <Trash2 size={13} />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isEditing && currentPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
                    <div className="relative bg-white w-full max-w-2xl rounded-[12px] border border-[#DDE7E5] shadow-lg overflow-hidden z-10 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-[#DDE7E5]">
                            <h3 className="text-lg font-semibold text-[#102A28]">
                                {currentPost.id && blogPosts.some(p => p.id === currentPost.id) ? 'Edit article' : 'New article draft'}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="p-1.5 text-[#4B5F5C] hover:text-[#0F766E] rounded-lg transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-4">
                            <form id="blogForm" onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Article title</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentPost.title}
                                        onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                                        className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                        placeholder="Article headline..."
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Read time</label>
                                        <input
                                            type="text"
                                            value={currentPost.readTime}
                                            onChange={(e) => setCurrentPost({ ...currentPost, readTime: e.target.value })}
                                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                            placeholder="e.g. 5 min read"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="text-xs font-medium text-[#4B5F5C]">
                                                Images ({(currentPost.images || []).length})
                                            </label>
                                            <ImgBBKeyConfig />
                                        </div>
                                        <BlogImageUploader onImageUploaded={handleImageUploaded} />
                                    </div>
                                </div>

                                {(currentPost.images || []).length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {currentPost.images.map((img, idx) => (
                                            <div key={idx} className="relative w-20 h-14 rounded-[6px] overflow-hidden border border-[#DDE7E5] group">
                                                <img src={img?.trim() ? img : null} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(idx)}
                                                    className="absolute top-1 right-1 p-0.5 bg-[#DC2626] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Excerpt (Lead summary)</label>
                                    <textarea
                                        required
                                        rows="2"
                                        value={currentPost.excerpt}
                                        onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                                        className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] p-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] resize-y leading-relaxed"
                                        placeholder="Short summary..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Content (Markdown supported)</label>
                                    <textarea
                                        required
                                        rows="8"
                                        value={currentPost.content}
                                        onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                                        className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] p-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] font-mono leading-relaxed"
                                        placeholder="# Heading\n\nArticle body in markdown..."
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t border-[#DDE7E5] bg-[#F7FAFA] flex justify-end gap-2.5">
                            <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
                            <button type="submit" form="blogForm" className="btn-primary">
                                <Save size={16} />
                                <span>Save article</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlog;
