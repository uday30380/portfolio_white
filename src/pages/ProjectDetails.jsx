import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, ExternalLink, Github, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import Breadcrumb from '../components/public/Breadcrumb';
import ShareButton from '../components/public/ShareButton';
import ProjectNavigation from '../components/public/ProjectNavigation';
import SocialShareManager from '../components/project/SocialShareManager';
import ProjectReactions from '../components/project/ProjectReactions';
import ProjectBookmark from '../components/project/ProjectBookmark';
import ProjectRating from '../components/project/ProjectRating';
import ProjectComments from '../components/project/ProjectComments';
import ProjectAnalytics from '../components/project/ProjectAnalytics';
import ProjectGallery from '../components/project/ProjectGallery';
import ExportProject from '../components/project/ExportProject';
import AccessibilityTools from '../components/project/AccessibilityTools';

import ProjectTimeline from '../components/project/ProjectTimeline';
import RelatedProjects from '../components/project/RelatedProjects';
import LiveDemoEmbed from '../components/project/LiveDemoEmbed';
import ProjectBadges from '../components/project/ProjectBadges';
import TechStackExplorer from '../components/project/TechStackExplorer';
import EngagementMetrics from '../components/project/EngagementMetrics';
import BeforeAfterSlider from '../components/project/BeforeAfterSlider';
import ProjectChangelog from '../components/project/ProjectChangelog';
import ProjectContributors from '../components/project/ProjectContributors';
import ProjectPerformance from '../components/project/ProjectPerformance';
import ProjectFaq from '../components/project/ProjectFaq';
import ProjectSkills from '../components/project/ProjectSkills';
import ProjectAwards from '../components/project/ProjectAwards';


