import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Trash2, Folder, Image as ImageIcon, FileText, X, Save, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

const AdminFileManager = () => {
    const { data, updateData } = useData();
    const [assets, setAssets] = useState(data.assets || []);
    const [newUrl, setNewUrl] = useState('');
    const [newName, setNewName] = useState('');
    const [newImage, setNewImage] = useState('');

    const handleAdd = () => {
        if (!newUrl.trim()) return;
        setAssets([{ id: Date.now(), name: newName || 'Asset Node', url: newUrl, image: newImage }, ...assets]);
        setNewUrl('');
        setNewName('');
        setNewImage('');
    };

    const handleDelete = (id) => {
        setAssets(assets.filter(a => a.id !== id));
    };

    const handleSave = async () => {
        await updateData('assets', assets);
        alert('Vault synchronization complete.');
    };

    return (
        <div className="space-y-10 animate-fade-in text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-[2px] bg-orange-500"></div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Cloud Repository</span>
                    </div>
                    <h2 className="text-3xl font-black text-white">We will be doing a quick syncrozar portal</h2>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-3 px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95 group"
                >
                    <Save size={18} />
                    <span>Synchronize Vault</span>
                </button>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Uploader Column */}
                <div className="lg:col-span-1">
                    <div className="p-8 bg-[#111111] border border-white/5 rounded-[40px] space-y-6 sticky top-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Plus className="text-orange-500" size={20} />
                            <h3 className="text-sm font-black uppercase tracking-widest text-white">Ingest Asset</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Asset Alias</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. Hero Pattern"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Destination URL</label>
                            <input
                                type="text"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Preview Image URL</label>
                            <input
                                type="text"
                                value={newImage}
                                onChange={(e) => setNewImage(e.target.value)}
                                placeholder="https://... (Optional)"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                            />
                        </div>
                        <button
                            onClick={handleAdd}
                            className="w-full py-4 bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest border border-orange-500/20 transition-all"
                        >
                            Register Asset
                        </button>
                    </div>
                </div>
            </div>

            {/* Assets Grid */}
            <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {assets.map((asset) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={asset.id}
                                className="bg-[#111111] p-6 rounded-[32px] border border-white/5 group hover:border-orange-500/30 transition-all"
                            >
                                <div className="aspect-video bg-white/5 rounded-2xl mb-4 overflow-hidden relative border border-white/5">
                                    {(asset.image || asset.url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/)) ? (
                                        <img src={asset.image || asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-700">
                                            <ImageIcon size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <button
                                            onClick={() => handleDelete(asset.id)}
                                            className="p-3 bg-black/60 text-red-400 rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h4 className="font-bold text-white text-sm mb-1 line-clamp-1">{asset.name}</h4>
                                <p className="text-[10px] font-black text-orange-500 uppercase tracking-tighter truncate opacity-60 group-hover:opacity-100 transition-opacity">
                                    {asset.url}
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                {assets.length === 0 && (
                    <div className="py-40 bg-white/5 rounded-[48px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                        <Folder size={64} className="text-gray-800 mb-6" />
                        <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Vault Empty</h3>
                        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">No assets registered in the cloud node.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminFileManager;
