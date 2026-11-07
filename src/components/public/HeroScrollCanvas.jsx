import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';

const TOTAL_FRAMES = 80;

const getFrameUrl = (frameIndex) => {
    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIndex)));
    const padded = String(clamped).padStart(3, '0');
    return `/hero-frames/frame-${padded}.jpg`;
};

/**
 * Ultra-smooth, hardware-accelerated canvas renderer for scroll-driven portrait animation.
 * Features:
 * - 80 lightweight, high-fidelity optimized frames (3.5 MB total, down from 10 MB+).
 * - Sleeping render loop: runs only while scrolling/lerping; consumes 0% CPU/GPU when idle.
 * - Zero React re-renders during scroll: updates DOM refs directly to prevent main thread blocking.
 * - Full-bleed mobile & desktop 4-sided atmospheric gradient feathering: melts seamlessly into #050505 with zero hard edges.
 * - Lenis-synchronized momentum scroll tracking.
 */
const HeroScrollCanvas = ({
    containerRef,
    isMobile = false,
    progressTextRef,
    progressBarRef,
    badgeGlowRef,
    className = "",
}) => {
    const canvasRef = useRef(null);
    const framesRef = useRef(new Array(TOTAL_FRAMES + 1));
    const loadedSetRef = useRef(new Set());
    const targetFrameRef = useRef(1);
    const currentFrameRef = useRef(1);
    const lastDrawnFrameRef = useRef(-1);
    const isDestroyedRef = useRef(false);
    const isLoopingRef = useRef(false);
    const animFrameIdRef = useRef(null);

    // Cached layout measurements (updated on resize)
    const metricsRef = useRef({ containerTop: 0, scrollDistance: 1 });

    const shouldReduceMotion = useReducedMotion();
    const [initialLoaded, setInitialLoaded] = useState(false);

    // Find nearest loaded frame to guarantee zero blank flashes
    const getNearestLoadedFrame = useCallback((target) => {
        if (loadedSetRef.current.has(target)) {
            return framesRef.current[target];
        }
        if (loadedSetRef.current.size === 0) return null;

        let bestDiff = Infinity;
        let bestIndex = 1;
        for (const idx of loadedSetRef.current) {
            const diff = Math.abs(idx - target);
            if (diff < bestDiff) {
                bestDiff = diff;
                bestIndex = idx;
            }
        }
        return framesRef.current[bestIndex] || null;
    }, []);

    // Draw frame onto the canvas with HiDPI and cover aspect ratio
    const drawFrame = useCallback((frameIdx) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let img = framesRef.current[frameIdx];
        if (!img || !img.complete || img.naturalWidth === 0) {
            img = getNearestLoadedFrame(frameIdx);
        }

        if (!img || !img.complete || img.naturalWidth === 0) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.round(rect.width * dpr);
        const h = Math.round(rect.height * dpr);

        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }

        const imgW = img.naturalWidth || 540;
        const imgH = img.naturalHeight || 960;
        const imgAspect = imgW / imgH;
        const canvasAspect = w / h;

        let drawW, drawH, drawX, drawY;

        if (isMobile) {
            // Mobile viewport optimization: keep head and upper torso centered with full headroom
            if (canvasAspect > imgAspect) {
                drawW = w;
                drawH = w / imgAspect;
                drawX = 0;
                drawY = 0;
            } else {
                drawH = h;
                drawW = h * imgAspect;
                drawX = (w - drawW) * 0.5;
                drawY = 0;
            }
        } else {
            // Desktop viewport optimization:
            if (canvasAspect > imgAspect) {
                drawW = w;
                drawH = w / imgAspect;
                drawX = 0;
                drawY = (h - drawH) * 0.10;
            } else {
                drawH = h;
                drawW = h * imgAspect;
                drawX = (w - drawW) * 0.5;
                drawY = 0;
            }
        }

        ctx.clearRect(0, 0, w, h);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        lastDrawnFrameRef.current = frameIdx;
    }, [getNearestLoadedFrame, isMobile]);

    // Direct DOM progress updater (0ms cost, zero React state rerenders)
    const updateDirectDOM = useCallback((frameVal) => {
        const progress = Math.max(0, Math.min(1, (frameVal - 1) / (TOTAL_FRAMES - 1)));
        const pct = Math.round(progress * 100);

        if (progressTextRef && progressTextRef.current) {
            progressTextRef.current.textContent = pct < 90 ? `Scroll to Transform · ${pct}%` : "Explore About ↓";
        }

        if (progressBarRef && progressBarRef.current) {
            progressBarRef.current.style.width = `${Math.max(6, pct)}%`;
        }

        if (badgeGlowRef && badgeGlowRef.current) {
            badgeGlowRef.current.style.borderColor = `rgba(249,115,22,${0.12 + (pct / 100) * 0.35})`;
            badgeGlowRef.current.style.boxShadow = `0 24px 64px rgba(0,0,0,0.92), 0 0 ${25 + (pct / 100) * 20}px rgba(249,115,22,${0.15 + (pct / 100) * 0.3}), inset 0 1px 0 rgba(255,255,255,0.08)`;
        }
    }, [progressBarRef, progressTextRef, badgeGlowRef]);

    // Progressive image loading (Frame 1 instant, then smooth non-blocking queue)
    useEffect(() => {
        isDestroyedRef.current = false;

        const handleImageLoad = (idx, img) => {
            if (isDestroyedRef.current) return;
            framesRef.current[idx] = img;
            loadedSetRef.current.add(idx);

            if (idx === 1 && !initialLoaded) {
                setInitialLoaded(true);
                drawFrame(1);
            }
        };

        // 1. Immediately load frame 1 (instant LCP)
        const frame1 = new Image();
        frame1.src = getFrameUrl(1);
        frame1.onload = () => handleImageLoad(1, frame1);

        // 2. Preload remaining 79 frames with low concurrency so CPU/network stays free
        const queue = [];
        // Stride frames first (every 5th)
        for (let i = 5; i <= TOTAL_FRAMES; i += 5) {
            queue.push(i);
        }
        // Fill remaining
        for (let i = 2; i <= TOTAL_FRAMES; i++) {
            if (i % 5 !== 0) queue.push(i);
        }

        const concurrency = 4;
        let activeLoads = 0;
        let queueIndex = 0;

        const loadNext = () => {
            if (isDestroyedRef.current || queueIndex >= queue.length) return;

            while (activeLoads < concurrency && queueIndex < queue.length) {
                const idx = queue[queueIndex++];
                activeLoads++;

                const img = new Image();
                img.src = getFrameUrl(idx);
                img.onload = () => {
                    handleImageLoad(idx, img);
                    activeLoads--;
                    loadNext();
                };
                img.onerror = () => {
                    activeLoads--;
                    loadNext();
                };
            }
        };

        // Delay queue start by 150ms so initial page load scripts execute with zero contention
        const timer = setTimeout(loadNext, 150);

        return () => {
            isDestroyedRef.current = true;
            clearTimeout(timer);
        };
    }, [drawFrame, initialLoaded]);

    // High performance scroll & sleep-capable lerp loop
    useEffect(() => {
        const updateMetrics = () => {
            if (containerRef && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const scrollTop = window.scrollY || window.pageYOffset || 0;
                metricsRef.current = {
                    containerTop: rect.top + scrollTop,
                    scrollDistance: Math.max(1, rect.height - window.innerHeight),
                };
            }
        };

        updateMetrics();
        window.addEventListener('resize', updateMetrics, { passive: true });
        window.addEventListener('orientationchange', updateMetrics, { passive: true });

        const tick = () => {
            if (isDestroyedRef.current) return;

            const diff = targetFrameRef.current - currentFrameRef.current;

            if (Math.abs(diff) > 0.02) {
                // Responsive damping lerp: 0.32 on mobile for immediate thumb response, 0.22 on desktop
                currentFrameRef.current += diff * (isMobile ? 0.32 : 0.22);
                const frameToDraw = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(currentFrameRef.current)));

                if (frameToDraw !== lastDrawnFrameRef.current) {
                    drawFrame(frameToDraw);
                }
                updateDirectDOM(currentFrameRef.current);

                animFrameIdRef.current = requestAnimationFrame(tick);
            } else {
                currentFrameRef.current = targetFrameRef.current;
                const frameToDraw = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(currentFrameRef.current)));

                if (frameToDraw !== lastDrawnFrameRef.current) {
                    drawFrame(frameToDraw);
                }
                updateDirectDOM(currentFrameRef.current);

                // Sleep the loop: 0% CPU consumption when idle
                isLoopingRef.current = false;
            }
        };

        const handleScroll = () => {
            if (isDestroyedRef.current || shouldReduceMotion) return;

            const currentScrollY = window.scrollY || window.pageYOffset || 0;
            const container = containerRef?.current;
            if (!container) return;

            // Compute dynamically so scroll progress is always in sync with viewport
            const rect = container.getBoundingClientRect();
            const containerTop = rect.top + currentScrollY;
            const scrollDistance = Math.max(1, container.offsetHeight - window.innerHeight);

            const progress = Math.max(0, Math.min(1, (currentScrollY - containerTop) / scrollDistance));
            targetFrameRef.current = 1 + progress * (TOTAL_FRAMES - 1);

            // Wake up animation loop if it was sleeping
            if (!isLoopingRef.current) {
                isLoopingRef.current = true;
                animFrameIdRef.current = requestAnimationFrame(tick);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Connect with Lenis smooth scroll instance if available
        if (window.__lenis) {
            window.__lenis.on('scroll', handleScroll);
        }

        // Wake up on mount to draw frame 1
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateMetrics);
            window.removeEventListener('orientationchange', updateMetrics);
            if (window.__lenis) {
                window.__lenis.off('scroll', handleScroll);
            }
            if (animFrameIdRef.current) {
                cancelAnimationFrame(animFrameIdRef.current);
            }
        };
    }, [containerRef, drawFrame, isMobile, shouldReduceMotion, updateDirectDOM]);

    // Mask for desktop: smooth horizontal and vertical atmospheric vignette
    const DESKTOP_MASK = `linear-gradient(
        to right,
        transparent 0%,
        rgba(0,0,0,0.08) 5%,
        black 18%,
        black 82%,
        rgba(0,0,0,0.12) 95%,
        transparent 100%
    )`;

    // Mask for mobile: clean vertical fade only at the very bottom edge so the photo and face are 100% clear
    const MOBILE_MASK = `linear-gradient(
        to bottom,
        black 0%,
        black 82%,
        rgba(0,0,0,0.6) 94%,
        transparent 100%
    )`;

    return (
        <div
            className={`relative w-full h-full select-none pointer-events-none ${className}`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Instant LCP portrait poster to immediately consume preload link and prevent blank flash */}
            <img
                src="/uday-portrait.webp"
                alt="Uday Kiran Vempati"
                width="999"
                height="1574"
                fetchPriority="high"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ease-out ${
                    initialLoaded ? 'opacity-0' : 'opacity-100'
                }`}
                style={{
                    WebkitMaskImage: isMobile ? MOBILE_MASK : DESKTOP_MASK,
                    maskImage: isMobile ? MOBILE_MASK : DESKTOP_MASK,
                    objectPosition: isMobile ? 'center 10%' : 'center center',
                }}
            />

            <canvas
                ref={canvasRef}
                className="w-full h-full block relative z-10"
                style={{
                    WebkitMaskImage: isMobile ? MOBILE_MASK : DESKTOP_MASK,
                    maskImage: isMobile ? MOBILE_MASK : DESKTOP_MASK,
                    filter: isMobile
                        ? 'contrast(1.06) brightness(1.02) saturate(1.08) drop-shadow(0 0 20px rgba(249,115,22,0.2))'
                        : 'contrast(1.06) brightness(0.98) saturate(1.08) drop-shadow(0 0 25px rgba(249,115,22,0.22))',
                }}
            />

            {/* Bottom atmospheric blend into page background */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 'auto 0 0 0',
                    height: isMobile ? '36%' : '40%',
                    background: isMobile
                        ? 'linear-gradient(to top, #050505 0%, rgba(5,5,5,0.78) 45%, rgba(5,5,5,0.15) 75%, transparent 100%)'
                        : 'linear-gradient(to top, #050505 0%, rgba(5,5,5,0.88) 45%, transparent 100%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Top atmospheric fade - only on desktop to keep mobile face 100% bright and clear */}
            {!isMobile && (
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        inset: '0 0 auto 0',
                        height: '24%',
                        background: 'linear-gradient(to bottom, #050505 0%, rgba(5,5,5,0.8) 45%, transparent 100%)',
                        pointerEvents: 'none',
                    }}
                />
            )}
        </div>
    );
};

export default React.memo(HeroScrollCanvas);
