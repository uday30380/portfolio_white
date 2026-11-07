import React, { useEffect, useRef } from 'react';

const ScrollProgress = () => {
    const barRef = useRef(null);

    useEffect(() => {
        let ticking = false;

        const updateProgress = () => {
            const el = document.documentElement;
            const totalScroll = window.scrollY || el.scrollTop || 0;
            const windowHeight = el.scrollHeight - el.clientHeight;
            const progress = windowHeight > 0 ? Math.min(Math.max(totalScroll / windowHeight, 0), 1) : 0;

            if (barRef.current) {
                barRef.current.style.transform = `scaleX(${progress})`;
            }
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateProgress();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent pointer-events-none" aria-hidden="true">
            <div
                ref={barRef}
                className="h-full w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 shadow-[0_0_10px_rgba(255,125,68,0.5)] origin-left will-change-transform"
                style={{ transform: 'scaleX(0)' }}
            />
        </div>
    );
};

export default ScrollProgress;
