import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Cursor = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    // Motion values for smooth mouse tracking
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Spring physics for the trailing circle (smooth lag)
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Auto-detect hoverable elements
            const target = e.target;
            const isClickable =
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button');

            setIsHovered(!!isClickable);
        };

        const handleMouseDown = () => setIsClicked(true);
        const handleMouseUp = () => setIsClicked(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [mouseX, mouseY]);

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
            {/* Main Dot - Instant Follow */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(255,125,68,0.8)]"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />

            {/* Trailing Ring - Spring Physics */}
            <motion.div
                className="fixed top-0 left-0 border border-orange-500/30 rounded-full"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    width: isHovered ? 80 : 20,
                    height: isHovered ? 80 : 20,
                    borderColor: isHovered ? "rgba(255, 125, 68, 0.5)" : "rgba(255, 125, 68, 0.2)",
                    backgroundColor: isHovered ? "rgba(255, 125, 68, 0.05)" : "transparent",
                }}
                animate={{
                    scale: isClicked ? 0.9 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                }}
            >
                {/* Micro-Reticle Detail when hovered */}
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="w-[1px] h-2 bg-orange-500/40 absolute top-0"></div>
                        <div className="w-[1px] h-2 bg-orange-500/40 absolute bottom-0"></div>
                        <div className="h-[1px] w-2 bg-orange-500/40 absolute left-0"></div>
                        <div className="h-[1px] w-2 bg-orange-500/40 absolute right-0"></div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default Cursor;
