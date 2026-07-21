import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Info, CheckCircle2, ChevronRight, Layers } from 'lucide-react';

const TechStackExplorer = ({ tech = [] }) => {
    const [selectedTech, setSelectedTech] = useState(null);

    // Mock tech details if not provided
    const techDetails = {
        'React': {
            description: 'A JavaScript library for building user interfaces.',
            features: ['Component-based', 'Declarative UI', 'Virtual DOM'],
            url: 'https://reactjs.org'
        },
        'Firebase': {
            description: 'Google’s mobile and web app development platform.',
            features: ['Real-time DB', 'Authentication', 'Cloud Hosting'],
            url: 'https://firebase.google.com'
        },
        'Tailwind': {
            description: 'A utility-first CSS framework for rapid UI development.',
            features: ['Responsive design', 'Customizable', 'Minimal CSS'],
            url: 'https://tailwindcss.com'
        },
        'Framer Motion': {
            description: 'An open source, production-ready motion library for React.',
            features: ['Physics-based', 'Gestures', 'Smooth transitions'],
            url: 'https://framer.com/motion'
        },
        'Node.js': {
            description: 'A JavaScript runtime built on Chrome\'s V8 engine.',
            features: ['Event-driven', 'Non-blocking I/O', 'Scalable'],
            url: 'https://nodejs.org'
        },
        'Java': {
            description: 'A high-level, class-based, object-oriented programming language.',
            features: ['Robust', 'Secure', 'Multi-threaded'],
            url: 'https://www.java.com'
        }
    };

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
                <Layers size={24} className="text-orange-500" />
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                    Tech Stack Explorer
                </h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Tech List */}
                <div className="flex flex-wrap gap-3 content-start">
                    {tech.map((name, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTech(name)}
                            className={`px-6 py-3 rounded-2xl border transition-all flex items-center gap-3 ${selectedTech === name
                                ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                                }`}
                        >
                            <span className="font-bold">{name}</span>
                            {selectedTech === name && <ChevronRight size={16} />}
                        </motion.button>
                    ))}
                </div>

                {/* Tech Details */}
                <div className="min-h-[250px] bg-black/40 rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
                    <AnimatePresence mode="wait">
                        {selectedTech && techDetails[selectedTech] ? (
                            <motion.div
                                key={selectedTech}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="relative z-10"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <h4 className="text-3xl font-black text-white">{selectedTech}</h4>
                                    <a
                                        href={techDetails[selectedTech].url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-orange-500 transition-colors"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    {techDetails[selectedTech].description}
                                </p>
                                <div className="space-y-2">
                                    <h5 className="text-xs font-black uppercase tracking-widest text-orange-500 mb-4">Key Features</h5>
                                    {techDetails[selectedTech].features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                            <CheckCircle2 size={14} className="text-green-500" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center text-gray-500"
                            >
                                <Info size={48} className="mb-4 opacity-20" />
                                <p className="font-bold italic">Select a technology to explore its features and documentation</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Background Decoration */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>
                </div>
            </div>
        </div>
    );
};

export default TechStackExplorer;
