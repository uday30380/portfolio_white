import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';

const ProjectNavigation = ({ currentProjectId }) => {
    const navigate = useNavigate();
    const { data } = useData();
    const projects = data?.projects || [];

    const currentIndex = projects.findIndex(p => p.id === currentProjectId);
    const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
    const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft' && prevProject) {
                navigate(`/project/${prevProject.id}`);
            } else if (e.key === 'ArrowRight' && nextProject) {
                navigate(`/project/${nextProject.id}`);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [prevProject, nextProject, navigate]);

    if (projects.length <= 1) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-between gap-4 py-12 border-t border-white/10"
        >
            {/* Previous Project */}
            <button
                onClick={() => navigate(`/project/${prevProject.id}`)}
                className="group flex items-center gap-4 flex-1 p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-orange-500/30 transition-all text-left"
            >
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-full group-hover:bg-orange-500 transition-all">
                    <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Previous</p>
                    <h3 className="text-white font-bold truncate group-hover:text-orange-500 transition-colors">
                        {prevProject.title}
                    </h3>
                </div>
            </button>

            {/* Next Project */}
            <button
                onClick={() => navigate(`/project/${nextProject.id}`)}
                className="group flex items-center gap-4 flex-1 p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-orange-500/30 transition-all text-right"
            >
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Next</p>
                    <h3 className="text-white font-bold truncate group-hover:text-orange-500 transition-colors">
                        {nextProject.title}
                    </h3>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-full group-hover:bg-orange-500 transition-all">
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </button>
        </motion.div>
    );
};

export default ProjectNavigation;

