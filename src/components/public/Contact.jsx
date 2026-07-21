import React, { useState } from 'react';
import { Mail, Phone, Instagram, Send, Palette, User, MessageCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'; // eslint-disable-line no-unused-vars

const TiltCard = ({ children, className }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

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
            className={className}
        >
            <div style={{ transform: "translateZ(20px)" }}>
                {children}
            </div>
        </motion.div>
    );
};

const Contact = () => {
    const { data } = useData();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await addDoc(collection(db, 'messages'), {
                ...formData,
                createdAt: serverTimestamp(),
                read: false
            });
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error(error);
            setStatus('error');
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
        <section id="contact" className="py-24 bg-[#0A0A0A] relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-10 h-[2px] bg-orange-500"></div>
                        <span className="text-sm font-bold tracking-[0.2em] text-orange-500 uppercase">GET IN TOUCH</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6">
                        Let's Talk <br /><span className="text-orange-500">Innovation</span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
                        Have a project in mind or just want to say hello? I'd love to hear from you.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start"
                >
                    {/* Contact Info */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="space-y-6">
                            <motion.a variants={item} href={`mailto:${data?.contact?.email || ''}`} className="group flex items-center gap-6 p-8 bg-white/5 backdrop-blur-md rounded-[32px] hover:bg-white/10 text-white transition-all duration-500 border border-white/5 hover:border-orange-500/30">
                                <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20 group-hover:scale-110 transition-transform">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <div className="text-xs font-black uppercase tracking-widest text-orange-500 mb-1">Email Me</div>
                                    <div className="text-lg font-black">{data?.contact?.email || 'N/A'}</div>
                                </div>
                            </motion.a>

                            <motion.a variants={item} href={`tel:${data?.contact?.phone || ''}`} className="group flex items-center gap-6 p-8 bg-white/5 backdrop-blur-md rounded-[32px] hover:bg-white/10 text-white transition-all duration-500 border border-white/5 hover:border-orange-500/30">
                                <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20 group-hover:scale-110 transition-transform">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <div className="text-xs font-black uppercase tracking-widest text-orange-500 mb-1">Call Me</div>
                                    <div className="text-lg font-black">{data?.contact?.phone || 'N/A'}</div>
                                </div>
                            </motion.a>
                        </div>

                        {/* Social Links */}
                        <TiltCard className="p-10 bg-[#0F0F0F] border border-white/5 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>

                            <h3 className="text-2xl font-black mb-8 relative z-10">Social Presence</h3>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <a href={`https://instagram.com/${(data?.contact?.instagram || '').replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-orange-500 transition-all group/link border border-white/5 hover:border-orange-500">
                                    <Instagram size={20} className="text-orange-500 group-hover/link:text-white" />
                                    <span className="text-sm font-bold">Instagram</span>
                                </a>
                                <a href={`https://instagram.com/${(data?.contact?.creations || '').replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-orange-500 transition-all group/link border border-white/5 hover:border-orange-500">
                                    <Palette size={20} className="text-orange-500 group-hover/link:text-white" />
                                    <span className="text-sm font-bold">Creations</span>
                                </a>
                            </div>
                        </TiltCard>
                    </div>

                    {/* Contact Form */}
                    <motion.div variants={item} className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="bg-white/5 p-6 md:p-14 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Your Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <motion.input
                                            whileFocus={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(249, 115, 68, 0.5)" }}
                                            type="text"
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-0 transition-all placeholder:text-gray-600 font-medium"
                                            placeholder="Uday Kiran"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <motion.input
                                            whileFocus={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(249, 115, 68, 0.5)" }}
                                            type="email"
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-0 transition-all placeholder:text-gray-600 font-medium"
                                            placeholder="hello@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-10">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Project Details</label>
                                <div className="relative">
                                    <MessageCircle className="absolute left-4 top-5 text-gray-400" size={18} />
                                    <motion.textarea
                                        whileFocus={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(249, 115, 68, 0.5)" }}
                                        required
                                        rows="5"
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-0 transition-all resize-none placeholder:text-gray-600 font-medium"
                                        placeholder="Tell me about your project..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></motion.textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 text-lg group shadow-xl shadow-orange-500/20"
                            >
                                {status === 'loading' ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : status === 'success' ? (
                                    "Message Sent Successfully!"
                                ) : (
                                    <>
                                        Send Message <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
