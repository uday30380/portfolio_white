import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, Star, ExternalLink } from 'lucide-react';

const AdminProjects = () => {
    const { data, updateData } = useData();
    const navigate = useNavigate();

    const handleEdit = (project) => {
        navigate(`/admin/project/edit/${project.id}`);
    };

    const handleAdd = () => {
        navigate('/admin/project/new');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this project forever?')) {
            const updatedProjects = (data.projects || []).filter(p => p.id !== id);
            await updateData('projects', updatedProjects);
        }
    };

    const toggleFeatured = async (project) => {
        const updatedProjects = (data.projects || []).map(p =>
            p.id === project.id ? { ...p, featured: !p.featured } : p
        );
        await updateData('projects', updatedProjects);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-[#102A28]">Projects</h2>
                    <p className="text-xs text-[#8A9B98]">Manage portfolio work and project case studies</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="btn-primary"
                >
                    <Plus size={16} />
                    <span>New project</span>
                </button>
            </div>

            {/* List View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(data.projects || []).map((project) => (
                    <div
                        key={project.id}
                        className={`bg-white rounded-[12px] border ${
                            project.featured ? 'border-[#102A28]' : 'border-[#DDE7E5]'
                        } overflow-hidden shadow-sm flex flex-col justify-between`}
                    >
                        <div>
                            <div className="h-44 bg-[#EEF4F3] border-b border-[#DDE7E5] overflow-hidden relative">
                                <img
                                    src={project.image?.trim() ? project.image : '/uday-portrait.png'}
                                    alt={project.title}
                                    onError={(e) => { e.currentTarget.src = '/uday-portrait.png'; }}
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute top-3 right-3 flex gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => toggleFeatured(project)}
                                        className={`p-1.5 rounded-[6px] border ${
                                            project.featured
                                                ? 'bg-[#EEF4F3] text-[#102A28] border-[#102A28]'
                                                : 'bg-white/90 text-[#4B5F5C] border-[#DDE7E5] hover:text-[#0F766E]'
                                        } transition-colors`}
                                        title="Toggle featured"
                                    >
                                        <Star size={15} fill={project.featured ? "currentColor" : "none"} />
                                    </button>
                                    <a
                                        href={`/project/${project.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 bg-white/90 text-[#4B5F5C] hover:text-[#0F766E] border border-[#DDE7E5] rounded-[6px] transition-colors"
                                        title="View live page"
                                    >
                                        <ExternalLink size={15} />
                                    </a>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="font-semibold text-base text-[#102A28] mb-1.5 line-clamp-1">
                                    {project.title}
                                </h3>
                                <p className="text-[#4B5F5C] text-xs line-clamp-2 mb-4 leading-relaxed">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {(project.tags || project.techUsed || []).slice(0, 3).map((tech, i) => (
                                        <span
                                            key={i}
                                            className="text-xs px-2 py-0.5 bg-[#EEF4F3] text-[#102A28] rounded-[4px]"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-[#F7FAFA] border-t border-[#DDE7E5] flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => handleEdit(project)}
                                className="btn-secondary !h-8 !px-3 text-xs"
                            >
                                <Edit2 size={13} />
                                <span>Edit</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(project.id)}
                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-white border border-[#DDE7E5] text-[#DC2626] hover:bg-[#FEF2F2] text-xs font-medium transition-colors"
                            >
                                <Trash2 size={13} />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminProjects;
