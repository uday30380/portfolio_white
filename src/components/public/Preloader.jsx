import React, { useState, useEffect, useRef } from 'react';

// In-memory session tracker:
// - Fresh on every browser load / refresh (so the user ALWAYS sees the loader!)
// - Preserved across internal React Router SPA navigation (so internal links don't get interrupted)
let hasLoadedInSession = false;

const Preloader = ({ onLoaded }) => {
    const [shouldShow] = useState(() => {
        if (typeof window === 'undefined') return false;

        // Clean up any stale sessionStorage block from previous versions
        try {
            sessionStorage.removeItem('uk_loader_shown');
        } catch {
            // Ignore storage access errors
        }

        // If already displayed in this browser session instance, skip on internal route navigation
        if (hasLoadedInSession) {
            return false;
        }

        return true;
    });

    const [monogramReady, setMonogramReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const assetsReadyRef = useRef(false);
    const onLoadedCalledRef = useRef(false);

    useEffect(() => {
        if (!shouldShow) return;

        // Lock scroll while loader is visible
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // Preload hero photo
        const heroImg = new Image();
        heroImg.src = '/uday-blazer.png';
        let imgLoaded = false;
        let fontsLoaded = false;

        const checkAssetsReady = () => {
            if (imgLoaded && fontsLoaded) {
                assetsReadyRef.current = true;
            }
        };

        if (heroImg.decode) {
            heroImg.decode()
                .then(() => {
                    imgLoaded = true;
                    checkAssetsReady();
                })
                .catch(() => {
                    imgLoaded = true;
                    checkAssetsReady();
                });
        } else {
            heroImg.onload = () => {
                imgLoaded = true;
                checkAssetsReady();
            };
            heroImg.onerror = () => {
                imgLoaded = true;
                checkAssetsReady();
            };
        }

        // Preload Inter font
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready
                .then(() => {
                    fontsLoaded = true;
                    checkAssetsReady();
                })
                .catch(() => {
                    fontsLoaded = true;
                    checkAssetsReady();
                });

            if (document.fonts.load) {
                document.fonts.load('600 56px Inter');
                document.fonts.load('600 64px Inter');
                document.fonts.load('600 52px Inter');
                document.fonts.load('500 20px Inter');
                document.fonts.load('400 16px Inter');
            }
        } else {
            fontsLoaded = true;
            checkAssetsReady();
        }

        // 1. 0 to 0.3s: Monogram fades in and moves up 8px
        const monogramTimer = setTimeout(() => {
            setMonogramReady(true);
        }, 40);

        // Animation timing
        const startTime = Date.now();
        let animationFrameId;
        let completeTriggered = false;

        const triggerCompletion = () => {
            if (completeTriggered) return;
            completeTriggered = true;
            hasLoadedInSession = true;
            setProgress(100);

            // 0.9s to 1.2s: Whole loader fades out while the hero fades in underneath (300ms)
            setTimeout(() => {
                setIsFadingOut(true);
                // Unlock scroll as fade-out starts so page is immediately interactive
                document.body.style.overflow = originalOverflow || '';

                if (onLoaded && !onLoadedCalledRef.current) {
                    onLoadedCalledRef.current = true;
                    onLoaded();
                }

                // Unmount component from DOM after 300ms fade-out finishes
                setTimeout(() => {
                    setIsCompleted(true);
                }, 300);
            }, 60);
        };

        const tick = () => {
            const elapsed = Date.now() - startTime;

            if (elapsed < 200) {
                // 0 to 0.2s: progress line stays at 0
                setProgress(0);
                animationFrameId = requestAnimationFrame(tick);
            } else if (elapsed <= 900) {
                // 0.2 to 0.9s: progress line fills left to right with ease-out curve
                const u = (elapsed - 200) / 700; // 0 to 1
                const easeOut = 1 - Math.pow(1 - u, 2);

                if (assetsReadyRef.current) {
                    const currentPercent = Math.min(100, Math.round(easeOut * 100));
                    setProgress(currentPercent);
                    if (currentPercent >= 100 || elapsed >= 900) {
                        triggerCompletion();
                        return;
                    }
                } else {
                    // Hold line at up to 90% until assets are loaded
                    const currentPercent = Math.min(90, Math.round(easeOut * 90));
                    setProgress(currentPercent);
                }
                animationFrameId = requestAnimationFrame(tick);
            } else {
                // Elapsed > 900ms:
                if (assetsReadyRef.current) {
                    triggerCompletion();
                } else {
                    // Hold at 90% until loaded
                    setProgress(90);
                    animationFrameId = requestAnimationFrame(tick);
                }
            }
        };

        animationFrameId = requestAnimationFrame(tick);

        // Fallback interval: in case requestAnimationFrame is throttled in inactive tab
        const fallbackInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= 950 && assetsReadyRef.current) {
                triggerCompletion();
            }
        }, 100);

        // Safety hard limit: Never block the page for more than 2.5 seconds
        const maxBlockTimer = setTimeout(() => {
            assetsReadyRef.current = true;
            triggerCompletion();
        }, 2200);

        return () => {
            clearTimeout(monogramTimer);
            clearTimeout(maxBlockTimer);
            clearInterval(fallbackInterval);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            document.body.style.overflow = originalOverflow || '';
        };
    }, [shouldShow, onLoaded]);

    if (!shouldShow || isCompleted) {
        return null;
    }

    return (
        <aside
            aria-label="Loading site"
            aria-live="polite"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                backgroundColor: '#F7FAFA',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
                opacity: isFadingOut ? 0 : 1,
                pointerEvents: isFadingOut ? 'none' : 'auto',
                transition: 'opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            {/* Monogram UK in Inter, enlarged to 68px-92px semibold, #102A28, with #0F766E dot (UK.) */}
            <div
                style={{
                    fontSize: 'clamp(68px, 12vw, 92px)',
                    fontWeight: 700,
                    color: '#102A28',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'baseline',
                    opacity: monogramReady ? 1 : 0,
                    transform: monogramReady ? 'translateY(0px)' : 'translateY(8px)',
                    transition: 'opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                <span>UK</span>
                <span style={{ color: '#0F766E' }}>.</span>
            </div>

            {/* Thin progress line: 200px wide, 3.5px tall, track #DDE7E5, fill #0F766E, fully rounded ends */}
            <div
                style={{
                    width: '200px',
                    height: '3.5px',
                    backgroundColor: '#DDE7E5',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    marginTop: '28px',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        backgroundColor: '#0F766E',
                        borderRadius: '9999px',
                        width: `${progress}%`,
                        transition: 'width 80ms ease-out',
                    }}
                />
            </div>
        </aside>
    );
};

export default Preloader;
