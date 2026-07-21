import React from 'react';
import { motion } from 'framer-motion';

import { Calendar, Circle, CheckCircle2 } from 'lucide-react';

const ProjectTimeline = ({ timeline }) => {
    // Fallback timeline for demo
    const displayTimeline = timeline && timeline.length > 0 ? timeline : [
        { date: 'Phase 1', title: 'Conceptualization', description: 'Initial idea and project planning.' },
        { date: 'Phase 2', title: 'Design & Prototyping', description: 'UI/UX design and architecture setup.' },
        { date: 'Phase 3', title: 'Core Development', description: 'Implementing primary features and logic.' },
        { date: 'Phase 4', title: 'Testing & Optimization', description: 'Refining and fixing bugs.' },
        { date: 'Phase 5', title: 'Deployment', description: 'Final release and live hosting.' }
    ];

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-10">
                <Calendar size={24} className="text-orange-500" />
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                    Development Journey
                </h3>
            </div>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-500/50 via-purple-500/50 to-transparent ml-[-1px]"></div>

                <div className="space-y-12">
                    {displayTimeline.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-12"
                        >
                            {/* Marker */}
                            <div className="absolute left-0 top-1 p-1 bg-[#050505] rounded-full z-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    className="w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                                />
                            </div>

                            {/* Content */}
                            <div className="group">
                                <span className="text-xs font-black text-orange-500 uppercase tracking-widest mb-2 block">
                                    {item.date}
                                </span>
                                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                                    {item.title}
                                </h4>
                                <p className="text-gray-400 leading-relaxed max-w-2xl">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectTimeline;
