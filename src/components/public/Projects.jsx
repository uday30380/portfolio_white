import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { ArrowRight } from 'lucide-react';

const Projects = () => {
    const { data } = useData() || {};
    const rawProjects = (data?.projects || []).filter(p => p && p.status !== 'draft');

    return (
        <section id="work" className="py-16 md:py-24 bg-[#EEF4F3] border-t border-[#DDE7E5]">
            <div className="max-w-[1100px] mx-auto px-6">
                {/* Section Header */}
                <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#102A28] mb-3">
                        Selected work
                    </h2>
                    <p className="text-base text-[#4B5F5C] max-w-[620px]">
                        A selection of projects I've built, from production desktop software to full-stack cloud applications.
                    </p>
                </div>

                {/* 3-Column Grid: 3 in a row on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rawProjects.map((project) => {
                        const rawTags = (project.tags && project.tags.length > 0)
                            ? project.tags
                            : (project.techUsed && project.techUsed.length > 0)
                                ? project.techUsed
                                : [project.level || 'Featured'];
                        const tags = rawTags.filter(Boolean).slice(0, 3);
                        const imageSrc = project.image?.trim() ? project.image : '/uday-portrait.png';

                        return (
                            <article
                                key={project.id}
                                className="bg-[#FFFFFF] border border-[#DDE7E5] rounded-xl overflow-hidden shadow-sm hover:border-[#7CC7BD] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Card Image */}
                                    <div className="aspect-[16/10] bg-[#E6F4F2] border-b border-[#DDE7E5] overflow-hidden">
                                        <img
                                            src={imageSrc}
                                            alt={project.title}
                                            onError={(e) => {
                                                if (!e.currentTarget.src.endsWith('/uday-portrait.png')) {
                                                    e.currentTarget.src = '/uday-portrait.png';
                                                }
                                            }}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold text-[#102A28] mb-1.5 line-clamp-1">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm text-[#4B5F5C] leading-relaxed mb-4 line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-5 pt-0">
                                    {/* Tech Tags: #E6F4F2 fill, #0F766E text */}
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#E6F4F2] text-[#0F766E] border border-[#DDE7E5]"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* View Project Link */}
                                    <Link
                                        to={`/project/${project.id}`}
                                        className="link-accent text-sm"
                                    >
                                        <span>View project</span>
                                        <ArrowRight size={14} />
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
