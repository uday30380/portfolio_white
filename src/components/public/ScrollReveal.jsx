import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({
    children,
    className = "",
    delay = 0
}) => {
    const [isVisible, setIsVisible] = useState(() => {
        if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return true;
        }
        return false;
    });
    const ref = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // If reduced motion is requested, observer is not needed
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.05,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        const el = ref.current;
        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
        };
    }, []);

    return (
        <div
            ref={ref}
            style={{
                transitionDuration: '200ms',
                transitionDelay: `${delay}ms`
            }}
            className={`transition-opacity ease-out ${
                isVisible ? 'opacity-100' : 'opacity-0'
            } ${className}`}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
