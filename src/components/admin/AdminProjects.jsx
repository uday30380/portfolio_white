import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';

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
            const updatedProjects = data.projects.filter(p => p.id !== id);
            await updateData('projects', updatedProjects);
        }
    };

    const toggleFeatured = async (project) => {
        const updatedProjects = data.projects.map(p =>
            p.id === project.id ? { ...p, featured: !p.featured } : p
        );
        await updateData('projects', updatedProjects);
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-[2px] bg-orange-500"></div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Portfolio Control</span>
                    </div>
                    <h2 className="text-3xl font-black text-white">Project Assets</h2>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95 group"
                >
                    <Plus size={18} />
                    <span>Upload New Project</span>
                </button>
            </div>

            {/* List View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.projects && data.projects.map((project) => (
                    <div key={project.id} className={`group bg-[#111111] rounded-[40px] border ${project.featured ? 'border-orange-500/40 shadow-xl shadow-orange-500/5' : 'border-white/5'} overflow-hidden hover:border-orange-500/30 transition-all duration-500`}>
                        <div className="h-56 overflow-hidden relative">
                            <img
                                src={project.image || 'https://via.placeholder.com/400'}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />

                            <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                <a href={`/project/${project.id}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-black/60 text-white rounded-xl backdrop-blur-md hover:bg-orange-500 transition-all" title="View Project">
                                    <Plus size={18} className="rotate-45" />
                                </a>
                                <button
                                    onClick={() => toggleFeatured(project)}
                                    className={`p-3 rounded-xl backdrop-blur-md transition-all ${project.featured ? 'bg-orange-500 text-white shadow-lg' : 'bg-black/60 text-white hover:bg-orange-500'}`}
                                >
                                    <Star size={18} fill={project.featured ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={() => handleEdit(project)}
                                    className="p-3 bg-black/60 text-white rounded-xl backdrop-blur-md hover:bg-white hover:text-black transition-all"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="p-3 bg-black/60 text-red-400 rounded-xl backdrop-blur-md hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="absolute bottom-4 left-4 flex gap-2">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black text-black uppercase tracking-widest">
                                    {project.level}
                                </span>
                            </div>
                        </div>
                        <div className="p-8">
                            <h3 className="font-black text-xl text-white mb-2 group-hover:text-orange-500 transition-colors">{project.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-medium">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {(project.techUsed || []).slice(0, 3).map((tech, i) => (
                                    <span key={i} className="text-[10px] font-black uppercase tracking-tighter px-2 py-1 bg-white/5 text-orange-500 rounded border border-white/5">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit/Create Modal */}

        </div>
    );
};

export default AdminProjects;
