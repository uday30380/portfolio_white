import React, { useRef } from 'react';
import { useData } from '../../context/DataContext';
import { ArrowRight, Download } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Hero = () => {
    const { data } = useData();
    const containerRef = useRef(null);
    const { scrollY } = useScroll();

    // Background parallax
    const bgY = useTransform(scrollY, [0, 500], [0, 100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 40, rotateX: -15 },
        show: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring",
                stiffness: 70,
                damping: 20,
                mass: 0.8
            }
        }
    };

    return (
        <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-[#000000]" ref={containerRef}>

            {/* Orange Background Accent - The "VEMPATI UDAY KIRAN" Circle/Blob */}
            <motion.div
                style={{ y: bgY, opacity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[150px] -z-10 animate-pulse-slow"
            ></motion.div>
            <div className="absolute bottom-0 right-0 w-[40%] h-[70%] bg-orange-500/5 rounded-tl-[200px] -z-10 bg-noise"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* Text Content */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="text-center lg:text-left order-2 lg:order-1"
                    >
                        <motion.div variants={item} className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                            <div className="w-12 h-[2px] bg-orange-500 shadow-[0_0_10px_#f97316]"></div>
                            <span className="text-xs font-bold tracking-[0.4em] text-orange-500 uppercase drop-shadow-sm">Welcome to my world</span>
                        </motion.div>

                        <motion.h1 variants={item} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-6 md:mb-8 tracking-tight">
                            I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 inline-block filter drop-shadow-lg">{data.hero.name}</span>
                        </motion.h1>

                        <motion.h2 variants={item} className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-300 mb-6 md:mb-8 border-l-4 border-orange-500 pl-4 md:pl-6 italic bg-gradient-to-r from-white/10 to-transparent p-2 rounded-r-xl">
                            {data.hero.tagline}
                        </motion.h2>

                        {/* Core Expertise Tags */}
                        {data.hero.titles && data.hero.titles.length > 0 && (
                            <motion.div variants={item} className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10">
                                {data.hero.titles.map((title, index) => (
                                    <span
                                        key={index}
                                        className="px-5 py-2.5 rounded-full bg-[#111] border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-white hover:border-orange-500 hover:bg-orange-500/10 transition-all cursor-default shadow-lg"
                                    >
                                        {title}
                                    </span>
                                ))}
                            </motion.div>
                        )}

                        <motion.p variants={item} className="text-base md:text-lg text-gray-400 mb-8 md:mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            {data.hero.intro}
                        </motion.p>

                        <motion.div variants={item} className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-6">
                            <a href="#projects" className="btn-primary flex items-center gap-2 md:gap-3 group shadow-[0_10px_30px_-10px_rgba(249,115,68,0.5)] text-sm md:text-base">
                                {data.hero.btnPrimary || 'View My Work'}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a href="#contact" className="px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all border border-white/20 text-white hover:bg-white hover:text-black flex items-center gap-2 md:gap-3 backdrop-blur-sm bg-white/5">
                                {data.hero.btnSecondary || 'Get in Touch'} <Download size={16} />
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Hero Image Group */}
                    <div className="relative order-1 lg:order-2 flex justify-center mt-8 md:mt-16 lg:mt-0">
                        {/* Background Accent Circle */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[600px] md:h-[600px] bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full -z-10 blur-3xl animate-pulse-slow"
                        ></motion.div>

                        <motion.div
                            className="relative z-10 w-56 h-56 sm:w-72 sm:h-72 md:w-[500px] md:h-[500px]"
                            animate={{ y: [0, -25, 0] }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, rotateY: 30 }}
                                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                transition={{ duration: 1.2, type: "spring" }}
                                className="w-full h-full relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-transparent opacity-20 rounded-full blur-xl transform translate-x-4 translate-y-4"></div>
                                <img
                                    src={data.hero.image}
                                    alt={data.hero.name}
                                    className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white/10 relative z-10"
                                    style={{ objectPosition: 'center 20%' }}
                                />
                            </motion.div>

                            {/* Experience Float */}
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
                                className="absolute -bottom-6 -left-6 bg-[#111111]/90 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl border border-white/10 hidden md:block animate-float whitespace-nowrap z-20"
                            >
                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-1">{data.hero.expTitle || '2nd Year'}</div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">{data.hero.expSubtitle || 'Student'}</div>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
