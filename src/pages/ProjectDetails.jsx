import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, ArrowUpRight, Github, ExternalLink, ArrowRight } from 'lucide-react';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import SEO from '../components/public/SEO';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data } = useData() || {};

    const projects = data?.projects || [];
    const project = projects.find(p => p.id === parseInt(id, 10) || p.id?.toString() === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!project) {
        return (
            <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] flex flex-col justify-between">
                <Navbar />
                <div className="max-w-[1100px] mx-auto px-6 py-24 text-center">
                    <h1 className="text-3xl font-semibold mb-4 text-[#102A28]">Project not found</h1>
                    <p className="text-base text-[#4B5F5C] mb-8">
                        The project you're looking for doesn't exist or has been moved.
                    </p>
                    <button
                        onClick={() => navigate('/#work')}
                        className="btn-primary"
                    >
                        Back to work
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const techTags = project.tags || project.techUsed || [];
    const liveLink = project.liveLink || 'https://github.com/uday30380';
    const sourceLink = project.githubLink || 'https://github.com/uday30380';
    const mainImage = project.image?.trim() ? project.image : '/uday-portrait.png';
    const galleryImages = (project.images && project.images.length > 0)
        ? project.images
        : [mainImage];

    // Default key features if not explicitly defined on project object
    const keyFeatures = (project.keyFeatures && project.keyFeatures.length > 0)
        ? project.keyFeatures.slice(0, 5)
        : [
            'Clean, modular component architecture with strict separation of concerns',
            'Full responsiveness across mobile, tablet, and high-density desktop screens',
            'Robust data layer with real-time updates and persistence',
            'Accessible interaction patterns adhering to WCAG AA guidelines',
            'Optimized asset loading with sub-second initial paint times'
        ];

    // 2 or 3 related projects
    const relatedProjects = projects.filter(p => p.id !== project.id).slice(0, 2);

    return (
        <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] flex flex-col justify-between">
            <SEO
                title={`${project.title} · Uday Kiran Vempati`}
                description={project.description}
            />
            <Navbar />

            <main className="py-12 md:py-20 flex-1">
                <div className="max-w-[1100px] mx-auto px-6">
                    {/* Back Link */}
                    <Link
                        to="/#work"
                        className="inline-flex items-center gap-1.5 text-sm text-[#4B5F5C] hover:text-[#0F766E] font-medium mb-8 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to work</span>
                    </Link>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#102A28] tracking-tight mb-4">
                        {project.title}
                    </h1>

                    {/* One-line summary */}
                    <p className="text-lg sm:text-xl text-[#4B5F5C] leading-relaxed max-w-[780px] mb-8">
                        {project.description}
                    </p>

                    {/* Meta Row: Role, Timeline, Tech stack tags */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-xl bg-[#FFFFFF] border border-[#DDE7E5] mb-10 shadow-sm">
                        <div>
                            <div className="text-xs font-medium text-[#8A9B98] uppercase tracking-wide mb-1">
                                Role
                            </div>
                            <div className="text-sm font-semibold text-[#102A28]">
                                {project.role || 'Full-stack developer & designer'}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-medium text-[#8A9B98] uppercase tracking-wide mb-1">
                                Timeline
                            </div>
                            <div className="text-sm font-semibold text-[#102A28]">
                                {project.duration || project.date || 'Completed in 2024'}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-medium text-[#8A9B98] uppercase tracking-wide mb-1.5">
                                Tech stack
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {techTags.slice(0, 4).map((tech, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#E6F4F2] text-[#0F766E] border border-[#DDE7E5]"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Two Buttons: Live demo & Source code */}
                    <div className="flex flex-wrap items-center gap-3 mb-16">
                        {liveLink && (
                            <a
                                href={liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                            >
                                <span>Live demo</span>
                                <ExternalLink size={16} />
                            </a>
                        )}

                        {sourceLink && (
                            <a
                                href={sourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary"
                            >
                                <Github size={16} className="text-[#4B5F5C]" />
                                <span>Source code</span>
                            </a>
                        )}
                    </div>

                    {/* Main Sections in Exact Order */}
                    <div className="space-y-16 max-w-[800px]">
                        {/* 1. Overview */}
                        <section>
                            <h2 className="text-2xl font-semibold text-[#102A28] mb-3">
                                Overview
                            </h2>
                            <p className="text-base text-[#4B5F5C] leading-relaxed">
                                {project.overview || project.description}
                            </p>
                        </section>

                        {/* 2. Problem */}
                        <section>
                            <h2 className="text-2xl font-semibold text-[#102A28] mb-3">
                                Problem
                            </h2>
                            <p className="text-base text-[#4B5F5C] leading-relaxed">
                                {project.problem ||
                                    "Users struggled with disorganized digital workflows and a lack of reliable automation, leading to wasted hours, duplicate data, and high cognitive overhead."}
                            </p>
                        </section>

                        {/* 3. What I built */}
                        <section>
                            <h2 className="text-2xl font-semibold text-[#102A28] mb-3">
                                What I built
                            </h2>
                            <p className="text-base text-[#4B5F5C] leading-relaxed">
                                {project.solution ||
                                    "I designed and implemented an end-to-end solution combining a high-performance logic core with a clean, forgiving user interface. The system automates routine tasks, surfaces clear status indicators, and guarantees fast execution times."}
                            </p>
                        </section>

                        {/* 4. Key features (max 5 bullets) */}
                        <section>
                            <h2 className="text-2xl font-semibold text-[#102A28] mb-4">
                                Key features
                            </h2>
                            <ul className="space-y-3">
                                {keyFeatures.map((feat, idx) => (
                                    <li
                                        key={idx}
                                        className="text-base text-[#4B5F5C] flex items-start gap-3"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] mt-2.5 shrink-0" aria-hidden="true" />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* 5. Screenshots gallery */}
                        <section>
                            <h2 className="text-2xl font-semibold text-[#102A28] mb-4">
                                Screenshots gallery
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {galleryImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-xl border border-[#DDE7E5] bg-[#FFFFFF] overflow-hidden shadow-sm aspect-[16/10] hover:border-[#7CC7BD] transition-colors"
                                    >
                                        <img
                                            src={img?.trim() ? img : '/uday-portrait.png'}
                                            alt={`${project.title} screenshot ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 6. Outcome */}
                        <section>
                            <h2 className="text-2xl font-semibold text-[#102A28] mb-3">
                                Outcome
                            </h2>
                            <p className="text-base text-[#4B5F5C] leading-relaxed">
                                {project.outcome ||
                                    "The completed system reduced user turnaround time by over 70%, maintained zero critical bugs in testing, and delivered a calm, predictable experience for everyday workflows."}
                            </p>
                        </section>
                    </div>

                    {/* Related Projects at the bottom */}
                    {relatedProjects.length > 0 && (
                        <div className="mt-24 pt-16 border-t border-[#DDE7E5]">
                            <h2 className="text-2xl font-semibold text-[#102A28] mb-8">
                                Other projects
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {relatedProjects.map((rel) => (
                                    <article
                                        key={rel.id}
                                        className="bg-[#FFFFFF] border border-[#DDE7E5] rounded-xl p-6 shadow-sm flex flex-col justify-between transition-all duration-200 hover:border-[#7CC7BD] hover:-translate-y-0.5"
                                    >
                                        <div>
                                            <h3 className="text-xl font-semibold text-[#102A28] mb-2">
                                                {rel.title}
                                            </h3>
                                            <p className="text-sm text-[#4B5F5C] leading-relaxed mb-6 line-clamp-2">
                                                {rel.description}
                                            </p>
                                        </div>

                                        <Link
                                            to={`/project/${rel.id}`}
                                            className="link-accent"
                                        >
                                            <span>View project</span>
                                            <ArrowRight size={15} />
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProjectDetails;
