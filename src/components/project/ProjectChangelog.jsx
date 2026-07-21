import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { History, GitCommit, ArrowUpCircle, PlusCircle, CheckCircle2, ArrowRightCircle } from 'lucide-react';

const ProjectChangelog = ({ changelog = [] }) => {
    // Mock changelog if none provided
    const displayChangelog = changelog.length > 0 ? changelog : [
        { version: '1.0.0', date: 'Jan 20, 2026', title: 'Initial Release', changes: ['Core features implemented', 'UI/UX design completed'] },
        { version: '0.9.0', date: 'Jan 15, 2026', title: 'Beta Testing', changes: ['Bug fixes', 'Performance optimizations'] },
        { version: '0.8.0', date: 'Jan 10, 2026', title: 'Early Access', changes: ['Internal testing', 'Architecture setup'] }
    ];

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
                <History size={24} className="text-orange-500" />
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                    Project Changelog
                </h3>
            </div>

            <div className="space-y-8">
                {displayChangelog.map((entry, index) => (
                    <motion.div
                        key={entry.version}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group pl-8"
                    >
                        {/* Status Line */}
                        <div className="absolute left-0 top-1 bottom-0 w-[2px] bg-white/10 group-last:bottom-full group-hover:bg-orange-500/30 transition-colors"></div>
                        <div className="absolute left-[-4px] top-1 w-[10px] h-[10px] rounded-full bg-[#050505] border-2 border-orange-500 group-hover:scale-125 transition-transform"></div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-black text-white uppercase tracking-widest">
                                    v{entry.version}
                                </span>
                                <h4 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors">
                                    {entry.title}
                                </h4>
                            </div>
                            <span className="text-xs font-bold text-gray-500">{entry.date}</span>
                        </div>

                        <ul className="space-y-2">
                            {entry.changes.map((change, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                    <GitCommit size={12} className="text-orange-500/50" />
                                    {change}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ProjectChangelog;
