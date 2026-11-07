import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Ultra-smooth momentum scroll controller using Lenis tuned and synced.
 * Disables itself automatically if the user has requested reduced motion.
 */
const SmoothScroll = () => {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const lenis = new Lenis({
            lerp: 0.09,
            smoothWheel: true,
            wheelMultiplier: 0.9,
        });

        window.__lenis = lenis;

        let reqId;
        function raf(t) {
            lenis.raf(t);
            reqId = requestAnimationFrame(raf);
        }
        reqId = requestAnimationFrame(raf);

        return () => {
            if (reqId) cancelAnimationFrame(reqId);
            lenis.destroy();
            delete window.__lenis;
        };
    }, []);

    return null;
};

export default SmoothScroll;
