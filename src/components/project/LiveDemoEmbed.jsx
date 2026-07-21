import React, { useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Play, Laptop, Smartphone, Tablet, X, Maximize2 } from 'lucide-react';

const LiveDemoEmbed = ({ url, title }) => {
    const [activeDevice, setActiveDevice] = useState('desktop');
    const [showEmbed, setShowEmbed] = useState(false);

    const devices = [
        { id: 'desktop', icon: Laptop, label: 'Desktop', width: 'w-full' },
        { id: 'tablet', icon: Tablet, label: 'Tablet', width: 'w-[768px]' },
        { id: 'mobile', icon: Smartphone, label: 'Mobile', width: 'w-[375px]' }
    ];

    if (!url) return null;

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <Play size={24} className="text-green-500" />
                    <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                        Live Experience
                    </h3>
                </div>

                {showEmbed && (
                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                        {devices.map((device) => {
                            const Icon = device.icon;
                            return (
                                <button
                                    key={device.id}
                                    onClick={() => setActiveDevice(device.id)}
                                    className={`p-2 rounded-lg transition-all ${activeDevice === device.id
                                        ? 'bg-orange-500 text-white'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                    title={device.label}
                                >
                                    <Icon size={18} />
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {!showEmbed ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 flex flex-col items-center justify-center border border-white/10 animate-pulse">
                        <Play size={64} className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-white font-black uppercase tracking-widest">Initialization Required</p>
                    </div>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowEmbed(true)}
                            className="px-10 py-5 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-orange-500/30"
                        >
                            Launch Live Demo
                        </motion.button>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center"
                >
                    <div className={`${devices.find(d => d.id === activeDevice).width} transition-all duration-500 bg-[#0A0A0A] rounded-2xl border border-white/10 overflow-hidden shadow-2xl`}>
                        {/* Device Header */}
                        <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="text-[10px] font-mono text-gray-500 truncate px-4">
                                {url}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => window.open(url, '_blank')}
                                    className="text-gray-500 hover:text-white transition-colors"
                                >
                                    <Maximize2 size={14} />
                                </button>
                                <button
                                    onClick={() => setShowEmbed(false)}
                                    className="text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Iframe */}
                        <div className="aspect-video bg-white">
                            <iframe
                                src={url}
                                title={title}
                                className="w-full h-full border-none"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            <p className="mt-6 text-sm text-gray-500 text-center italic">
                Note: Interactivity depends on the project's hosting permissions.
            </p>
        </div>
    );
};

export default LiveDemoEmbed;
