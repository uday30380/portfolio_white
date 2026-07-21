import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, X, Calendar, Clock, Image as ImageIcon, Save, ArrowRight, Link as LinkIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
        setCurrentPost(post);
        setIsEditing(true);
    };

    const handleAdd = () => {
        setCurrentPost({ ...emptyPost, id: Date.now(), tags: [], images: [] });
        setIsEditing(true);
    };

    const handleAddImage = (e) => {
        e.preventDefault();
        const url = prompt("Enter Image URL:");
        if (url) {
            setCurrentPost(prev => {
                const newImages = [...(prev.images || []), url];
                return {
                    ...prev,
                    images: newImages,
                    image: newImages[0] // sync cover
                };
            });
        }
    };

    const handleRemoveImage = (index) => {
        setCurrentPost(prev => {
            const newImages = prev.images.filter((_, i) => i !== index);
            return {
                ...prev,
                images: newImages,
                image: newImages.length > 0 ? newImages[0] : ''
            };
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
        <div className="space-y-10 animate-fade-in text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-[2px] bg-orange-500"></div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Editorial Control</span>
                    </div>
                    <h2 className="text-3xl font-black text-white">Publication Archives</h2>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95 group"
                >
                    <Plus size={18} />
                    <span>Create New Article</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogPosts.map((post) => (
                    <div key={post.id} className="bg-[#111111] rounded-[40px] border border-white/5 overflow-hidden group hover:border-orange-500/30 transition-all duration-500 relative">
                        <div className="h-64 overflow-hidden relative">
                            <img
                                src={post.image || 'https://via.placeholder.com/400'}
                                alt={post.title}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <a href={`/blog/${post.id}`} target="_blank" rel="noopener noreferrer" className="p-4 bg-black/60 text-white rounded-2xl backdrop-blur-md hover:bg-orange-500 transition-all" title="View Article">
                                    <ArrowRight size={18} />
                                </a>
                                <button onClick={() => handleEdit(post)} className="p-4 bg-black/60 text-white rounded-2xl backdrop-blur-md hover:bg-white hover:text-black transition-all">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(post.id)} className="p-4 bg-black/60 text-red-400 rounded-2xl backdrop-blur-md hover:bg-red-500 hover:text-white transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
                                <span className="flex items-center gap-2"><Calendar size={14} className="text-orange-500" /> {post.date}</span>
                                <span className="flex items-center gap-2"><Clock size={14} className="text-orange-500" /> {post.readTime}</span>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 group-hover:text-orange-500 transition-colors uppercase tracking-tight line-clamp-1">{post.title}</h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">{post.excerpt}</p>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#0A0A0A] w-full max-w-3xl rounded-[48px] border border-white/10 shadow-3xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center p-10 border-b border-white/5 bg-[#0A0A0A]">
                                <div>
                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2 block">Article Config</span>
                                    <h3 className="text-2xl font-black text-white">{currentPost.id ? 'Refine Publication' : 'New Article Draft'}</h3>
                                </div>
                                <button onClick={() => setIsEditing(false)} className="p-4 bg-white/5 hover:bg-orange-500 text-white rounded-full transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-10 overflow-y-auto custom-scrollbar">
                                <form id="blogForm" onSubmit={handleSave} className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Title</label>
                                        <input
                                            type="text" required
                                            value={currentPost.title}
                                            onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                            placeholder="The Future of AI Architecture"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Read Time</label>
                                            <input
                                                type="text"
                                                value={currentPost.readTime}
                                                onChange={(e) => setCurrentPost({ ...currentPost, readTime: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                placeholder="e.g. 5 min read"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Image Gallery (URLs)</label>
                                                <button onClick={handleAddImage} type="button" className="text-[10px] font-black uppercase text-orange-500 hover:text-white transition-colors flex items-center gap-1">
                                                    <LinkIcon size={12} /> + Add Link
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2">
                                                {currentPost.images && currentPost.images.map((img, idx) => (
                                                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group border border-white/10">
                                                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(idx)}
                                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                        {idx === 0 && <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/60 text-[8px] uppercase font-bold text-white rounded">Cover</span>}
                                                    </div>
                                                ))}
                                                {(!currentPost.images || currentPost.images.length === 0) && (
                                                    <div className="col-span-3 py-4 text-center text-gray-600 text-xs border border-dashed border-white/10 rounded-xl">
                                                        No images added
                                                    </div>
                                                )}
                                            </div>

                                            {/* Legacy Fallback Input (Hidden or synced) */}
                                            {/* <input
                                                type="url"
                                                value={currentPost.image}
                                                onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                                                className="hidden"
                                            /> */}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Excerpt (Lead Summary)</label>
                                        <textarea
                                            required
                                            rows="3"
                                            value={currentPost.excerpt}
                                            onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold resize-none"
                                            placeholder="Lead the reader with impact..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Manifesto (Content)</label>
                                        <textarea
                                            required
                                            rows="10"
                                            value={currentPost.content}
                                            onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold min-h-[300px]"
                                            placeholder="Markdown supported content flow..."
                                        />
                                    </div>
                                </form>
                            </div>

                            <div className="p-10 border-t border-white/5 bg-[#0A0A0A] flex justify-end gap-4">
                                <button onClick={() => setIsEditing(false)} className="px-8 py-4 rounded-2xl text-gray-500 hover:text-white uppercase text-[10px] font-black tracking-widest transition-all">Cancel</button>
                                <button type="submit" form="blogForm" className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2 group">
                                    <Save size={18} /> Commit Publication <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminBlog;
