import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle, Briefcase, DollarSign, Calendar } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

const HireMeModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        projectType: 'Website',
        budget: 'Intermediate',
        details: ''
    });

    // Listen for custom event to open
    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('openHireMeModal', handleOpen);
        return () => window.removeEventListener('openHireMeModal', handleOpen);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, 'messages'), {
                ...formData,
                createdAt: new Date().toISOString(),
                read: false
            });

            setStep(2); // Success state

            setTimeout(() => {
                setIsOpen(false);
                setStep(1);
                setFormData({ name: '', email: '', projectType: 'Website', budget: 'Intermediate', details: '' });
            }, 3000);
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/95 backdrop-blur-md"
                    ></motion.div>

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-[#111111] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-orange-500/10 to-transparent flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                                    <Briefcase className="text-orange-500" size={24} />
                                    Initiate Project
                                </h2>
                                <p className="text-xs font-bold text-gray-500 tracking-widest uppercase mt-1">Ready for the next evolution.</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-3 bg-white/5 rounded-full text-gray-500 hover:text-white hover:bg-orange-500 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {step === 1 ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500 outline-none transition-all font-bold placeholder:text-gray-700"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Email</label>
                                            <input
                                                required
                                                type="email"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500 outline-none transition-all font-bold placeholder:text-gray-700"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Project Type</label>
                                            <select
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500 outline-none transition-all font-bold appearance-none"
                                                value={formData.projectType}
                                                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                                            >
                                                <option className="bg-[#111111]">Website</option>
                                                <option className="bg-[#111111]">Web Application</option>
                                                <option className="bg-[#111111]">Mobile App</option>
                                                <option className="bg-[#111111]">UI/UX Design</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Budget</label>
                                            <select
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500 outline-none transition-all font-bold appearance-none"
                                                value={formData.budget}
                                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                            >
                                                <option className="bg-[#111111]">Small ($500 - $1k)</option>
                                                <option className="bg-[#111111]">Medium ($1k - $5k)</option>
                                                <option className="bg-[#111111]">Large ($5k+)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Project Details</label>
                                        <textarea
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500 outline-none transition-all h-32 resize-none font-bold placeholder:text-gray-700"
                                            placeholder="Tell me a bit about your goals..."
                                            value={formData.details}
                                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                    >
                                        <Send size={18} /> Launch Inquiry
                                    </button>
                                </form>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
                                    <div className="w-20 h-20 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mb-8">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Transmission Received</h3>
                                    <p className="text-gray-500 font-bold tracking-wide">Connecting with Uday Kiran. Expect a handshake within 24 hours.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default HireMeModal;

