import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, X, Trophy, Medal, Award, Save, ArrowRight, CheckCircle, Link as LinkIcon, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

const AdminHonors = () => {
    const { data, updateData } = useData();
    const honors = data.honors || [];
    const [isEditing, setIsEditing] = useState(false);
    const [currentHonor, setCurrentHonor] = useState(null);

    const emptyHonor = {
        id: '',
        title: '',
        issuer: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Certification', // Award, Certification, Recognition, Achievement
        image: '',
        description: '',
        skills: [], // Array of strings
        link: '',
        verificationLink: '',
        credentialId: '',
        isFavorite: false,
        featured: false
    };

    const handleEdit = (honor) => {
        setCurrentHonor(honor);
        setIsEditing(true);
    };

    const handleAdd = () => {
        setCurrentHonor({ ...emptyHonor, id: Date.now() });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this honor?')) {
            const updatedHonors = honors.filter(h => h.id !== id);
            await updateData('honors', updatedHonors);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        let updatedHonors;
        const existingIndex = honors.findIndex(h => h.id === currentHonor.id);

        if (existingIndex >= 0) {
            updatedHonors = [...honors];
            updatedHonors[existingIndex] = currentHonor;
        } else {
            updatedHonors = [...honors, currentHonor];
        }

        await updateData('honors', updatedHonors);
        setIsEditing(false);
        setCurrentHonor(null);
    };

    const handleSkillsChange = (e) => {
        const skillsString = e.target.value;
        const skillsArray = skillsString.split(',').map(s => s.trim()).filter(s => s);
        setCurrentHonor({ ...currentHonor, skills: skillsArray });
    };

    return (
        <div className="space-y-10 animate-fade-in text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-[2px] bg-orange-500"></div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Achievements</span>
                    </div>
                    <h2 className="text-3xl font-black text-white">Credentials & Achievements</h2>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95 group"
                >
                    <Plus size={18} />
                    <span>Add New Honor</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {honors.map((honor) => (
                    <div key={honor.id} className="bg-[#111111] rounded-[32px] border border-white/5 overflow-hidden group hover:border-orange-500/30 transition-all relative flex flex-col">
                        <div className="h-48 overflow-hidden relative bg-black/50">
                            {honor.image ? (
                                <img
                                    src={honor.image}
                                    alt={honor.title}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Trophy size={48} className="text-gray-700" />
                                </div>
                            )}

                            <div className="absolute top-4 right-4 flex gap-2">
                                <button onClick={() => handleEdit(honor)} className="p-3 bg-black/60 text-white rounded-xl backdrop-blur-md hover:bg-white hover:text-black transition-all">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(honor.id)} className="p-3 bg-black/60 text-red-400 rounded-xl backdrop-blur-md hover:bg-red-500 hover:text-white transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${honor.category === 'Award' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' :
                                    honor.category === 'Certification' ? 'bg-blue-500/20 text-blue-500 border-blue-500/30' :
                                        'bg-purple-500/20 text-purple-500 border-purple-500/30'
                                    }`}>
                                    {honor.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-black text-white mb-1 group-hover:text-orange-500 transition-colors line-clamp-1">{honor.title}</h3>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{honor.issuer}</p>

                            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>{new Date(honor.date).getFullYear()}</span>
                                <span className={honor.featured ? "text-green-500" : "text-gray-600"}>{honor.featured ? "Featured" : "Hidden"}</span>
                            </div>
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
                            className="relative bg-[#0A0A0A] w-full max-w-4xl rounded-[48px] border border-white/10 shadow-3xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center p-8 border-b border-white/5 bg-[#0A0A0A]">
                                <div>
                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2 block">Configure Honor</span>
                                    <h3 className="text-2xl font-black text-white">{currentHonor.id ? 'Edit Achievement' : 'Add New Achievement'}</h3>
                                </div>
                                <button onClick={() => setIsEditing(false)} className="p-4 bg-white/5 hover:bg-orange-500 text-white rounded-full transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                <form id="honorForm" onSubmit={handleSave} className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Title</label>
                                            <input
                                                type="text" required
                                                value={currentHonor.title}
                                                onChange={(e) => setCurrentHonor({ ...currentHonor, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                placeholder="e.g. AWS Certified Solutions Architect"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Issuer / Organization</label>
                                            <input
                                                type="text" required
                                                value={currentHonor.issuer}
                                                onChange={(e) => setCurrentHonor({ ...currentHonor, issuer: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                placeholder="e.g. Amazon Web Services"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Date</label>
                                            <input
                                                type="date"
                                                value={currentHonor.date}
                                                onChange={(e) => setCurrentHonor({ ...currentHonor, date: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                                            <select
                                                value={currentHonor.category}
                                                onChange={(e) => setCurrentHonor({ ...currentHonor, category: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold appearance-none"
                                            >
                                                <option value="Certification" className="bg-black">Certification</option>
                                                <option value="Award" className="bg-black">Award</option>
                                                <option value="Recognition" className="bg-black">Recognition</option>
                                                <option value="Achievement" className="bg-black">Achievement</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Credential ID</label>
                                            <input
                                                type="text"
                                                value={currentHonor.credentialId}
                                                onChange={(e) => setCurrentHonor({ ...currentHonor, credentialId: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                placeholder="Optional ID"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                                        <textarea
                                            rows="3"
                                            value={currentHonor.description}
                                            onChange={(e) => setCurrentHonor({ ...currentHonor, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold resize-none"
                                            placeholder="What was this award for?"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Image URL</label>
                                            <div className="flex gap-3">
                                                <input
                                                    type="url"
                                                    value={currentHonor.image}
                                                    onChange={(e) => setCurrentHonor({ ...currentHonor, image: e.target.value })}
                                                    className="flex-1 bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                    placeholder="https://..."
                                                />
                                                {currentHonor.image && (
                                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 group flex-shrink-0 bg-black">
                                                        <img src={currentHonor.image} alt="Preview" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setCurrentHonor({ ...currentHonor, image: '' })}
                                                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <X size={14} className="text-white" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Verification Link</label>
                                            <input
                                                type="url"
                                                value={currentHonor.verificationLink}
                                                onChange={(e) => setCurrentHonor({ ...currentHonor, verificationLink: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Validated Skills (comma separated)</label>
                                        <input
                                            type="text"
                                            value={currentHonor.skills?.join(', ') || ''}
                                            onChange={handleSkillsChange}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                            placeholder="React, AWS, Leadership"
                                        />
                                    </div>

                                    <div className="flex gap-8 pt-4">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${currentHonor.featured ? 'bg-orange-500 border-orange-500' : 'border-gray-600'}`}>
                                                {currentHonor.featured && <CheckCircle size={14} className="text-white" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={currentHonor.featured} onChange={(e) => setCurrentHonor({ ...currentHonor, featured: e.target.checked })} />
                                            <span className="text-xs font-black uppercase tracking-widest text-white group-hover:text-orange-500 transition-colors">Featured</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${currentHonor.isFavorite ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'}`}>
                                                {currentHonor.isFavorite && <CheckCircle size={14} className="text-black" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={currentHonor.isFavorite} onChange={(e) => setCurrentHonor({ ...currentHonor, isFavorite: e.target.checked })} />
                                            <span className="text-xs font-black uppercase tracking-widest text-white group-hover:text-yellow-500 transition-colors">Favorite</span>
                                        </label>
                                    </div>
                                </form>
                            </div>

                            <div className="p-8 border-t border-white/5 bg-[#0A0A0A] flex justify-end gap-4">
                                <button onClick={() => setIsEditing(false)} className="px-8 py-4 rounded-2xl text-gray-500 hover:text-white uppercase text-[10px] font-black tracking-widest transition-all">Cancel</button>
                                <button type="submit" form="honorForm" className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2 group">
                                    <Save size={18} /> Save Changes <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminHonors;
