import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, CheckCircle2, TrendingUp, Star } from 'lucide-react';

const HonorsStats = ({ honors = [], validatedSkills = [] }) => {
    const totalAwards = honors.length;
    const skillsCount = validatedSkills.length;
    const certifications = honors.filter(h => h.category === 'Certification' || h.issuer?.toLowerCase().includes('certification')).length;

    // Safety check for empty honors
    const latestAward = honors.length > 0
        ? honors.reduce((max, h) => {
            const hDate = h.date ? new Date(h.date) : new Date(0);
            const maxDate = max.date ? new Date(max.date) : new Date(0);
            return hDate > maxDate ? h : max;
        }, honors[0])
        : null;

    const stats = [
        {
            label: 'Total Honors',
            value: totalAwards,
            icon: Trophy,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10'
        },
        {
            label: 'Validated Skills',
            value: skillsCount,
            icon: CheckCircle2,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        },
        {
            label: 'Tech Certifications',
            value: certifications,
            icon: Medal,
            color: 'text-[#4B5F5C]',
            bg: 'bg-[#EEF4F3]'
        },
        {
            label: 'Latest Achievement',
            value: latestAward ? new Date(latestAward.date).getFullYear() : '-',
            sub: latestAward?.title || 'None',
            icon: TrendingUp,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#111111] p-6 rounded-[24px] border border-white/5 hover:border-white/10 transition-all group"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon size={20} />
                        </div>
                        {stat.sub && (
                            <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-full truncate max-w-[80px]">
                                {stat.sub}
                            </span>
                        )}
                    </div>
                    <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
            ))}
        </div>
    );
};

export default HonorsStats;

