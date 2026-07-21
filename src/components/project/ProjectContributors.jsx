import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Users, Github, Linkedin, ExternalLink } from 'lucide-react';

const ProjectContributors = ({ contributors = [] }) => {
    // Mock contributors if none provided
    const displayContributors = contributors.length > 0 ? contributors : [
        {
            name: 'Uday Kiran Vempati',
            role: 'Lead Developer & Designer',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100',
            github: '#',
            linkedin: '#'
        },
        {
            name: 'AI Assistant',
            role: 'Architecture & Features',
            avatar: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?fit=crop&w=100',
            github: '#',
            linkedin: '#'
        }
    ];

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
                <Users size={24} className="text-orange-500" />
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                    Project Team
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayContributors.map((person, index) => (
                    <motion.div
                        key={person.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"
                    >
                        <img
                            src={person.avatar}
                            alt={person.name}
                            className="w-16 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-black text-white truncate group-hover:text-orange-500 transition-colors">
                                {person.name}
                            </h4>
                            <p className="text-xs font-bold text-gray-500 italic mb-2">
                                {person.role}
                            </p>
                            <div className="flex gap-3">
                                <a href={person.github} className="text-gray-400 hover:text-white transition-colors">
                                    <Github size={14} />
                                </a>
                                <a href={person.linkedin} className="text-gray-400 hover:text-white transition-colors">
                                    <Linkedin size={14} />
                                </a>
                            </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink size={16} className="text-orange-500" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ProjectContributors;
