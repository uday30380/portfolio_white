import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Instagram, Palette, Heart, ArrowUp, Mail, Shield, Scale, FileText, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Footer = () => {
    const { data } = useData();
    const [email, setEmail] = useState('');
    const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
    const [legalType, setLegalType] = useState('privacy');

    const handleSubscribe = (e) => {
        e.preventDefault();
        alert('Newsletter subscription activated.');
        setEmail('');
    };

    const openLegal = (type) => {
        setLegalType(type);
        setIsLegalModalOpen(true);
    };

    return (
        <footer className="bg-[#050505] text-white pt-20 pb-10 relative overflow-hidden font-sans border-t border-white/5">
            {/* Background: Tech Grid Overlay */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-0"></div>

            {/* Massive Call to Action Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="border border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-3xl p-10 md:p-20 text-center relative overflow-hidden group"
                >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors duration-700"></div>

                    <a href="mailto:udaykiranvempati123@gmail.com" className="block relative z-10">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-bold tracking-[0.2em] text-orange-400 uppercase mb-6 group-hover:border-orange-500/30 transition-colors">
                            Available for Work
                        </span>
                        <h2 className="text-4xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none mb-6 group-hover:text-orange-500 transition-colors duration-500">
                            LET'S INNOVATE
                        </h2>
                        <p className="text-gray-400 text-sm md:text-lg max-w-xl mx-auto font-medium">
                            Have a vision? Let's translate it into a digital reality.
                        </p>
                    </a>
                </motion.div>
            </div>

            {/* Main Footer Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20 border-b border-white/5 pb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                            <span className="font-black text-xl">V</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">UDAY KIRAN VEMPATI</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {data?.footer?.tagline || "RPA Club Designer & Provision Wing Lead crafting next-gen digital experiences."}
                            </p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6 opacity-50">Navigation</h4>
                        <ul className="space-y-4">
                            {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href={`#${item.toLowerCase()} `} className="text-gray-400 hover:text-orange-500 text-sm font-medium transition-colors flex items-center gap-2 group">
                                        <span className="w-0 group-hover:w-2 h-[1px] bg-orange-500 transition-all duration-300"></span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Dynamic Services/Categories */}
                    <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6 opacity-50">Connect</h4>
                        <ul className="space-y-4">
                            {(data?.footer?.links || []).map((link, i) => (
                                <li key={i}>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 text-sm font-medium transition-colors flex items-center gap-2 group">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6 opacity-50">Stay Updated</h4>
                        <form onSubmit={handleSubscribe} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-orange-500 rounded-md text-white hover:bg-orange-600 transition-colors">
                                    <ArrowUp size={14} className="rotate-45" />
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-600">
                                Join the network. No spam, just innovation.
                            </p>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">
                        {data?.footer?.copyright || `© ${new Date().getFullYear()} Uday Kiran Vempati.All rights reserved.`}
                    </p>

                    {/* Social Icons */}
                    <div className="flex items-center gap-4">
                        <a href={data?.contact?.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300">
                            <Linkedin size={14} />
                        </a>
                        <a href={data?.contact?.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300">
                            <Github size={14} />
                        </a>
                        <a href={`https://instagram.com/${(data?.contact?.instagram || '').replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300">
                            <Instagram size={14} />
                        </a>
                    </div>

                    {/* Legal Links */}
                    <div className="flex items-center gap-6">
                        <button onClick={() => openLegal('privacy')} className="text-[10px] text-gray-600 hover:text-orange-500 uppercase font-bold tracking-wider transition-colors">Privacy</button>
                        <button onClick={() => openLegal('terms')} className="text-[10px] text-gray-600 hover:text-orange-500 uppercase font-bold tracking-wider transition-colors">Terms</button>
                    </div>
                </div>
            </div>

            {/* Legal Modal */}
            {
                isLegalModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsLegalModalOpen(false)}></div>
                        <div className="relative bg-[#0F0F0F] p-8 md:p-12 rounded-3xl border border-white/10 max-w-2xl w-full shadow-2xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-500">
                                    {legalType === 'privacy' ? <Shield size={20} /> : legalType === 'terms' ? <Scale size={20} /> : <FileText size={20} />}
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                                    {legalType === 'privacy' ? 'Privacy Protocol' : legalType === 'terms' ? 'Terms of Interface' : 'Legal Info'}
                                </h3>
                            </div>
                            <div className="text-gray-400 text-sm leading-relaxed max-h-[40vh] overflow-y-auto custom-scrollbar pr-4 mb-8 font-mono">
                                <p className="mb-4">System Status: {legalType.toUpperCase()}_CHECK_INITIATED</p>
                                <p className="mb-4">This document outlines the operational procedures and data handshakes for the UDAY KIRAN VEMPATI environment. All data processed within this terminal is encrypted and utilized solely for performance optimization.</p>
                                <div className="p-4 bg-white/5 rounded-lg border border-white/5 text-xs text-gray-500 mt-6">
                                    TIMESTAMP: {new Date().toLocaleDateString()} // SESSION_ID: {'SECURE-7X9'}_SESSION_ID
                                </div>
                            </div>
                            <button
                                onClick={() => setIsLegalModalOpen(false)}
                                className="w-full py-4 bg-white text-black hover:bg-orange-500 hover:text-white rounded-xl font-bold uppercase tracking-wider transition-all duration-300"
                            >
                                Close Terminal
                            </button>
                        </div>
                    </div>
                )
            }
        </footer>
    );
};

export default Footer;
