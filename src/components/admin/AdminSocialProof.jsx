import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, X, Save, ArrowRight, Award, MessageSquare, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

const AdminSocialProof = () => {
    const { data, updateData } = useData();
    const [editingType, setEditingType] = useState(null); // 'achievement', 'certificate', 'testimonial'
    const [currentItem, setCurrentItem] = useState(null);

    const emptyAchievement = {
        id: '',
        title: '',
        organization: '',
        date: '',
        description: ''
    };

    const emptyCertificate = {
        id: '',
        title: '',
        issuer: '',
        date: '',
        image: '',
        link: ''
    };

    const emptyTestimonial = {
        id: '',
        name: '',
        role: '',
        company: '',
        text: '',
        avatar: ''
    };

    const handleEdit = (item, type) => {
        setEditingType(type);
        setCurrentItem(item);
    };

    const handleAdd = (type) => {
        setEditingType(type);
        let template = emptyAchievement;
        if (type === 'certificate') template = emptyCertificate;
        if (type === 'testimonial') template = emptyTestimonial;
        setCurrentItem({ ...template, id: Date.now() });
    };

    const handleDelete = async (id, type) => {
        if (window.confirm(`Delete this ${type}?`)) {
            let collectionName = 'achievements';
            if (type === 'certificate') collectionName = 'certificates';
            if (type === 'testimonial') collectionName = 'testimonials';

            const updatedList = (data[collectionName] || []).filter(i => i.id !== id);
            await updateData(collectionName, updatedList);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        let collectionName = 'achievements';
        if (editingType === 'certificate') collectionName = 'certificates';
        if (editingType === 'testimonial') collectionName = 'testimonials';

        const currentList = data[collectionName] || [];

        let updatedList;
        const existingIndex = currentList.findIndex(i => i.id === currentItem.id);

        if (existingIndex >= 0) {
            updatedList = [...currentList];
            updatedList[existingIndex] = currentItem;
        } else {
            updatedList = [...currentList, currentItem];
        }

        await updateData(collectionName, updatedList);
        setEditingType(null);
        setCurrentItem(null);
    };

    return (
        <div className="space-y-16 animate-fade-in">
            {/* Achievements Section */}
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-[2px] bg-orange-500"></div>
                            <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Career Milestones</span>
                        </div>
                        <h2 className="text-3xl font-black text-white">Achievements</h2>
                    </div>
                    <button
                        onClick={() => handleAdd('achievement')}
                        className="flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95 group"
                    >
                        <Plus size={18} />
                        <span>Add Achievement</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {(data.achievements || []).map((achievement) => (
                        <div key={achievement.id} className="bg-[#111111] p-10 rounded-[40px] border border-white/5 group hover:border-orange-500/30 transition-all duration-500 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-orange-500 uppercase tracking-widest border border-white/5">{achievement.date}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(achievement, 'achievement')} className="p-2 bg-white/5 text-gray-400 hover:text-white rounded-lg transition-all"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(achievement.id, 'achievement')} className="p-2 bg-white/5 text-gray-400 hover:text-red-500 rounded-lg transition-all"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-white mb-2 group-hover:text-orange-500 transition-colors uppercase tracking-tight">{achievement.title}</h3>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{achievement.organization}</div>
                            <p className="text-gray-400 text-sm leading-relaxed">{achievement.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full h-px bg-white/5"></div>

            {/* Certificates Section */}
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-[2px] bg-orange-500"></div>
                            <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Recognitions</span>
                        </div>
                        <h2 className="text-3xl font-black text-white">Certificates</h2>
                    </div>
                    <button
                        onClick={() => handleAdd('certificate')}
                        className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 active:scale-95 group"
                    >
                        <Plus size={18} />
                        <span>Add Certificate</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(data.certificates || []).map((cert) => (
                        <div key={cert.id} className="bg-[#111111] rounded-[32px] border border-white/5 group hover:border-orange-500/30 transition-all duration-500 overflow-hidden">
                            <div className="h-48 relative">
                                <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button onClick={() => handleEdit(cert, 'certificate')} className="p-2 bg-black/50 backdrop-blur-md text-white hover:bg-orange-500 rounded-lg transition-all"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(cert.id, 'certificate')} className="p-2 bg-black/50 backdrop-blur-md text-white hover:bg-red-500 rounded-lg transition-all"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-black text-white mb-2 line-clamp-1">{cert.title}</h3>
                                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    <span>{cert.issuer}</span>
                                    <span>{cert.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full h-px bg-white/5"></div>

            {/* Testimonials Section */}
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-[2px] bg-orange-500"></div>
                            <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Client Feedback</span>
                        </div>
                        <h2 className="text-3xl font-black text-white">Testimonials</h2>
                    </div>
                    <button
                        onClick={() => handleAdd('testimonial')}
                        className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 active:scale-95 group"
                    >
                        <Plus size={18} />
                        <span>Add Testimonial</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {(data.testimonials || []).map((testimonial) => (
                        <div key={testimonial.id} className="bg-[#111111] p-10 rounded-[40px] border border-white/5 group hover:border-orange-500/30 transition-all duration-500 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <img src={testimonial.avatar || 'https://via.placeholder.com/100'} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                                    <div>
                                        <div className="text-sm font-black text-white uppercase tracking-tight">{testimonial.name}</div>
                                        <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{testimonial.role} @ {testimonial.company}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(testimonial, 'testimonial')} className="p-2 bg-white/5 text-gray-400 hover:text-white rounded-lg transition-all"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(testimonial.id, 'testimonial')} className="p-2 bg-white/5 text-gray-400 hover:text-red-500 rounded-lg transition-all"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed italic">"{testimonial.text}"</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {editingType && currentItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                            onClick={() => { setEditingType(null); setCurrentItem(null); }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#0A0A0A] w-full max-w-2xl rounded-[48px] border border-white/10 shadow-3xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center p-10 border-b border-white/5 bg-[#0A0A0A]">
                                <div>
                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2 block">
                                        {editingType === 'achievement' ? 'Achievement Config' :
                                            editingType === 'certificate' ? 'Certificate Config' : 'Testimonial Config'}
                                    </span>
                                    <h3 className="text-2xl font-black text-white">
                                        {currentItem.id ? 'Edit Entry' : 'New Entry'}
                                    </h3>
                                </div>
                                <button onClick={() => { setEditingType(null); setCurrentItem(null); }} className="p-4 bg-white/5 hover:bg-orange-500 text-white rounded-full transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-10 overflow-y-auto custom-scrollbar">
                                <form id="socialProofForm" onSubmit={handleSave} className="space-y-8">
                                    {editingType === 'achievement' && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Title</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={currentItem.title}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                    placeholder="Award Name / Role"
                                                />
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Organization</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={currentItem.organization}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, organization: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Date</label>
                                                    <input
                                                        type="text"
                                                        value={currentItem.date}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, date: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                        placeholder="November 2025"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                                                <textarea
                                                    required
                                                    rows="3"
                                                    value={currentItem.description}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold resize-none"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {editingType === 'certificate' && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Certificate Title</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={currentItem.title}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                />
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Issuer</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={currentItem.issuer}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, issuer: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Date</label>
                                                    <input
                                                        type="text"
                                                        value={currentItem.date}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, date: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                        placeholder="2024"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Image URL</label>
                                                    <input
                                                        type="url"
                                                        required
                                                        value={currentItem.image}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, image: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Verify Link</label>
                                                    <input
                                                        type="url"
                                                        value={currentItem.link}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, link: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {editingType === 'testimonial' && (
                                        <>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={currentItem.name}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Role</label>
                                                    <input
                                                        type="text"
                                                        value={currentItem.role}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, role: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Company</label>
                                                    <input
                                                        type="text"
                                                        value={currentItem.company}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, company: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Avatar URL</label>
                                                    <input
                                                        type="url"
                                                        value={currentItem.avatar}
                                                        onChange={(e) => setCurrentItem({ ...currentItem, avatar: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Testimonial</label>
                                                <textarea
                                                    required
                                                    rows="3"
                                                    value={currentItem.text}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, text: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold resize-none"
                                                />
                                            </div>
                                        </>
                                    )}
                                </form>
                            </div>

                            <div className="p-10 border-t border-white/5 bg-[#0A0A0A] flex justify-end gap-4">
                                <button
                                    onClick={() => { setEditingType(null); setCurrentItem(null); }}
                                    className="px-8 py-4 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all font-bold uppercase text-[10px] tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="socialProofForm"
                                    className="px-10 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2 group"
                                >
                                    <Save size={18} />
                                    Save Changes <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminSocialProof;
