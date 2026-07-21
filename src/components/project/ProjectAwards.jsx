import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Trophy, Award, Star } from 'lucide-react';

const ProjectAwards = ({ awards }) => {
    if (!awards || awards.length === 0) return null;

    return (
        <div className="mt-8">
            <h4 className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest mb-4">
                <Trophy size={14} className="text-yellow-500" />
                Honors & Awards
            </h4>
            <div className="grid gap-4">
                {awards.map((award, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-yellow-500/30 transition-all group"
                    >
                        <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl group-hover:scale-110 transition-transform">
                            <Award size={20} />
                        </div>
                        <div>
                            <h5 className="text-white font-bold text-base mb-1 group-hover:text-yellow-500 transition-colors">
                                {award.title}
                            </h5>
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                <span>{award.organization}</span>
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                <span>{award.date}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ProjectAwards;
