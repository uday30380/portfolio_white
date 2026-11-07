import React, { useState, useEffect } from 'react';
import { Linkedin, Github, Instagram, Youtube, ChevronDown } from 'lucide-react';

const Hero = () => {
    const [showScrollCue, setShowScrollCue] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 25) {
                setShowScrollCue(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const socialLinks = [
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/uday-kiran-vempati-9a9972288/',
            icon: Linkedin
        },
        {
            name: 'GitHub',
            url: 'https://github.com/uday30380',
            icon: Github
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/uday_kiran_30_/',
            icon: Instagram
        },
        {
            name: 'YouTube',
            url: 'https://youtube.com',
            icon: Youtube
        }
    ];

    return (
        <section
            id="hero"
            className="bg-[#F7FAFA] w-full flex flex-col justify-center relative pt-12 pb-16 lg:py-0 lg:h-[min(calc(100vh-64px),760px)] lg:min-h-[640px] animate-fade-in"
        >
            <div className="max-w-[1100px] w-full mx-auto px-6">
                <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-8 lg:gap-[64px]">
                    {/* Left: Text column (max 560px, vertically centered) */}
                    <div className="w-full lg:max-w-[560px] flex flex-col items-start justify-center">
                        {/* Available for work badge */}
                        <div className="inline-flex items-center gap-2 mb-[12px]">
                            <span className="w-2 h-2 rounded-full bg-[#15803D]" aria-hidden="true" />
                            <span className="text-[14px] text-[#4B5F5C]">Available for work</span>
                        </div>

                        {/* Name: 60px semibold on desktop, safely scaled on mobile, letter-spacing -0.02em, #102A28 */}
                        <h1 className="text-[32px] sm:text-[46px] lg:text-[60px] font-semibold text-[#102A28] leading-[1.1] tracking-[-0.02em] mb-[12px] break-words">
                            Uday Kiran Vempati
                        </h1>

                        {/* Role line: 20px regular weight, #0F766E */}
                        <p className="text-[18px] sm:text-[20px] font-normal text-[#0F766E] leading-[1.3] mb-[16px]">
                            Full-stack developer and designer
                        </p>

                        {/* Intro: 17px, #4B5F5C, max 480px wide */}
                        <p className="text-[17px] text-[#4B5F5C] leading-[1.6] max-w-[480px] mb-[32px]">
                            B.Tech student at KL University building web apps with React and Firebase, and designing brands and visuals in Canva
                        </p>

                        {/* Buttons: View my work (primary) and Contact me (secondary) */}
                        <div className="flex flex-wrap items-center gap-3 mb-[24px]">
                            <a
                                href="#work"
                                className="btn-primary"
                            >
                                View my work
                            </a>

                            <a
                                href="#contact"
                                className="btn-secondary"
                            >
                                Contact me
                            </a>
                        </div>

                        {/* Social icons: 20px icons in #4B5F5C inside 40px round hit areas, 8px gap */}
                        <div className="flex items-center gap-[8px]">
                            {socialLinks.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.name} className="relative group">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={item.name}
                                            className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-[#4B5F5C] hover:text-[#0F766E] hover:bg-[#E6F4F2] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7CC7BD]"
                                        >
                                            <Icon size={20} />
                                        </a>

                                        {/* Tooltip */}
                                        <span
                                            role="tooltip"
                                            className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[11px] font-medium text-white bg-[#102A28] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-sm z-20"
                                        >
                                            {item.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Photo panel (max 520px wide, #E6F4F2 background, height responsive, photo aligned to bottom) */}
                    <div className="w-full lg:max-w-[520px] flex justify-center lg:justify-end items-center">
                        <div className="w-full max-w-[520px] h-[360px] sm:h-[480px] lg:h-[620px] bg-[#E6F4F2] rounded-[20px] overflow-hidden flex items-end justify-center select-none">
                            <img
                                src="/uday-blazer.png"
                                alt="Uday Kiran Vempati"
                                className="w-full h-full object-contain object-bottom pointer-events-none"
                                loading="eager"
                                decoding="async"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle scroll cue under hero: small down-arrow in #8A9B98 that fades out after first scroll */}
            <div
                className={`hidden lg:flex absolute bottom-3 left-1/2 -translate-x-1/2 flex-col items-center gap-1 transition-opacity duration-300 pointer-events-none ${
                    showScrollCue ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden="true"
            >
                <ChevronDown size={18} className="text-[#8A9B98] animate-bounce" />
            </div>
        </section>
    );
};

export default Hero;