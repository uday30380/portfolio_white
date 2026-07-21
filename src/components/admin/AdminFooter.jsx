import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Save, Link as LinkIcon, Plus, Trash2, Layout } from 'lucide-react';

const AdminFooter = () => {
    const { data, updateData } = useData();
    const [footerData, setFooterData] = useState(data.footer || {
        tagline: '',
        copyright: '',
        links: []
    });

    const handleSave = async (e) => {
        e.preventDefault();
        await updateData('footer', footerData);
        alert('Footer updated successfully!');
    };

    const handleLinkChange = (index, field, value) => {
        const newLinks = [...footerData.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setFooterData({ ...footerData, links: newLinks });
    };

    const addLink = () => {
        setFooterData({
            ...footerData,
            links: [...footerData.links, { name: '', url: '' }]
        });
    };

    const removeLink = (index) => {
        const newLinks = footerData.links.filter((_, i) => i !== index);
        setFooterData({ ...footerData, links: newLinks });
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-[2px] bg-orange-500"></div>
                <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Site Structure</span>
            </div>
            <h2 className="text-3xl font-black text-white">Footer Configuration</h2>

            <div className="bg-[#111111] rounded-[40px] border border-white/5 p-10 relative overflow-hidden">
                <form onSubmit={handleSave} className="space-y-8 relative z-10">

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tagline (Main Text)</label>
                        <input
                            type="text"
                            value={footerData.tagline}
                            onChange={(e) => setFooterData({ ...footerData, tagline: e.target.value })}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                            placeholder="Designing the future..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Copyright Text</label>
                        <input
                            type="text"
                            value={footerData.copyright}
                            onChange={(e) => setFooterData({ ...footerData, copyright: e.target.value })}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                            placeholder="© 2024 Uday Kiran..."
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Footer Links</label>
                            <button type="button" onClick={addLink} className="flex items-center gap-2 text-[10px] font-black uppercase text-orange-500 hover:text-white transition-colors">
                                <Plus size={14} /> Add Link
                            </button>
                        </div>

                        {footerData.links.map((link, index) => (
                            <div key={index} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                <LinkIcon size={16} className="text-gray-500" />
                                <div className="flex-1 grid md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={link.name}
                                        onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                                        placeholder="Link Name (e.g. GitHub)"
                                        className="bg-transparent border-b border-white/10 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                                    />
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                        placeholder="URL (https://...)"
                                        className="bg-transparent border-b border-white/10 py-2 text-sm text-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                                    />
                                </div>
                                <button type="button" onClick={() => removeLink(index)} className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-white/5 flex justify-end">
                        <button
                            type="submit"
                            className="px-10 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2"
                        >
                            <Save size={18} /> Save Footer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminFooter;
