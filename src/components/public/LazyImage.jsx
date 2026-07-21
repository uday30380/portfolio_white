import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const LazyImage = ({
    src,
    alt,
    className = '',
    placeholderSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23111" width="400" height="300"/%3E%3C/svg%3E',
    ...props
}) => {
    const [imageSrc, setImageSrc] = useState(placeholderSrc);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const currentRef = imgRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading 50px before image enters viewport
            }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (isInView && src) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                setImageSrc(src);
                setImageLoaded(true);
            };
        }
    }, [isInView, src]);

    return (
        <div ref={imgRef} className="relative overflow-hidden">
            <motion.img
                src={imageSrc}
                alt={alt}
                className={`${className} ${!imageLoaded ? 'blur-sm scale-105' : ''} transition-all duration-700`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                {...props}
            />
            {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 animate-pulse" />
            )}
        </div>
    );
};

export default LazyImage;
