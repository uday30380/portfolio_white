import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, Target, ScrollText, BarChart3, TrendingUp } from 'lucide-react';

const EngagementMetrics = () => {
    // Mock metrics (in a real app, these would come from Firebase)
    const metrics = [
        {
            label: 'Avg. Interaction Rate',
            value: '68%',
            icon: Target,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10'
        },
        {
            label: 'Scroll Depth',
            value: '85%',
            icon: ScrollText,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            label: 'Click Through Rate',
            value: '12.4%',
            icon: MousePointer2,
            color: 'text-[#4B5F5C]',
            bg: 'bg-[#EEF4F3]'
        },
        {
            label: 'Engagement Velocity',
            value: 'High',
            icon: TrendingUp,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        }
    ];

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
                <BarChart3 size={24} className="text-orange-500" />
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                    Engagement Insights
                </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${metric.bg} flex items-center justify-center mb-4 border border-white/5 group-hover:scale-110 transition-transform`}>
                                <Icon className={metric.color} size={24} />
                            </div>
                            <span className="text-2xl font-black text-white mb-1 group-hover:text-orange-500 transition-colors">
                                {metric.value}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
                                {metric.label}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Heatmap Placeholder Effect */}
            <div className="mt-10 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-white/50">Interaction Heatmap</span>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                        <div className="w-2 h-2 rounded-full bg-orange-500/50"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                </div>
                <div className="h-4 bg-white/5 rounded-full overflow-hidden flex">
                    <div className="h-full bg-red-500/20 w-[10%]"></div>
                    <div className="h-full bg-orange-500/40 w-[20%]"></div>
                    <div className="h-full bg-green-500/60 w-[40%]"></div>
                    <div className="h-full bg-orange-500/40 w-[20%]"></div>
                    <div className="h-full bg-red-500/20 w-[10%]"></div>
                </div>
            </div>
        </div>
    );
};

export default EngagementMetrics;

