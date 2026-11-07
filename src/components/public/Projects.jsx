import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { ArrowRight } from 'lucide-react';

const Projects = () => {
    const { data } = useData() || {};
    const navigate = useNavigate();

    // Show all non-draft projects, preserving their configured order or ID
    const rawProjects = (data?.projects || []).filter(p => p && p.status !== 'draft');

    // Helper to safely extract clean individual tags from techUsed and tags fields
    const getCleanTags = (project) => {
        const set = new Set();
        const sources = [
            ...(Array.isArray(project.techUsed) ? project.techUsed : []),
            ...(Array.isArray(project.tags) ? project.tags : [])
        ];

        sources.forEach(item => {
            if (typeof item === 'string' && item.trim()) {
                // Split multi-word comma separated lists like "HTML, CSS, JavaScript"
                item.split(',').forEach(sub => {
                    const clean = sub.trim();
                    if (clean && clean.length <= 25 && !clean.includes('http')) {
                        set.add(clean);
                    }
                });
            }
        });

        return Array.from(set);
    };

    return (
        <section id="work" className="py-16 md:py-24 bg-[#EEF4F3] border-t border-[#DDE7E5]">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#102A28] mb-3">
                        Selected work
                    </h2>
                    <p className="text-base text-[#4B5F5C] max-w-[620px]">
                        A selection of projects I've built, from production desktop software to full-stack cloud applications.
                    </p>
                </div>

                {/* 3-Column Grid: 3 in a row on desktop/laptops */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rawProjects.map((project) => {
                        const allTags = getCleanTags(project);
                        const displayTags = allTags.slice(0, 3);
                        const remainingTagsCount = allTags.length - 3;
                        const imageSrc = project.image?.trim() ? project.image : '/uday-portrait.png';
                        const levelBadge = project.level?.trim() || '';

                        return (
                            <article
                                key={project.id}
                                onClick={() => navigate(`/project/${project.id}`)}
                                className="bg-[#FFFFFF] border border-[#DDE7E5] rounded-xl overflow-hidden shadow-sm hover:border-[#7CC7BD] hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group"
                            >
                                <div>
                                    {/* Card Image with Floating Level Badge */}
                                    <div className="relative aspect-[16/10] bg-[#E6F4F2] border-b border-[#DDE7E5] overflow-hidden">
                                        {/* Floating Badge (Intermediate, Advanced, etc.) matching design */}
                                        {levelBadge && (
                                            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[10.5px] font-semibold uppercase tracking-wider bg-white/95 text-[#102A28] border border-[#DDE7E5] shadow-xs backdrop-blur-sm">
                                                {levelBadge}
                                            </div>
                                        )}

                                        <img
                                            src={imageSrc}
                                            alt={project.title}
                                            onError={(e) => {
                                                if (!e.currentTarget.src.endsWith('/uday-portrait.png')) {
                                                    e.currentTarget.src = '/uday-portrait.png';
                                                }
                                            }}
                                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-[#102A28] mb-1.5 line-clamp-1 group-hover:text-[#0F766E] transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm text-[#4B5F5C] leading-relaxed mb-4 line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-5 pt-0">
                                    {/* Tech Tags: #E6F4F2 fill, #0F766E text, +N pill for additional tags */}
                                    {displayTags.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-1.5 mb-4">
                                            {displayTags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#E6F4F2] text-[#0F766E] border border-[#DDE7E5]"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {remainingTagsCount > 0 && (
                                                <span
                                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#EEF4F3] text-[#4B5F5C] border border-[#DDE7E5]"
                                                    title={allTags.slice(3).join(', ')}
                                                >
                                                    +{remainingTagsCount}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* View Project Link */}
                                    <Link
                                        to={`/project/${project.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="link-accent text-sm inline-flex items-center gap-1.5"
                                    >
                                        <span>View project</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Projects;
