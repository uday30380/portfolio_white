import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const AdminSocialProof = () => {
    const { data, updateData } = useData();
    const [editingType, setEditingType] = useState(null);
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
        <div className="space-y-10 text-[#102A28]">
            {/* Achievements Section */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-[#102A28]">Achievements</h2>
                        <p className="text-xs text-[#8A9B98]">Awards and recognition milestones</p>
                    </div>
                    <button
                        onClick={() => handleAdd('achievement')}
                        className="btn-primary"
                    >
                        <Plus size={16} />
                        <span>Add achievement</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(data.achievements || []).map((achievement) => (
                        <div key={achievement.id} className="bg-white p-5 rounded-[12px] border border-[#DDE7E5] shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="px-2 py-0.5 bg-[#EEF4F3] rounded text-xs font-medium text-[#102A28]">{achievement.date}</span>
                                    <div className="flex gap-1.5">
                                        <button onClick={() => handleEdit(achievement, 'achievement')} className="p-1.5 text-[#4B5F5C] hover:text-[#0F766E] hover:bg-[#EEF4F3] rounded transition-colors"><Edit2 size={13} /></button>
                                        <button onClick={() => handleDelete(achievement.id, 'achievement')} className="p-1.5 text-[#8A9B98] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded transition-colors"><Trash2 size={13} /></button>
                                    </div>
                                </div>
                                <h3 className="text-base font-semibold text-[#102A28] mb-1">{achievement.title}</h3>
                                <div className="text-xs text-[#8A9B98] mb-3">{achievement.organization}</div>
                                <p className="text-[#4B5F5C] text-xs leading-relaxed">{achievement.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full h-px bg-[#DDE7E5]"></div>

            {/* Testimonials Section */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-[#102A28]">Testimonials</h2>
                        <p className="text-xs text-[#8A9B98]">Client and peer endorsements</p>
                    </div>
                    <button
                        onClick={() => handleAdd('testimonial')}
                        className="btn-primary"
                    >
                        <Plus size={16} />
                        <span>Add testimonial</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(data.testimonials || []).map((testimonial) => (
                        <div key={testimonial.id} className="bg-white p-5 rounded-[12px] border border-[#DDE7E5] shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="text-sm font-semibold text-[#102A28]">{testimonial.name}</div>
                                        <div className="text-xs text-[#8A9B98]">{testimonial.role} {testimonial.company ? `@ ${testimonial.company}` : ''}</div>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button onClick={() => handleEdit(testimonial, 'testimonial')} className="p-1.5 text-[#4B5F5C] hover:text-[#0F766E] hover:bg-[#EEF4F3] rounded transition-colors"><Edit2 size={13} /></button>
                                        <button onClick={() => handleDelete(testimonial.id, 'testimonial')} className="p-1.5 text-[#8A9B98] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded transition-colors"><Trash2 size={13} /></button>
                                    </div>
                                </div>
                                <p className="text-[#4B5F5C] text-xs leading-relaxed italic">"{testimonial.text || testimonial.quote}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {editingType && currentItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => { setEditingType(null); setCurrentItem(null); }}
                    />
                    <div className="relative bg-white w-full max-w-lg rounded-[12px] border border-[#DDE7E5] shadow-lg overflow-hidden z-10 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-[#DDE7E5]">
                            <h3 className="text-lg font-semibold text-[#102A28] capitalize">
                                {currentItem.id ? `Edit ${editingType}` : `New ${editingType}`}
                            </h3>
                            <button onClick={() => { setEditingType(null); setCurrentItem(null); }} className="p-1.5 text-[#4B5F5C] hover:text-[#0F766E] rounded-lg transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-4">
                            <form id="socialProofForm" onSubmit={handleSave} className="space-y-4">
                                {editingType === 'achievement' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={currentItem.title}
                                                onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                                                className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                                placeholder="Achievement title..."
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Organization</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={currentItem.organization}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, organization: e.target.value })}
                                                    className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Date</label>
                                                <input
                                                    type="text"
                                                    value={currentItem.date}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, date: e.target.value })}
                                                    className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                                    placeholder="2024"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Description</label>
                                            <textarea
                                                required
                                                rows="3"
                                                value={currentItem.description}
                                                onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                                                className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] p-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] resize-y leading-relaxed"
                                            />
                                        </div>
                                    </>
                                )}

                                {editingType === 'testimonial' && (
                                    <>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={currentItem.name}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                                                    className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Role / Company</label>
                                                <input
                                                    type="text"
                                                    value={currentItem.role}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, role: e.target.value })}
                                                    className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Quote</label>
                                            <textarea
                                                required
                                                rows="3"
                                                value={currentItem.text || currentItem.quote || ''}
                                                onChange={(e) => setCurrentItem({ ...currentItem, text: e.target.value, quote: e.target.value })}
                                                className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] p-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] resize-y leading-relaxed"
                                            />
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>

                        <div className="p-4 border-t border-[#DDE7E5] bg-[#F7FAFA] flex justify-end gap-2.5">
                            <button
                                onClick={() => { setEditingType(null); setCurrentItem(null); }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="socialProofForm"
                                className="btn-primary"
                            >
                                <Save size={16} />
                                <span>Save</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSocialProof;
