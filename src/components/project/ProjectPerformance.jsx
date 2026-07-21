import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Zap, Shield, Search, Accessibility } from 'lucide-react';

const ProjectPerformance = ({ scores = {} }) => {
    // Mock scores if none provided
    const displayScores = {
        performance: scores.performance || 98,
        accessibility: scores.accessibility || 100,
        bestPractices: scores.bestPractices || 95,
        seo: scores.seo || 90
    };

    const metrics = [
        { label: 'Performance', score: displayScores.performance, icon: Zap, color: 'text-green-500', barColor: 'bg-green-500' },
        { label: 'Accessibility', score: displayScores.accessibility, icon: Accessibility, color: 'text-blue-500', barColor: 'bg-blue-500' },
        { label: 'Best Practices', score: displayScores.bestPractices, icon: Shield, color: 'text-purple-500', barColor: 'bg-purple-500' },
        { label: 'SEO', score: displayScores.seo, icon: Search, color: 'text-orange-500', barColor: 'bg-orange-500' }
    ];

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-10">
                <Zap size={24} className="text-orange-500" />
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                    Performance Audit
                </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="relative w-20 h-20 flex items-center justify-center mb-4">
                                <svg className="w-full h-full -rotate-90">
                                    <circle
                                        cx="40"
                                        cy="40"
                                        r="36"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        className="text-white/5"
                                    />
                                    <motion.circle
                                        cx="40"
                                        cy="40"
                                        r="36"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeDasharray="226.2"
                                        initial={{ strokeDashoffset: 226.2 }}
                                        whileInView={{ strokeDashoffset: 226.2 * (1 - metric.score / 100) }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                                        className={metric.color}
                                    />
                                </svg>
                                <span className={`absolute text-xl font-black ${metric.color}`}>
                                    {metric.score}
                                </span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">
                                {metric.label}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            <div className="space-y-4">
                {metrics.map((metric, index) => (
                    <div key={index} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/50">
                            <span>{metric.label}</span>
                            <span>{metric.score}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${metric.score}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: index * 0.1 + 0.8 }}
                                className={`h-full ${metric.barColor}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectPerformance;
