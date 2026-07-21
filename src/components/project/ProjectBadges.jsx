import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { ShieldCheck, Zap, Star, Layout, BadgeCheck, Info, History, Scale } from 'lucide-react';

const ProjectBadges = ({ version = '1.0.0', status = 'Live', license = 'MIT' }) => {
    const badges = [
        {
            icon: Zap,
            label: 'Status',
            value: status,
            color: 'from-green-500/20 to-emerald-500/20',
            textColor: 'text-green-400',
            borderColor: 'border-green-500/30'
        },
        {
            icon: History,
            label: 'Version',
            value: `v${version}`,
            color: 'from-blue-500/20 to-indigo-500/20',
            textColor: 'text-blue-400',
            borderColor: 'border-blue-500/30'
        },
        {
            icon: Scale,
            label: 'License',
            value: license,
            color: 'from-purple-500/20 to-pink-500/20',
            textColor: 'text-purple-400',
            borderColor: 'border-purple-500/30'
        },
        {
            icon: ShieldCheck,
            label: 'Security',
            value: 'Verified',
            color: 'from-orange-500/20 to-red-500/20',
            textColor: 'text-orange-400',
            borderColor: 'border-orange-500/30'
        }
    ];

    return (
        <div className="flex flex-wrap gap-3">
            {badges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                    <motion.div
                        key={badge.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -2 }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-br ${badge.color} border ${badge.borderColor} backdrop-blur-md shadow-lg`}
                    >
                        <Icon size={14} className={badge.textColor} />
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-tighter text-white/50 leading-none mb-0.5">
                                {badge.label}
                            </span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${badge.textColor} leading-none`}>
                                {badge.value}
                            </span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default ProjectBadges;
