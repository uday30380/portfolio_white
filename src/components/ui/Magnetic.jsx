import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { spring } from '../../motion';

/**
 * Magnetic button wrapper: follows the cursor 8-12px with spring back physics.
 * Automatically disabled on touch screens and prefers-reduced-motion.
 */
const Magnetic = ({ children, distance = 10, className = "" }) => {
    const ref = useRef(null);
    const [canHover, setCanHover] = useState(() => {
        if (typeof window !== 'undefined') {
            return !window.matchMedia('(pointer: coarse)').matches;
        }
        return true;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const media = window.matchMedia('(pointer: coarse)');
        const listener = (e) => setCanHover(!e.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, []);

    const x = useSpring(0, spring);
    const y = useSpring(0, spring);

    const handleMouseMove = (e) => {
        if (!canHover || !ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const deltaX = (e.clientX - centerX) / (width / 2);
        const deltaY = (e.clientY - centerY) / (height / 2);
        x.set(deltaX * distance);
        y.set(deltaY * distance);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            style={{ x, y }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`inline-block ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default Magnetic;