const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data } = useData();

    const project = data?.projects?.find(p => p.id === parseInt(id));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!project) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white mb-4">Project Not Found</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="fixed top-0 left-1/4 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
            <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

            <Navbar />

            {/* Back Button - Fixed Position */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="fixed top-24 left-4 md:left-8 z-50"
            >
                <button
                    onClick={() => navigate('/#projects')}
                    className="flex items-center gap-2 px-6 py-3 bg-black/80 backdrop-blur-xl hover:bg-orange-500 text-white rounded-full transition-all border border-white/10 font-bold shadow-xl group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden md:inline">Back</span>
                </button>
            </motion.div>

            {/* Hero Section with Full Image */}
            <div className="relative pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Breadcrumb */}
                    <Breadcrumb items={[
                        { label: 'Projects', href: '/#projects' },
                        { label: project.title }
                    ]} />

                    {/* Project Badge & Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-[2px] bg-gradient-to-r from-orange-500 to-transparent"></div>
                                <span className="text-xs font-black tracking-[0.3em] text-orange-500 uppercase flex items-center gap-2">
                                    <Sparkles size={14} />
                                    {project.level} Project
                                </span>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <AccessibilityTools />
                                <SocialShareManager
                                    project={project}
                                    url={window.location.href}
                                />
                                <ProjectBookmark
                                    projectId={project.id}
                                    projectTitle={project.title}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight">
                                {project.title}
                            </h1>
                            <div className="pb-2">
                                <ProjectBadges version={project.version} status={project.status} />
                            </div>
                        </div>
                        <p className="text-base sm:text-xl md:text-2xl text-gray-400 max-w-4xl font-medium leading-relaxed project-description mb-8">
                            {project.description}
                        </p>
                        <ProjectSkills skills={project.validatedSkills} />
                    </motion.div>

                    {/* Full Width Image with Glassmorphic Border */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="relative rounded-[48px] overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl mb-16"
                    >
                        <div className="aspect-video w-full">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-contain p-8"
                            />
                        </div>
                        {/* Glassmorphic Overlay Effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-40 pointer-events-none"></div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

                {/* Reactions Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-16"
                >
                    <ProjectReactions projectId={project.id} />
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-4 justify-center mb-20"
                >
                    {project.liveLink && (
                        <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group px-10 py-5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-orange-500/30 transition-all flex items-center gap-3 relative overflow-hidden"
                        >
                            <span className="relative z-10">Live Preview</span>
                            <ExternalLink size={20} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </a>
                    )}
                    {project.githubLink && (
                        <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group px-10 py-5 rounded-2xl bg-white/5 backdrop-blur-xl text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3 border border-white/10 hover:border-white"
                        >
                            <span>Source Code</span>
                            <Github size={20} className="group-hover:rotate-12 transition-transform" />
                        </a>
                    )}
                </motion.div>

                {/* Live Experience Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-20"
                >
                    <LiveDemoEmbed url={project.liveLink} title={project.title} />
                </motion.div>



                {/* Gallery Section */}
                {project.image && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                        className="mb-20"
                    >
                        <ProjectGallery images={project.image} title={project.title} />
                    </motion.div>
                )}

                {/* Tech Stack Explorer Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-20"
                >
                    <TechStackExplorer tech={project.techUsed} />
                </motion.div>

                {/* Project Details Sections - Enhanced */}
                <div className="grid lg:grid-cols-3 gap-8 mb-20">
                    {[
                        { title: 'The Challenge', content: project.problem, icon: '🎯', gradient: 'from-red-500/10 to-orange-500/10' },
                        { title: 'The Solution', content: project.solution, icon: '💡', gradient: 'from-blue-500/10 to-purple-500/10' },
                        { title: 'The Result', content: project.outcome, icon: '🚀', gradient: 'from-green-500/10 to-emerald-500/10' }
                    ].map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + idx * 0.15 }}
                            className={`group relative bg-gradient-to-br ${section.gradient} backdrop-blur-xl rounded-[40px] p-10 border border-white/10 hover:border-orange-500/30 transition-all duration-500 hover:scale-[1.02] shadow-xl`}
                        >
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/5 to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            {/* Icon */}
                            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">
                                {section.icon}
                            </div>

                            {/* Title */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-[3px] bg-gradient-to-r from-orange-500 to-transparent"></div>
                                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">
                                    {section.title}
                                </h4>
                            </div>

                            {/* Content */}
                            <p className="text-gray-300 font-medium leading-relaxed text-base">
                                {section.content || 'No information provided yet.'}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Awards Section */}
                {project.honorsAwards && project.honorsAwards.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="mb-20"
                    >
                        <ProjectAwards awards={project.honorsAwards} />
                    </motion.div>
                )}

                {/* Timeline Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.95 }}
                    className="mb-20"
                >
                    <ProjectTimeline timeline={project.timeline} title={project.title} />
                </motion.div>
                {/* Rating Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="mb-20"
                >
                    <ProjectRating projectId={project.id} />
                </motion.div>

                {/* Visual Comparison Section */}
                {(project.imageBefore && project.imageAfter) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.05 }}
                        className="mb-20"
                    >
                        <BeforeAfterSlider
                            before={project.imageBefore}
                            after={project.imageAfter}
                            title={project.title}
                        />
                    </motion.div>
                )}

                {/* Analytics & Metrics Section */}
                <div className="grid lg:grid-cols-2 gap-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                    >
                        <ProjectAnalytics projectId={project.id} />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.15 }}
                    >
                        <EngagementMetrics projectId={project.id} />
                    </motion.div>
                </div>

                {/* History & Team Section */}
                <div className="grid lg:grid-cols-2 gap-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.25 }}
                    >
                        <ProjectChangelog changelog={project.changelog} />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 }}
                    >
                        <ProjectContributors contributors={project.contributors} />
                    </motion.div>
                </div>

                {/* Export Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.35 }}
                    className="mb-20"
                >
                    <ExportProject project={project} url={window.location.href} />
                </motion.div>

                {/* Audit & QA Section */}
                <div className="grid lg:grid-cols-2 gap-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 }}
                    >
                        <ProjectPerformance scores={project.performance} />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.45 }}
                    >
                        <ProjectFaq faqs={project.faqs} />
                    </motion.div>
                </div>

                {/* Comments Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="mb-20"
                >
                    <ProjectComments projectId={project.id} />
                </motion.div>

                {/* Related Projects Section */}
                <RelatedProjects currentProjectId={project.id} tags={project.tags} />

                {/* Project Navigation */}
                <ProjectNavigation currentProjectId={project.id} />
            </div>

            <Footer />
        </div >
    );
};

export default ProjectDetails;
