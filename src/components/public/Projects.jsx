import React, { useState, useRef, useCallback } from 'react';
import { ZoomIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'; // eslint-disable-line no-unused-vars
import SearchBar from './SearchBar';

const ProjectCard = ({ project, onNavigate, index }) => {
    const ref = useRef(null);

    // Mouse position state
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth physics for tilt
    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
    const brightness = useTransform(mouseY, [-0.5, 0.5], [1.2, 0.8]);

    return (
        <motion.div
            style={{
                perspective: 1000,
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
        >
            <motion.div
                ref={ref}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                onClick={() => onNavigate(project.id)}
                style={{
                    rotateX,
                    rotateY,
                    filter: `brightness(${brightness})`,
                    transformStyle: "preserve-3d",
                }}
                className="relative group h-full bg-[#0F0F0F] rounded-[32px] overflow-hidden border border-white/10 hover:border-orange-500/50 transition-colors duration-300 shadow-xl cursor-pointer"
            >
                {/* Holographic Glare */}
                <motion.div
                    style={{
                        background: useTransform(
                            mouseX,
                            [-0.5, 0.5],
                            [
                                "linear-gradient(to right, transparent 0%, rgba(255,255,255,0) 100%)",
                                "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 100%)"
                            ]
                        ),
                        x: useTransform(mouseX, [-0.5, 0.5], ["-100%", "100%"]),
                    }}
                    className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
                />

                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10" />
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Floating Badge */}
                    <div
                        className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
                        style={{ transform: "translateZ(20px)" }}
                    >
                        {project.level}
                    </div>

                    {/* View Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                        <div className="p-4 bg-orange-500 rounded-full text-white shadow-xl transform scale-50 group-hover:scale-100 transition-transform">
                            <ZoomIn size={24} />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 transform-style-preserve-3d">
                    <h3
                        className="text-2xl font-black text-white mb-2 group-hover:text-orange-500 transition-colors"
                        style={{ transform: "translateZ(30px)" }}
                    >
                        {project.title}
                    </h3>

                    <p
                        className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2"
                        style={{ transform: "translateZ(20px)" }}
                    >
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2" style={{ transform: "translateZ(10px)" }}>
                        {(project.techUsed || []).slice(0, 3).map((tech, i) => (
                            <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-3 py-1 rounded-lg">
                                {tech}
                            </span>
                        ))}
                        {(project.techUsed?.length > 3) && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-3 py-1 rounded-lg">
                                +{project.techUsed.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Projects = () => {
    const { data } = useData();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    const categories = ['All', 'Advanced', 'Intermediate', 'Beginner'];

    // Get all unique tags from projects
    const allTags = [...new Set((data?.projects || []).flatMap(p => p.tags || []))];

    // Filter projects based on level, search, and tags
    const filteredProjects = (data?.projects || []).filter(project => {
        const matchesLevel = filter === 'All' || project.level === filter;
        const matchesSearch = !searchTerm ||
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesTags = selectedTags.length === 0 ||
            selectedTags.some(tag => (project.tags || []).includes(tag));

        return matchesLevel && matchesSearch && matchesTags;
    });

    const handleNavigate = (projectId) => {
        navigate(`/project/${projectId}`);
    };

    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
    }, []);

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const clearFilters = () => {
        setFilter('All');
        setSearchTerm('');
        setSelectedTags([]);
    };

    const activeFilterCount = (filter !== 'All' ? 1 : 0) + selectedTags.length + (searchTerm ? 1 : 0);

    return (
        <section id="projects" className="py-24 bg-[#050505] relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/4 w-[1000px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 text-center md:text-left"
                >
                    <div className="max-w-2xl mx-auto md:mx-0">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                            <div className="w-10 h-[2px] bg-orange-500"></div>
                            <span className="text-sm font-bold tracking-[0.2em] text-orange-500 uppercase">SELECTED WORK</span>
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-white leading-tight">
                            Recent <br /><span className="text-orange-500">Projects</span>
                        </h2>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row items-center gap-4 justify-between mb-8">
                        <SearchBar onSearch={handleSearch} placeholder="Search projects..." />

                        <div className="flex items-center gap-2">
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                                >
                                    Clear all ({activeFilterCount})
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-black transition-all uppercase tracking-widest ${filter === cat
                                    ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20'
                                    : 'bg-white/5 text-gray-500 hover:text-white border border-white/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Tag Filters */}
                    {allTags.length > 0 && (
                        <div className="mb-8">
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 text-center">Filter by Technology</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {allTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedTags.includes(tag)
                                                ? 'bg-blue-500 text-white shadow-lg'
                                                : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results Count */}
                    {(searchTerm || selectedTags.length > 0 || filter !== 'All') && (
                        <p className="text-center text-sm text-gray-400 mb-6">
                            Found {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, i) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onNavigate={handleNavigate}
                                index={i}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default Projects;
