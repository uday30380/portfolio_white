import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const AdminSkills = () => {
    const { data, updateData } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [currentSkill, setCurrentSkill] = useState(null);

    const emptySkill = {
        id: '',
        skill: '',
        percentage: 80,
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
            const updatedSkills = (data.skills || []).filter(s => s.id !== id);
            await updateData('skills', updatedSkills);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        let updatedSkills;
        const skillsList = data.skills || [];
        const existingIndex = skillsList.findIndex(s => s.id === currentSkill.id);

        if (existingIndex >= 0) {
            updatedSkills = [...skillsList];
            updatedSkills[existingIndex] = currentSkill;
        } else {
            updatedSkills = [...skillsList, currentSkill];
        }

        await updateData('skills', updatedSkills);
        setIsEditing(false);
        setCurrentSkill(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-[#102A28]">Skills</h2>
                    <p className="text-xs text-[#8A9B98]">Manage technical skills and capabilities</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="btn-primary"
                >
                    <Plus size={16} />
                    <span>Add skill</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(data.skills || []).map((skill) => (
                    <div
                        key={skill.id}
                        className="bg-white p-6 rounded-[12px] border border-[#DDE7E5] shadow-sm flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-base font-semibold text-[#102A28]">{skill.skill}</h3>
                                <div className="flex gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(skill)}
                                        className="p-1.5 text-[#4B5F5C] hover:text-[#0F766E] hover:bg-[#EEF4F3] rounded-[6px] transition-colors"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(skill.id)}
                                        className="p-1.5 text-[#8A9B98] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-[6px] transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-xs text-[#4B5F5C] leading-relaxed mb-4 line-clamp-2">
                                {skill.description || 'No description provided'}
                            </p>
                        </div>

                        <div className="pt-3 border-t border-[#DDE7E5] flex items-center justify-between text-xs text-[#8A9B98]">
                            <span>Category: {skill.iconName || 'Code'}</span>
                            <span className="font-medium text-[#102A28]">{skill.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isEditing && currentSkill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsEditing(false)}
                    />
                    <div className="relative bg-white w-full max-w-lg rounded-[12px] border border-[#DDE7E5] shadow-lg overflow-hidden z-10 flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-[#DDE7E5]">
                            <h3 className="text-lg font-semibold text-[#102A28]">
                                {currentSkill.id && (data.skills || []).some(s => s.id === currentSkill.id) ? 'Edit skill' : 'New skill'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="p-1.5 text-[#4B5F5C] hover:text-[#0F766E] rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form id="skillForm" onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Skill name</label>
                                <input
                                    type="text"
                                    required
                                    value={currentSkill.skill}
                                    onChange={(e) => setCurrentSkill({ ...currentSkill, skill: e.target.value })}
                                    className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors"
                                    placeholder="React, Java, etc."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Proficiency ({currentSkill.percentage}%)</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={currentSkill.percentage}
                                    onChange={(e) => setCurrentSkill({ ...currentSkill, percentage: parseInt(e.target.value, 10) })}
                                    className="w-full accent-[#102A28] cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Category</label>
                                <select
                                    value={currentSkill.iconName || 'Code'}
                                    onChange={(e) => setCurrentSkill({ ...currentSkill, iconName: e.target.value })}
                                    className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors"
                                >
                                    <option value="Code">Frontend</option>
                                    <option value="Database">Backend and Cloud</option>
                                    <option value="Palette">Design</option>
                                    <option value="Zap">Tools & Systems</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Description</label>
                                <textarea
                                    rows="3"
                                    value={currentSkill.description}
                                    onChange={(e) => setCurrentSkill({ ...currentSkill, description: e.target.value })}
                                    className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] p-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors resize-y leading-relaxed"
                                    placeholder="Brief description of experience..."
                                />
                            </div>

                            <div className="flex justify-end gap-2.5 pt-4 border-t border-[#DDE7E5]">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    <Save size={16} />
                                    <span>Save skill</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSkills;
