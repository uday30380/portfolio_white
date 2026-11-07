import React from 'react';
import { motion } from 'framer-motion';
import { ease, defaultViewport } from '../../motion';

import TextScramble from './TextScramble';

const SectionHeading = ({
    badge,
    title,
    subtitle,
    align = "center",
    className = ""
}) => {
    const isCenter = align === "center";

    return (
        <div className={`mb-16 md:mb-20 ${isCenter ? 'text-center' : 'text-left'} ${className}`}>
            {badge && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={defaultViewport}
                    transition={{ duration: 0.5, ease }}
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-xs font-mono font-bold tracking-widest uppercase mb-4`}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    {badge}
                </motion.div>
            )}

            {title && (
                <div className="overflow-hidden">
                    <motion.h2
                        initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                        whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                        viewport={defaultViewport}
                        transition={{ duration: 0.8, ease }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase"
                    >
                        <TextScramble text={title} scrambleDuration={550} />
                    </motion.h2>
                </div>
            )}

            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={defaultViewport}
                    transition={{ duration: 0.6, ease, delay: 0.15 }}
                    className={`mt-4 text-gray-400 text-sm md:text-base max-w-[65ch] ${isCenter ? 'mx-auto' : ''}`}
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
};

export default SectionHeading;
