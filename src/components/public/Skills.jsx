import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Code, Database, Palette, Circle, Zap } from 'lucide-react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Skills = () => {
    const { data } = useData();
    const [hoveredSkill, setHoveredSkill] = useState(null);

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'Code': return <Code size={32} />;
            case 'Database': return <Database size={32} />;
            case 'Palette': return <Palette size={32} />;
            default: return <Circle size={32} />;
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    return (
        <section id="skills" className="py-32 bg-[#080808] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
                >
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-[2px] bg-orange-500"></div>
                            <span className="text-sm font-bold tracking-[0.2em] text-orange-500 uppercase">MY SKILLS</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                            Technical <span className="text-orange-500">Mastery</span>
                        </h2>
                    </div>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {(data?.skills || []).map((skill) => (
                        <motion.div
                            variants={item}
                            key={skill.id}
                            className="h-[320px] w-full [perspective:1000px] group"
                            onMouseEnter={() => setHoveredSkill(skill.id)}
                            onMouseLeave={() => setHoveredSkill(null)}
                        >
                            <motion.div
                                className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d]"
                                style={{
                                    transform: hoveredSkill === skill.id ? "rotateY(180deg)" : "rotateY(0deg)",
                                }}
                            >
                                {/* Front Face */}
                                <div className="absolute inset-0 w-full h-full bg-[#0A0A0A] rounded-[40px] border border-white/5 p-10 flex flex-col items-center justify-center text-center [backface-visibility:hidden] shadow-2xl">
                                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-white/5 group-hover:border-orange-500/50">
                                        <div className="text-orange-500">
                                            {getIcon(skill.iconName)}
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">{skill.skill}</h3>
                                    <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
                                    <p className="mt-6 text-gray-500 text-xs font-bold uppercase tracking-widest">Hover to Reveal Stats</p>
                                </div>

                                {/* Back Face */}
                                <div className="absolute inset-0 w-full h-full bg-orange-500 rounded-[40px] p-10 flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-2xl overflow-hidden relative">
                                    {/* Decorative texture */}
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-end mb-4">
                                            <h3 className="text-2xl font-black text-white uppercase">{skill.skill}</h3>
                                            <span className="text-4xl font-black text-white/90">{skill.percentage}%</span>
                                        </div>

                                        <div className="h-4 bg-black/20 rounded-full overflow-hidden mb-8 border border-white/20">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: hoveredSkill === skill.id ? `${skill.percentage}%` : 0 }}
                                                transition={{ duration: 0.8, delay: 0.2 }}
                                                className="h-full bg-white rounded-full"
                                            ></motion.div>
                                        </div>

                                        <p className="text-white/90 font-medium leading-relaxed text-sm">
                                            {skill.description}
                                        </p>
                                    </div>

                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
