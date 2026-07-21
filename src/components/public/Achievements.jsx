import React, { useRef } from 'react';
import { useData } from '../../context/DataContext';
import { motion, useScroll, useTransform } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Achievements = () => {
    const { data } = useData();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -50 },
        show: {
            opacity: 1,
            x: 0,
            transition: { type: "spring", stiffness: 50, damping: 20 }
        }
    };

    return (
        <section id="achievements" className="py-24 bg-[#000000] text-white relative overflow-hidden" ref={containerRef}>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-[150px] opacity-10 -mr-48 -mt-48 animate-pulse-slow"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center md:text-left mb-24"
                >
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                        <div className="w-10 h-[2px] bg-orange-500"></div>
                        <span className="text-sm font-bold tracking-[0.2em] text-orange-500 uppercase">RECOGNITIONS</span>
                    </div>
                    <h2 className="text-4xl md:text-8xl font-black mb-6 leading-[1]">
                        Milestones & <br /><span className="text-orange-500">Achievements</span>
                    </h2>
                </motion.div>

                <div className="relative">
                    {/* Vertical Animated Timeline Line */}
                    <div className="absolute left-0 md:left-[24.5%] top-0 bottom-0 w-[1px] bg-white/10 hidden md:block">
                        <motion.div
                            style={{ scaleY, originY: 0 }}
                            className="w-full h-full bg-gradient-to-b from-orange-500 via-orange-500 to-transparent"
                        ></motion.div>
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid gap-20"
                    >
                        {(data?.achievements || []).map((achievement) => (
                            <motion.div variants={item} key={achievement.id} className="group relative">
                                <div className="grid md:grid-cols-12 gap-8 items-start">
                                    {/* Date Column with Timeline Dot */}
                                    <div className="md:col-span-3 relative">
                                        <div className="hidden md:block absolute right-[-17px] top-3 w-3 h-3 bg-[#000] border-2 border-orange-500 rounded-full z-10 group-hover:scale-150 group-hover:bg-orange-500 transition-all duration-300"></div>

                                        <div className="text-xl font-black text-gray-500 group-hover:text-orange-500 transition-all duration-300 uppercase tracking-widest pt-2 md:text-right md:pr-12">
                                            {achievement.date}
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className="md:col-span-9 pl-0 md:pl-8">
                                        <h3 className="text-3xl md:text-5xl font-black mb-6 group-hover:translate-x-4 transition-transform duration-700 inline-block bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 group-hover:to-orange-500">
                                            {achievement.title}
                                        </h3>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em] bg-orange-500/10 px-6 py-2 rounded-full ring-1 ring-orange-500/20 group-hover:bg-orange-500 group-hover:text-black transition-all">
                                                {achievement.organization}
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-xl leading-relaxed max-w-4xl font-medium group-hover:text-gray-300 transition-colors">
                                            {achievement.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Achievements;
