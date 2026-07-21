import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const ProjectSkills = ({ skills }) => {
    if (!skills || skills.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-orange-500/5 text-orange-500 rounded-full border border-orange-500/20 text-xs font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all cursor-default"
                >
                    <BadgeCheck size={14} />
                    <span>{skill}</span>
                </motion.div>
            ))}
        </div>
    );
};

export default ProjectSkills;
