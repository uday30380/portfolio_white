import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({
    children,
    className = "",
    animation = "fade-up", // fade-up, fade-in, zoom-in, slide-right
    duration = 1000,
    delay = 0,
    offset = 50
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.05,
                rootMargin: `0px 0px -${offset}px 0px`
            }
        );

        const currentRef = ref.current;

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [offset]);

    const getAnimationClass = () => {
        if (!isVisible) {
            switch (animation) {
                case 'fade-up': return 'opacity-0 translate-y-20';
                case 'fade-in': return 'opacity-0';
                case 'zoom-in': return 'opacity-0 scale-95';
                case 'slide-right': return 'opacity-0 -translate-x-20';
                default: return 'opacity-0 translate-y-20';
            }
        }

        switch (animation) {
            case 'fade-up': return 'opacity-100 translate-y-0';
            case 'fade-in': return 'opacity-100';
            case 'zoom-in': return 'opacity-100 scale-100';
            case 'slide-right': return 'opacity-100 translate-x-0';
            default: return 'opacity-100 translate-y-0';
        }
    };

    return (
        <div
            ref={ref}
            className={`transition-all ease-out transform ${getAnimationClass()} ${className}`}
            style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
