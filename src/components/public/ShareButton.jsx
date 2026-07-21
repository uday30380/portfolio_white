import React, { useState } from 'react';
import { Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

const ShareButton = ({ url, title, description }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;
    const shareText = description || '';

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        }
    };

    const shareLinks = [
        {
            name: 'Twitter',
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
            color: 'hover:bg-blue-500'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            color: 'hover:bg-blue-600'
        },
        {
            name: 'Facebook',
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            color: 'hover:bg-blue-700'
        }
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 font-bold group"
                aria-label="Share project"
            >
                <Share2 size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Share</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-56 bg-[#0F0F0F] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                        >
                            <div className="p-2">
                                {/* Native Share (Mobile) */}
                                {navigator.share && (
                                    <button
                                        onClick={handleNativeShare}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all text-left"
                                    >
                                        <Share2 size={18} />
                                        <span className="font-medium">Share via...</span>
                                    </button>
                                )}

                                {/* Social Media Links */}
                                {shareLinks.map((platform) => (
                                    <a
                                        key={platform.name}
                                        href={platform.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-white ${platform.color} rounded-xl transition-all`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <platform.icon size={18} />
                                        <span className="font-medium">{platform.name}</span>
                                    </a>
                                ))}

                                {/* Copy Link */}
                                <button
                                    onClick={handleCopyLink}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-orange-500/20 rounded-xl transition-all text-left"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={18} className="text-green-500" />
                                            <span className="font-medium text-green-500">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <LinkIcon size={18} />
                                            <span className="font-medium">Copy Link</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShareButton;
