import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, X, Trophy, Save, Check } from 'lucide-react';
import ImageUpload from './ImageUpload';

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
        category: 'Certification',
        image: '',
        description: '',
        skills: [],
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
        const skillsArray = skillsString.split(',').map(s => s.trim()).filter(Boolean);
        setCurrentHonor({ ...currentHonor, skills: skillsArray });
    };

    return (
        <div className="space-y-6 text-[#102A28]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-[#102A28]">Honors & certifications</h2>
                    <p className="text-xs text-[#8A9B98]">Manage credentials, awards, and certifications</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="btn-primary"
                >
                    <Plus size={16} />
                    <span>Add honor</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {honors.map((honor) => (
                    <div
                        key={honor.id}
                        className="bg-white rounded-[12px] border border-[#DDE7E5] overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                        <div>
                            <div className="h-44 bg-[#EEF4F3] border-b border-[#DDE7E5] overflow-hidden relative">
                                {honor.image?.trim() ? (
                                    <img
                                        src={honor.image}
                                        alt={honor.title}
                                        onError={(e) => { e.currentTarget.src = '/uday-portrait.png'; }}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Trophy size={36} className="text-[#8A9B98]" />
                                    </div>
                                )}

                                <div className="absolute top-3 left-3">
                                    <span className="px-2 py-0.5 rounded-[4px] text-xs font-medium bg-white/95 text-[#102A28] border border-[#DDE7E5]">
                                        {honor.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-base font-semibold text-[#102A28] mb-1 line-clamp-1">{honor.title}</h3>
                                <p className="text-xs text-[#4B5F5C] mb-3">{honor.issuer}</p>
                                {honor.description && (
                                    <p className="text-xs text-[#8A9B98] leading-relaxed line-clamp-2 mb-3">
                                        {honor.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-[#F7FAFA] border-t border-[#DDE7E5] flex items-center justify-between">
                            <span className="text-xs text-[#8A9B98]">
                                {honor.date ? new Date(honor.date).getFullYear() : '2024'}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(honor)}
                                    className="btn-secondary !h-8 !px-3 text-xs"
                                >
                                    <Edit2 size={13} />
                                    <span>Edit</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(honor.id)}
                                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-white border border-[#DDE7E5] text-[#DC2626] hover:bg-[#FEF2F2] text-xs font-medium transition-colors"
                                >
                                    <Trash2 size={13} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isEditing && currentHonor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
                    <div className="relative bg-white w-full max-w-2xl rounded-[12px] border border-[#DDE7E5] shadow-lg overflow-hidden z-10 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-[#DDE7E5]">
                            <h3 className="text-lg font-semibold text-[#102A28]">
                                {currentHonor.id && honors.some(h => h.id === currentHonor.id) ? 'Edit honor' : 'Add new honor'}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="p-1.5 text-[#4B5F5C] hover:text-[#0F766E] rounded-lg transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-4">
                            <form id="honorForm" onSubmit={handleSave} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Title</label>
                                        <input
                                            type="text" required
                                            value={currentHonor.title}
                                            onChange={(e) => setCurrentHonor({ ...currentHonor, title: e.target.value })}
                                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                            placeholder="Certificate title..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Issuer / Organization</label>
                                        <input
                                            type="text" required
                                            value={currentHonor.issuer}
                                            onChange={(e) => setCurrentHonor({ ...currentHonor, issuer: e.target.value })}
                                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                            placeholder="Canva, Google, KL University..."
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Date</label>
                                        <input
                                            type="date"
                                            value={currentHonor.date}
                                            onChange={(e) => setCurrentHonor({ ...currentHonor, date: e.target.value })}
                                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Category</label>
                                        <select
                                            value={currentHonor.category}
                                            onChange={(e) => setCurrentHonor({ ...currentHonor, category: e.target.value })}
                                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                        >
                                            <option value="Certification">Certification</option>
                                            <option value="Award">Award</option>
                                            <option value="Recognition">Recognition</option>
                                            <option value="Achievement">Achievement</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Credential ID</label>
                                        <input
                                            type="text"
                                            value={currentHonor.credentialId || ''}
                                            onChange={(e) => setCurrentHonor({ ...currentHonor, credentialId: e.target.value })}
                                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                            placeholder="Optional ID"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Description</label>
                                    <textarea
                                        rows="3"
                                        value={currentHonor.description || ''}
                                        onChange={(e) => setCurrentHonor({ ...currentHonor, description: e.target.value })}
                                        className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] p-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] resize-y leading-relaxed"
                                        placeholder="What was this recognition for?"
                                    />
                                </div>

                                <div>
                                    <ImageUpload
                                        label="Certificate image"
                                        helperText="Upload image or enter direct link"
                                        compact={true}
                                        currentImage={currentHonor.image}
                                        onImageUploaded={(url) => setCurrentHonor({ ...currentHonor, image: url })}
                                        onImageRemoved={() => setCurrentHonor({ ...currentHonor, image: '' })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Verification link</label>
                                    <input
                                        type="url"
                                        value={currentHonor.verificationLink || ''}
                                        onChange={(e) => setCurrentHonor({ ...currentHonor, verificationLink: e.target.value })}
                                        className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Skills validated (comma separated)</label>
                                    <input
                                        type="text"
                                        value={currentHonor.skills?.join(', ') || ''}
                                        onChange={handleSkillsChange}
                                        className="w-full bg-[#FFFFFF] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                        placeholder="React, Design Systems, Figma..."
                                    />
                                </div>

                                <div className="flex gap-6 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${currentHonor.featured ? 'bg-[#102A28] border-[#102A28]' : 'border-[#DDE7E5] bg-white'}`}>
                                            {currentHonor.featured && <Check size={12} className="text-white" />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={currentHonor.featured || false} onChange={(e) => setCurrentHonor({ ...currentHonor, featured: e.target.checked })} />
                                        <span className="text-xs text-[#102A28] font-medium">Featured</span>
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t border-[#DDE7E5] bg-[#F7FAFA] flex justify-end gap-2.5">
                            <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
                            <button type="submit" form="honorForm" className="btn-primary">
                                <Save size={16} />
                                <span>Save honor</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHonors;
