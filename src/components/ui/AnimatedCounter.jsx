import React, { useEffect, useRef } from 'react';
import { useInView, animate } from 'framer-motion';
import { ease, defaultViewport } from '../../motion';

const AnimatedCounter = ({ value, duration = 0.9, suffix = "" }) => {
    const ref = useRef(null);
    const inView = useInView(ref, defaultViewport);
    const target = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0;

    useEffect(() => {
        if (!inView || !ref.current) return;

        const controls = animate(0, target, {
            duration,
            ease,
            onUpdate(v) {
                if (ref.current) {
                    ref.current.textContent = `${Math.round(v)}${suffix}`;
                }
            },
        });

        return () => controls.stop();
    }, [inView, target, duration, suffix]);

    return <span ref={ref}>0{suffix}</span>;
};

export default AnimatedCounter;
