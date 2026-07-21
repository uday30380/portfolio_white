import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, X, Save, Command, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

const AdminSkills = () => {
    const { data, updateData } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [currentSkill, setCurrentSkill] = useState(null);

    const emptySkill = {
        id: '',
        skill: '',
        percentage: 0,
        description: '',
        iconName: 'Code'
    };

    const handleEdit = (skill) => {
        setCurrentSkill(skill);
        setIsEditing(true);
    };

    const handleAdd = () => {
        setCurrentSkill({ ...emptySkill, id: Date.now() });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this skill?')) {
            const updatedSkills = data.skills.filter(s => s.id !== id);
            await updateData('skills', updatedSkills);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        let updatedSkills;
        const existingIndex = data.skills.findIndex(s => s.id === currentSkill.id);

        if (existingIndex >= 0) {
            updatedSkills = [...data.skills];
            updatedSkills[existingIndex] = currentSkill;
        } else {
            updatedSkills = [...data.skills, currentSkill];
        }

        await updateData('skills', updatedSkills);
        setIsEditing(false);
        setCurrentSkill(null);
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-[2px] bg-orange-500"></div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Skill Matrix</span>
                    </div>
                    <h2 className="text-3xl font-black text-white">Technical Proficiency</h2>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95 group"
                >
                    <Plus size={18} />
                    <span>Append New Skill</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.skills && data.skills.map((skill) => (
                    <div key={skill.id} className="bg-[#111111] p-10 rounded-[40px] border border-white/5 group hover:border-orange-500/30 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight">{skill.skill}</h3>
                                <div className="text-4xl font-black text-orange-500 mt-2">{skill.percentage}%</div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(skill)} className="p-3 bg-white/5 text-gray-400 hover:bg-white hover:text-black rounded-xl transition-all">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(skill.id)} className="p-3 bg-white/5 text-gray-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-8 relative z-10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.percentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-orange-500 shadow-[0_0_10px_rgba(255,125,68,0.5)]"
                            />
                        </div>

                        <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2 relative z-10">
                            {skill.description}
                        </p>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                            onClick={() => setIsEditing(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#0A0A0A] w-full max-w-2xl rounded-[48px] border border-white/10 shadow-3xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center p-10 border-b border-white/5 bg-[#0A0A0A]">
                                <div>
                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2 block">Skill Config</span>
                                    <h3 className="text-2xl font-black text-white">
                                        {currentSkill.id && data.skills.find(s => s.id === currentSkill.id) ? 'Refine Skill' : 'New Skill Definition'}
                                    </h3>
                                </div>
                                <button onClick={() => setIsEditing(false)} className="p-4 bg-white/5 hover:bg-orange-500 text-white rounded-full transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-10">
                                <form id="skillForm" onSubmit={handleSave} className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2 md:col-span-1">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Skill Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={currentSkill.skill}
                                                onChange={(e) => setCurrentSkill({ ...currentSkill, skill: e.target.value })}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                placeholder="React Optimization"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Proficiency ({currentSkill.percentage}%)</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={currentSkill.percentage}
                                                onChange={(e) => setCurrentSkill({ ...currentSkill, percentage: parseInt(e.target.value) })}
                                                className="w-full h-12 accent-orange-500 cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Icon Type</label>
                                        <select
                                            value={currentSkill.iconName}
                                            onChange={(e) => setCurrentSkill({ ...currentSkill, iconName: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                        >
                                            <option value="Code">Coding Icon</option>
                                            <option value="Database">Database Icon</option>
                                            <option value="Palette">Design Icon</option>
                                            <option value="Zap">Efficiency Icon</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Scope (Description)</label>
                                        <textarea
                                            required
                                            rows="3"
                                            value={currentSkill.description}
                                            onChange={(e) => setCurrentSkill({ ...currentSkill, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold resize-none"
                                            placeholder="Define the depth of knowledge..."
                                        />
                                    </div>
                                </form>
                            </div>

                            <div className="p-10 border-t border-white/5 bg-[#0A0A0A] flex justify-end gap-4">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-8 py-4 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all font-bold uppercase text-[10px] tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="skillForm"
                                    className="px-10 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2 group"
                                >
                                    <Save size={18} />
                                    Commit Definition <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminSkills;
