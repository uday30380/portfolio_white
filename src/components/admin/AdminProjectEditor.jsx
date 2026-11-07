import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Save, ArrowLeft, X } from 'lucide-react';
import ImageUpload from './ImageUpload';

const emptyProject = {
    id: '',
    title: '',
    description: '',
    tags: [],
    level: 'Intermediate',
    image: '',
    imagePath: '',
    githubLink: '',
    liveLink: '',
    featured: false,
    techUsed: [],
    problem: '',
    solution: '',
    outcome: '',
    status: 'published',
    order: 0,
    completionDate: '',
    duration: '',
    teamSize: '',
    metrics: {},
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
            const project = data.projects.find(p => p.id === parseInt(id, 10) || p.id === id);
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
        const projectId = id ? (Number(id) || id) : Date.now();

        const projectToSave = {
            ...currentProject,
            id: projectId
        };

        if (id) {
            updatedProjects = (data.projects || []).map(p => (p.id === projectId ? projectToSave : p));
        } else {
            // Prepend new project so it appears first in Selected work
            updatedProjects = [projectToSave, ...(data.projects || [])];
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

    if (loading) return <div className="p-8 text-center text-sm text-[#8A9B98]">Loading project details...</div>;

    return (
        <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] p-4 md:p-10 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/admin')}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0F766E] hover:underline"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to dashboard</span>
                    </button>
                    <span className="text-xs text-[#8A9B98]">
                        {id ? 'Editing existing project' : 'Creating new project'}
                    </span>
                </div>

                <div className="bg-white rounded-[12px] border border-[#DDE7E5] overflow-hidden shadow-sm">
                    <div className="p-6 md:p-8 border-b border-[#DDE7E5]">
                        <h1 className="text-2xl md:text-3xl font-semibold text-[#102A28] mb-1">
                            {id ? `Edit: ${currentProject.title}` : 'Create new project'}
                        </h1>
                        <p className="text-sm text-[#4B5F5C]">Manage project details, media, and case study content.</p>
                    </div>

                    <div className="p-6 md:p-8">
                        <form id="projectForm" onSubmit={handleSave} className="space-y-8">
                            {/* Basic Info Section */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-semibold text-[#102A28] border-b border-[#DDE7E5] pb-3">Core details</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentProject.title}
                                            onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-11 px-3.5 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors"
                                            placeholder="Project name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Level</label>
                                        <select
                                            value={currentProject.level}
                                            onChange={(e) => setCurrentProject({ ...currentProject, level: e.target.value })}
                                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-11 px-3.5 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <ImageUpload
                                            label="Main project image"
                                            helperText="Upload image or paste direct link"
                                            compact={true}
                                            currentImage={currentProject.image}
                                            onImageUploaded={(url) => setCurrentProject({ ...currentProject, image: url })}
                                            onImageRemoved={() => setCurrentProject({ ...currentProject, image: '' })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Source code (GitHub)</label>
                                        <input
                                            type="url"
                                            value={currentProject.githubLink || ''}
                                            onChange={(e) => setCurrentProject({ ...currentProject, githubLink: e.target.value })}
                                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-11 px-3.5 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Live link</label>
                                        <input
                                            type="url"
                                            value={currentProject.liveLink || ''}
                                            onChange={(e) => setCurrentProject({ ...currentProject, liveLink: e.target.value })}
                                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-11 px-3.5 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">One-line summary</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={currentProject.description}
                                        onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                                        className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] p-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors resize-y leading-relaxed"
                                        placeholder="Short summary displayed on cards and hero"
                                    />
                                </div>
                            </div>

                            {/* Tags & Tech */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-semibold text-[#102A28] border-b border-[#DDE7E5] pb-3">Tags & tech stack</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Category tags</label>
                                        <div className="flex gap-2">
                                            <input
                                                id="tagInput"
                                                type="text"
                                                onKeyDown={(e) => handleTagInput(e, 'tags')}
                                                className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors"
                                                placeholder="Type and press enter..."
                                            />
                                            <button
                                                type="button"
                                                onClick={() => addTagManually('tagInput', 'tags')}
                                                className="btn-secondary !h-10 text-xs"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {(currentProject.tags || []).map((tag, i) => (
                                                <span key={i} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-[#EEF4F3] text-[#102A28] rounded-[6px]">
                                                    {tag}
                                                    <button type="button" onClick={() => removeTag(tag, 'tags')} className="hover:opacity-75"><X size={12} /></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Tech stack</label>
                                        <div className="flex gap-2">
                                            <input
                                                id="techInput"
                                                type="text"
                                                onKeyDown={(e) => handleTagInput(e, 'techUsed')}
                                                className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors"
                                                placeholder="Type and press enter..."
                                            />
                                            <button
                                                type="button"
                                                onClick={() => addTagManually('techInput', 'techUsed')}
                                                className="btn-secondary !h-10 text-xs"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {(currentProject.techUsed || []).map((tech, i) => (
                                                <span key={i} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-[#EEF4F3] text-[#102A28] rounded-[6px]">
                                                    {tech}
                                                    <button type="button" onClick={() => removeTag(tech, 'techUsed')} className="hover:opacity-75"><X size={12} /></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Case Study Info */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-semibold text-[#102A28] border-b border-[#DDE7E5] pb-3">Case study narrative</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Problem</label>
                                        <textarea
                                            rows="3"
                                            value={currentProject.problem || ''}
                                            onChange={(e) => setCurrentProject({ ...currentProject, problem: e.target.value })}
                                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] p-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors resize-y leading-relaxed"
                                            placeholder="What challenge did this project address?"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">What I built (Solution)</label>
                                        <textarea
                                            rows="3"
                                            value={currentProject.solution || ''}
                                            onChange={(e) => setCurrentProject({ ...currentProject, solution: e.target.value })}
                                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] p-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors resize-y leading-relaxed"
                                            placeholder="How did you solve the problem?"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Outcome</label>
                                        <textarea
                                            rows="3"
                                            value={currentProject.outcome || ''}
                                            onChange={(e) => setCurrentProject({ ...currentProject, outcome: e.target.value })}
                                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] p-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors resize-y leading-relaxed"
                                            placeholder="What were the measurable results or achievements?"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-[#DDE7E5]">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin')}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    <Save size={16} />
                                    <span>Save changes</span>
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
