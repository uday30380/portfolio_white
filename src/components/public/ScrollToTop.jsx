import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Toggle visibility based on scroll position
    useEffect(() => {
        const toggleVisibility = () => {
            const visible = window.scrollY > 300;
            setIsVisible(prev => (prev !== visible ? visible : prev));
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // Scroll to top handler with Lenis support
    const scrollToTop = () => {
        if (window.__lenis) {
            window.__lenis.scrollTo(0, { duration: 1.2 });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-6 md:right-8 z-40 min-h-[44px] min-w-[44px] flex items-center justify-center p-3 bg-white border border-[#DDE7E5] text-[#102A28] hover:text-[#0F766E] hover:bg-[#E6F4F2] hover:border-[#7CC7BD] rounded-full shadow-sm hover:-translate-y-0.5 transition-all duration-200 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7CC7BD]"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
