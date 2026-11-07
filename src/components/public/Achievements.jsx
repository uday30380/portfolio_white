import React, { useRef } from 'react';
import { useData } from '../../context/DataContext';
import { motion, useScroll } from 'framer-motion';
import { reveal, stagger, defaultViewport } from '../../motion';
import SectionHeading from '../ui/SectionHeading';

const Achievements = () => {
    const { data } = useData();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    return (
        <section id="achievements" className="py-24 md:py-32 bg-[#000000] text-white relative overflow-hidden" ref={containerRef}>
            {/* Soft Radial Gradient Ambient (no GPU blur filter) */}
            <div
                aria-hidden
                className="absolute top-0 right-0 w-96 h-96 pointer-events-none -mr-48 -mt-48"
                style={{ background: "radial-gradient(circle at center, rgba(249,115,22,0.08) 0%, transparent 70%)" }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionHeading
                    badge="RECOGNITIONS"
                    title="MILESTONES & ACHIEVEMENTS"
                    subtitle="Official honors, competitive milestones, and leadership achievements along my developer journey."
                    align="left"
                />

                <div className="relative">
                    {/* Vertical Animated SVG Line-Draw Timeline */}
                    <div className="absolute left-0 md:left-[24.5%] top-0 bottom-0 w-6 -translate-x-1/2 hidden md:block pointer-events-none">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 24 1000">
                            <line x1="12" y1="0" x2="12" y2="1000" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                            <motion.line
                                x1="12"
                                y1="0"
                                x2="12"
                                y2="1000"
                                stroke="#f97316"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                style={{ pathLength: scrollYProgress }}
                            />
                        </svg>
                    </div>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={defaultViewport}
                        className="grid gap-16 md:gap-20"
                    >
                        {(data?.achievements || []).map((achievement) => (
                            <motion.div variants={reveal} key={achievement.id} className="group relative">
                                <div className="grid md:grid-cols-12 gap-8 items-start">
                                    {/* Date Column with Timeline Dot */}
                                    <div className="md:col-span-3 relative">
                                        <div className="hidden md:block absolute right-[-17px] top-3 w-3 h-3 bg-[#000] border-2 border-orange-500 rounded-full z-10 group-hover:scale-125 group-hover:bg-orange-500 transition-transform duration-300"></div>

                                        <div className="text-lg md:text-xl font-black text-gray-400 group-hover:text-orange-500 transition-colors duration-300 uppercase tracking-widest pt-1 md:text-right md:pr-12">
                                            {achievement.date}
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className="md:col-span-9 pl-0 md:pl-8">
                                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 inline-block text-white group-hover:text-orange-500 transition-colors duration-300">
                                            {achievement.title}
                                        </h3>
                                        <div className="flex items-center gap-4 mb-5">
                                            <div className="text-orange-400 font-bold text-xs uppercase tracking-[0.2em] bg-orange-500/10 px-4 py-1.5 rounded-full ring-1 ring-orange-500/20">
                                                {achievement.organization}
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-[65ch] font-medium">
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
