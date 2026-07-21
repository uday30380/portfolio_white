import React, { useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Workflow, Palette, Sparkles, Code2, Download, Zap } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, useInView, animate } from 'framer-motion'; // eslint-disable-line no-unused-vars

const TiltCard = ({ children, className, onClick }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;
        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className={className}
        >
            <div style={{ transform: "translateZ(20px)" }}>
                {children}
            </div>
        </motion.div>
    );
};

const CountUp = ({ end, duration = 2, suffix = '' }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (inView) {
            const node = ref.current;
            const controls = animate(0, end, {
                duration: duration,
                onUpdate(value) {
                    node.textContent = Math.floor(value) + suffix;
                }
            });
            return () => controls.stop();
        }
    }, [inView, end, duration, suffix]);

    return <span ref={ref}>0{suffix}</span>;
};
const About = () => {
    const { data } = useData();

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
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    return (
        <section id="about" className="py-24 relative bg-[#050505] overflow-hidden">
            {/* Background Accents - Glassy Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid lg:grid-cols-12 gap-16 items-start"
                >

                    {/* Left: Heading & Large Text */}
                    <div className="lg:col-span-12 mb-8">
                        <motion.div variants={item} className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-[2px] bg-orange-500"></div>
                            <span className="text-sm font-bold tracking-[0.3em] text-orange-500 uppercase">{data?.about?.subheading || 'Identity'}</span>
                        </motion.div>
                        <motion.h2 variants={item} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-4xl">
                            {data?.about?.heading || 'Crafting Digital Innovation'}
                        </motion.h2>
                    </div>

                    {/* Left: Biography */}
                    <div className="lg:col-span-7">
                        <motion.div variants={container} className="space-y-8 text-lg text-gray-400 leading-relaxed font-medium">
                            <motion.p variants={item} className="overflow-hidden first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-black first-letter:text-orange-500 first-letter:float-left first-letter:mr-3 first-letter:leading-none">
                                {data?.about?.text1 || 'Loading...'}
                            </motion.p>
                            <motion.p variants={item}>{data?.about?.text2 || ''}</motion.p>

                            {/* Glassmorphism Quote Box */}
                            <motion.div
                                variants={item}
                                className="p-8 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl relative group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                                <p className="italic text-gray-300 relative z-10">
                                    {data?.about?.text3 || ''}
                                </p>
                            </motion.div>


                        </motion.div>
                    </div>

                    {/* Right: Stats & Focus */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Stats Grid - Glass Cards */}
                        {/* Stats Grid - Glass Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Resume Box - Spans Full Width */}
                            <TiltCard
                                onClick={() => data?.resume?.link && window.open(data.resume.link, '_blank')}
                                className="col-span-2 bg-orange-500 p-8 rounded-3xl group shadow-2xl shadow-orange-500/20 cursor-pointer relative overflow-hidden transition-all"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-4xl font-black text-white mb-2">RESUME</h3>
                                        <p className="text-xs font-bold text-white/80 uppercase tracking-widest group-hover:text-white transition-colors">Click to Open</p>
                                    </div>
                                    <div className="p-3 bg-white/20 rounded-xl text-white group-hover:bg-white group-hover:text-orange-500 transition-all">
                                        <Download size={24} />
                                    </div>
                                </div>
                            </TiltCard>

                            {/* Specific Stats: Projects & Hackathons */}
                            {(data?.about?.stats || []).filter(s => s.label.includes('Projects') || s.label.includes('Hackathons')).map((stat, idx) => (
                                <motion.div
                                    variants={item}
                                    key={idx}
                                    whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(249, 115, 22, 0.2)" }}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl group hover:border-orange-500/30 transition-all cursor-default"
                                >
                                    <div className="text-3xl font-black text-white mb-1 group-hover:text-orange-500 transition-colors">
                                        <CountUp end={parseInt(stat.value) || 0} suffix={stat.value.replace(/[0-9]/g, '')} />
                                    </div>
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Focus Areas - Premium Glass Card */}
                        <motion.div
                            variants={item}
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] p-10 rounded-3xl border border-white/10 relative overflow-hidden group shadow-2xl"
                        >
                            {/* Ambient Glow */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-full blur-[60px] -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>

                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10 text-white">
                                <Sparkles className="text-orange-500" /> Current Focus
                            </h3>

                            <ul className="space-y-6 relative z-10">
                                {[
                                    { icon: Zap, label: "Entrepreneurship", desc: "Building & shipping real products" },
                                    { icon: Code2, label: "Full Stack Dev", desc: "Java, React & Firebase apps" },
                                    { icon: Palette, label: "Brand Design", desc: "Visual identity & creative direction" }
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-4 group/item">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover/item:bg-orange-500 group-hover/item:border-orange-500 transition-all duration-300 shadow-lg">
                                            <item.icon size={20} className="text-orange-500 group-hover/item:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white group-hover/item:text-orange-500 transition-colors">{item.label}</h4>
                                            <p className="text-xs text-gray-500 group-hover/item:text-gray-400 transition-colors">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
