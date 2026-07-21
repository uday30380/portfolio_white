import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Save, ArrowRight, ArrowLeft, X, Plus, Trash2 } from 'lucide-react';

const emptyProject = {
    id: '',
    title: '',
    description: '',
    tags: [],
    level: 'Intermediate',
    image: '',
    imagePath: '', // Storage path for deletion
    githubLink: '',
    liveLink: '',
    featured: false,
    techUsed: [],
    problem: '',
    solution: '',
    outcome: '',
    status: 'published', // 'published' or 'draft'
    order: 0,
    completionDate: '',
    duration: '',
    teamSize: '',
    metrics: {}, // Custom metrics object
    timeline: [],
    imageBefore: '',
    imageAfter: '',
    faqs: [],
    rating: 5,
    changelog: [],
    contributors: [],
    performance: {
        loadTime: '',
        score: 0,
        accessibility: 0,
        seo: 0
    },
    validatedSkills: [],
    honorsAwards: [],
    snippets: []
};

const AdminProjectEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, updateData } = useData();
    const [loading, setLoading] = useState(true);

    const [currentProject, setCurrentProject] = useState(emptyProject);

    useEffect(() => {
        if (id && data.projects) {
            const project = data.projects.find(p => p.id === parseInt(id) || p.id === id);
            if (project) {
                const nextProject = {
                    ...emptyProject,
                    ...project,
                    techUsed: project.techUsed || [],
                    tags: project.tags || [],
                    validatedSkills: project.validatedSkills || [],
                    honorsAwards: project.honorsAwards || [],
                    snippets: project.snippets || [],
                    performance: { ...emptyProject.performance, ...project.performance }
                };

                // eslint-disable-next-line react-hooks/set-state-in-effect
                setCurrentProject(prev => {
                    if (JSON.stringify(prev) === JSON.stringify(nextProject)) return prev;
                    return nextProject;
                });
            }
        }
        setLoading(false);
    }, [id, data.projects]);

    const handleSave = async (e) => {
        e.preventDefault();
        let updatedProjects;
        // Use ID from params if editing, or generate new ID if creating
        const projectId = id ? (Number(id) || id) : Date.now();

        const projectToSave = {
            ...currentProject,
            id: projectId
        };

        if (id) {
            updatedProjects = data.projects.map(p => (p.id === projectId ? projectToSave : p));
        } else {
            updatedProjects = [...data.projects, projectToSave];
        }

        await updateData('projects', updatedProjects);
        navigate('/admin');
    };

    const handleTagInput = (e, field) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = e.target.value.trim().replace(/,/g, '');
            if (val && !currentProject[field].includes(val)) {
                setCurrentProject({
                    ...currentProject,
                    [field]: [...(currentProject[field] || []), val]
                });
                e.target.value = '';
            }
        }
    };

    const addTagManually = (inputSelector, field) => {
        const input = document.getElementById(inputSelector);
        if (input && input.value.trim()) {
            const val = input.value.trim();
            if (!currentProject[field].includes(val)) {
                setCurrentProject({
                    ...currentProject,
                    [field]: [...(currentProject[field] || []), val]
                });
                input.value = '';
            }
        }
    };

    const removeTag = (tagToRemove, field) => {
        setCurrentProject({
            ...currentProject,
            [field]: currentProject[field].filter(tag => tag !== tagToRemove)
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-10">
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase text-xs font-black tracking-widest"
                    >
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-[2px] bg-orange-500"></div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">
                            {id ? 'Refine Asset' : 'New Project'}
                        </span>
                    </div>
                </div>

                <div className="bg-[#111111] rounded-[48px] border border-white/10 overflow-hidden shadow-2xl">
                    <div className="p-8 md:p-12 border-b border-white/5">
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                            {id ? `Edit: ${currentProject.title}` : 'Create New Project'}
                        </h1>
                        <p className="text-gray-500 font-medium">Manage your portfolio asset details and content.</p>
                    </div>

                    <div className="p-8 md:p-12">
                        <form id="projectForm" onSubmit={handleSave} className="space-y-12">
                            {/* Basic Info Section */}
                            <div className="space-y-8">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-4">Core Metadata</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentProject.title}
                                            onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                            placeholder="Elite Portfolio Dashboard"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Level</label>
                                        <select
                                            value={currentProject.level}
                                            onChange={(e) => setCurrentProject({ ...currentProject, level: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Asset Image URL</label>
                                        <div className="flex gap-3">
                                            <input
                                                type="url"
                                                value={currentProject.image}
                                                onChange={(e) => setCurrentProject({ ...currentProject, image: e.target.value })}
                                                className="flex-1 bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                            />
                                            {currentProject.image && (
                                                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 group flex-shrink-0 bg-black">
                                                    <img src={currentProject.image} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setCurrentProject({ ...currentProject, image: '' })}
                                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <X size={14} className="text-white" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Source Code (GitHub)</label>
                                        <input
                                            type="url"
                                            value={currentProject.githubLink || ''}
                                            onChange={(e) => setCurrentProject({ ...currentProject, githubLink: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Live Resource (URL)</label>
                                        <input
                                            type="url"
                                            value={currentProject.liveLink || ''}
                                            onChange={(e) => setCurrentProject({ ...currentProject, liveLink: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Narrative (Description)</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={currentProject.description}
                                        onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold resize-none"
                                    />
                                </div>
                            </div>

                            {/* Tags & Tech */}
                            <div className="space-y-8">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-4">Classification</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tags</label>
                                        <div className="flex gap-2">
                                            <input
                                                id="tagInput"
                                                type="text"
                                                onKeyDown={(e) => handleTagInput(e, 'tags')}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                placeholder="Enter to add..."
                                            />
                                            <button type="button" onClick={() => addTagManually('tagInput', 'tags')} className="px-6 bg-white/5 hover:bg-white/10 rounded-2xl font-bold uppercase text-[10px]">Add</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {(currentProject.tags || []).map((tag, i) => (
                                                <span key={i} className="flex items-center gap-2 text-[10px] font-black px-4 py-2 bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20">
                                                    {tag}
                                                    <button type="button" onClick={() => removeTag(tag, 'tags')} className="hover:text-white"><X size={12} /></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tech Stack</label>
                                        <div className="flex gap-2">
                                            <input
                                                id="techInput"
                                                type="text"
                                                onKeyDown={(e) => handleTagInput(e, 'techUsed')}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                                placeholder="Enter to add..."
                                            />
                                            <button type="button" onClick={() => addTagManually('techInput', 'techUsed')} className="px-6 bg-white/5 hover:bg-white/10 rounded-2xl font-bold uppercase text-[10px]">Add</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {(currentProject.techUsed || []).map((tech, i) => (
                                                <span key={i} className="flex items-center gap-2 text-[10px] font-black px-4 py-2 bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/20">
                                                    {tech}
                                                    <button type="button" onClick={() => removeTag(tech, 'techUsed')} className="hover:text-white"><X size={12} /></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Case Study Info */}
                            <div className="space-y-8">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-4">Case Study Details</h3>
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Problem</label>
                                        <textarea
                                            rows="3"
                                            value={currentProject.problem || ''}
                                            onChange={(e) => setCurrentProject({ ...currentProject, problem: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold resize-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Solution</label>
                                        <textarea
                                            rows="3"
                                            value={currentProject.solution || ''}
                                            onChange={(e) => setCurrentProject({ ...currentProject, solution: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold resize-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Outcome</label>
                                        <textarea
                                            rows="3"
                                            value={currentProject.outcome || ''}
                                            onChange={(e) => setCurrentProject({ ...currentProject, outcome: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Media & Metrics */}
                            <div className="space-y-8">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-4">Media & Metrics</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Image Before (URL)</label>
                                        <div className="flex gap-3">
                                            <input
                                                type="url"
                                                value={currentProject.imageBefore || ''}
                                                onChange={(e) => setCurrentProject({ ...currentProject, imageBefore: e.target.value })}
                                                className="flex-1 bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                            />
                                            {currentProject.imageBefore && (
                                                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 group flex-shrink-0 bg-black">
                                                    <img src={currentProject.imageBefore} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setCurrentProject({ ...currentProject, imageBefore: '' })}
                                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <X size={14} className="text-white" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Image After (URL)</label>
                                        <div className="flex gap-3">
                                            <input
                                                type="url"
                                                value={currentProject.imageAfter || ''}
                                                onChange={(e) => setCurrentProject({ ...currentProject, imageAfter: e.target.value })}
                                                className="flex-1 bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                            />
                                            {currentProject.imageAfter && (
                                                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 group flex-shrink-0 bg-black">
                                                    <img src={currentProject.imageAfter} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setCurrentProject({ ...currentProject, imageAfter: '' })}
                                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <X size={14} className="text-white" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-6">
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Performance Metrics</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Load Time</label>
                                            <input
                                                type="text"
                                                value={currentProject.performance?.loadTime || ''}
                                                onChange={(e) => setCurrentProject({
                                                    ...currentProject,
                                                    performance: { ...currentProject.performance, loadTime: e.target.value }
                                                })}
                                                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-all font-bold text-sm"
                                                placeholder="0.8s"
                                            />
                                        </div>
                                        {/* Other performance inputs */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Score</label>
                                            <input
                                                type="number"
                                                value={currentProject.performance?.score || 0}
                                                onChange={(e) => setCurrentProject({
                                                    ...currentProject,
                                                    performance: { ...currentProject.performance, score: parseInt(e.target.value) }
                                                })}
                                                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-all font-bold text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Accessibility</label>
                                            <input
                                                type="number"
                                                value={currentProject.performance?.accessibility || 0}
                                                onChange={(e) => setCurrentProject({
                                                    ...currentProject,
                                                    performance: { ...currentProject.performance, accessibility: parseInt(e.target.value) }
                                                })}
                                                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-all font-bold text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">SEO</label>
                                            <input
                                                type="number"
                                                value={currentProject.performance?.seo || 0}
                                                onChange={(e) => setCurrentProject({
                                                    ...currentProject,
                                                    performance: { ...currentProject.performance, seo: parseInt(e.target.value) }
                                                })}
                                                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-all font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Lists Sections (Timeline, FAQs, Changelog, Contributors, Skills, Awards, Snippets) */}
                            {/* Validated Skills */}
                            <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Validated Skills</h4>
                                    <div className="flex gap-2">
                                        <input
                                            id="skillInput"
                                            type="text"
                                            onKeyDown={(e) => handleTagInput(e, 'validatedSkills')}
                                            className="w-40 bg-white/5 border border-white/5 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-orange-500 transition-all font-bold text-xs"
                                            placeholder="Skill..."
                                        />
                                        <button type="button" onClick={() => addTagManually('skillInput', 'validatedSkills')} className="px-4 py-2 bg-orange-500/10 text-orange-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all border border-orange-500/20">
                                            Add
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(currentProject.validatedSkills || []).map((skill, i) => (
                                        <span key={i} className="flex items-center gap-2 text-[10px] font-black px-4 py-2 bg-pink-500/10 text-pink-500 rounded-full border border-pink-500/20">
                                            {skill}
                                            <button type="button" onClick={() => removeTag(skill, 'validatedSkills')} className="hover:text-white"><X size={12} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Honors & Awards */}
                            <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Honors & Awards</h4>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentProject({
                                            ...currentProject,
                                            honorsAwards: [...(currentProject.honorsAwards || []), { title: '', organization: '', date: '' }]
                                        })}
                                        className="px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-white transition-all border border-yellow-500/20"
                                    >
                                        Add Award
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {(currentProject.honorsAwards || []).map((award, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-black/40 rounded-2xl border border-white/5 relative group/award">
                                            <input type="text" value={award.title} placeholder="Title" onChange={e => {
                                                const newAwards = [...currentProject.honorsAwards];
                                                newAwards[index].title = e.target.value;
                                                setCurrentProject({ ...currentProject, honorsAwards: newAwards });
                                            }} className="bg-white/5 border border-white/5 rounded-xl py-2 px-4 text-white text-xs font-bold w-full" />
                                            <input type="text" value={award.organization} placeholder="Organization" onChange={e => {
                                                const newAwards = [...currentProject.honorsAwards];
                                                newAwards[index].organization = e.target.value;
                                                setCurrentProject({ ...currentProject, honorsAwards: newAwards });
                                            }} className="bg-white/5 border border-white/5 rounded-xl py-2 px-4 text-white text-xs font-bold w-full" />
                                            <input type="text" value={award.date} placeholder="Date" onChange={e => {
                                                const newAwards = [...currentProject.honorsAwards];
                                                newAwards[index].date = e.target.value;
                                                setCurrentProject({ ...currentProject, honorsAwards: newAwards });
                                            }} className="bg-white/5 border border-white/5 rounded-xl py-2 px-4 text-white text-xs font-bold w-full" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newArr = currentProject.honorsAwards.filter((_, i) => i !== index);
                                                    setCurrentProject({ ...currentProject, honorsAwards: newArr });
                                                }}
                                                className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full opacity-100 transition-all shadow-lg scale-75"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submitting */}
                            <div className="flex justify-end gap-6 pt-10 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin')}
                                    className="px-8 py-4 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all font-bold uppercase text-[10px] tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-12 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProjectEditor;
