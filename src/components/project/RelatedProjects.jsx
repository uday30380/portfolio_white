import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Sparkles, ArrowRight } from 'lucide-react';

const RelatedProjects = ({ currentProjectId, tags = [] }) => {
    const { data } = useData();
    const navigate = useNavigate();

    // Find projects with matching tags
    const related = data?.projects?.filter(p =>
        p.id !== currentProjectId &&
        (p.tags?.some(tag => tags.includes(tag)) || p.level === data?.projects?.find(cp => cp.id === currentProjectId)?.level)
    ).slice(0, 3) || [];

    if (related.length === 0) return null;

    return (
        <div className="mt-20">
            <div className="flex items-center gap-4 mb-10">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">
                    Related Projects
                </h3>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {related.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => navigate(`/project/${project.id}`)}
                        className="group cursor-pointer"
                    >
                        <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 mb-6 transition-all duration-500 group-hover:border-orange-500/50 group-hover:scale-[1.02] shadow-2xl">
                            <img
                                src={project.image?.trim() ? project.image : null}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            {/* View Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="px-6 py-2 bg-white text-black rounded-full font-bold flex items-center gap-2">
                                    <span>View Project</span>
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="px-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={12} className="text-orange-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500/80">
                                    {project.level} Project
                                </span>
                            </div>
                            <h4 className="text-xl font-black text-white group-hover:text-orange-500 transition-colors mb-2 line-clamp-1">
                                {project.title}
                            </h4>
                            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                                {project.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProjects;

