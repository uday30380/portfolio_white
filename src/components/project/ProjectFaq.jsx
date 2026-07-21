import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { HelpCircle, Plus, Minus, MessageSquare } from 'lucide-react';

const ProjectFaq = ({ faqs = [] }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    // Mock FAQs if none provided
    const displayFaqs = faqs.length > 0 ? faqs : [
        { q: 'How long did it take to build?', a: 'The core development phase took approximately 4 weeks, with an additional 2 weeks for UI refinement and testing.' },
        { q: 'What was the most challenging part?', a: 'Implementing real-time data sync and ensuring high performance across all devices were the biggest challenges.' },
        { q: 'Is the source code open-source?', a: 'Yes, the source code is available on GitHub under the MIT License for educational purposes.' },
        { q: 'What are the future plans?', a: 'We plan to add more advanced analytics and social features in the next release.' }
    ];

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
                <HelpCircle size={24} className="text-orange-500" />
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                    Project FAQ
                </h3>
            </div>

            <div className="space-y-4">
                {displayFaqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`rounded-2xl border transition-all duration-300 ${activeIndex === index
                            ? 'bg-white/10 border-orange-500/50'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                            }`}
                    >
                        <button
                            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                            className="w-full px-6 py-5 flex items-center justify-between text-left"
                        >
                            <span className={`font-bold transition-colors ${activeIndex === index ? 'text-orange-500' : 'text-white'}`}>
                                {faq.q}
                            </span>
                            <div className={`p-1 rounded-lg transition-colors ${activeIndex === index ? 'bg-orange-500 text-white' : 'text-gray-500'}`}>
                                {activeIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                            </div>
                        </button>

                        <AnimatePresence>
                            {activeIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-6 text-gray-400 leading-relaxed text-sm">
                                        <div className="flex gap-3">
                                            <MessageSquare size={16} className="text-orange-500/50 mt-1 shrink-0" />
                                            <p>{faq.a}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectFaq;
