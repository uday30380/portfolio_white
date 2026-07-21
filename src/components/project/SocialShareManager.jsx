import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Linkedin, Twitter, Facebook, Mail, Link2, QrCode,
    MessageCircle, Send, Share2, Check, X, Download,
    Hash, MessageSquare
} from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';
import LinkedInIntegration from './LinkedInIntegration';

const SocialShareManager = ({ project, url, onShareComplete }) => {
    const [showQR, setShowQR] = useState(false);
    const [showLinkedIn, setShowLinkedIn] = useState(false);
    const [copied, setCopied] = useState(false);
    const [shareCount, setShareCount] = useState(0);
    const [showShareMenu, setShowShareMenu] = useState(false);

    useEffect(() => {
        // Load share count from localStorage or Firebase
        const savedCount = parseInt(localStorage.getItem(`share-count-${project.id}`) || 0);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShareCount(prev => prev === savedCount ? prev : savedCount);
    }, [project.id]);

    const incrementShareCount = () => {
        const newCount = shareCount + 1;
        setShareCount(newCount);
        localStorage.setItem(`share-count-${project.id}`, newCount);
        if (onShareComplete) onShareComplete(newCount);
    };

    const shareToLinkedIn = () => {
        setShowLinkedIn(true);
        incrementShareCount();
    };

    const shareToTwitter = () => {
        const text = `Check out this amazing project: ${project.title}\n\n${project.description}\n\n`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
        incrementShareCount();
    };

    const shareToFacebook = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(facebookUrl, '_blank', 'width=550,height=420');
        incrementShareCount();
    };

    const shareToWhatsApp = () => {
        const text = `*${project.title}*\n\n${project.description}\n\nCheck it out: ${url}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
        incrementShareCount();
    };

    const shareToTelegram = () => {
        const text = `${project.title}\n\n${project.description}`;
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        window.open(telegramUrl, '_blank');
        incrementShareCount();
    };

    const shareToReddit = () => {
        const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(project.title)}`;
        window.open(redditUrl, '_blank', 'width=550,height=500');
        incrementShareCount();
    };

    const shareViaPinterest = () => {
        const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(project.image)}&description=${encodeURIComponent(project.description)}`;
        window.open(pinterestUrl, '_blank', 'width=750,height=550');
        incrementShareCount();
    };

    const shareViaEmail = () => {
        const subject = `Check out: ${project.title}`;
        const body = `I thought you might be interested in this project:\n\n${project.title}\n\n${project.description}\n\nView it here: ${url}\n\nTech Stack: ${project.techUsed?.join(', ') || 'N/A'}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        incrementShareCount();
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            incrementShareCount();
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareButtons = [
        {
            icon: Linkedin,
            label: 'LinkedIn',
            action: shareToLinkedIn,
            color: 'from-blue-600 to-blue-700',
            hoverColor: 'hover:shadow-blue-500/30'
        },
        {
            icon: Twitter,
            label: 'Twitter',
            action: shareToTwitter,
            color: 'from-sky-500 to-sky-600',
            hoverColor: 'hover:shadow-sky-500/30'
        },
        {
            icon: Facebook,
            label: 'Facebook',
            action: shareToFacebook,
            color: 'from-blue-500 to-blue-600',
            hoverColor: 'hover:shadow-blue-500/30'
        },
        {
            icon: MessageCircle,
            label: 'WhatsApp',
            action: shareToWhatsApp,
            color: 'from-green-500 to-green-600',
            hoverColor: 'hover:shadow-green-500/30'
        },
        {
            icon: Send,
            label: 'Telegram',
            action: shareToTelegram,
            color: 'from-blue-400 to-blue-500',
            hoverColor: 'hover:shadow-blue-400/30'
        },
        {
            icon: Hash,
            label: 'Reddit',
            action: shareToReddit,
            color: 'from-orange-600 to-orange-700',
            hoverColor: 'hover:shadow-orange-500/30'
        },
        {
            icon: MessageSquare,
            label: 'Pinterest',
            action: shareViaPinterest,
            color: 'from-red-600 to-red-700',
            hoverColor: 'hover:shadow-red-500/30'
        },
        {
            icon: Mail,
            label: 'Email',
            action: shareViaEmail,
            color: 'from-gray-600 to-gray-700',
            hoverColor: 'hover:shadow-gray-500/30'
        },
    ];

    return (
        <>
            <div className="relative">
                {/* Main Share Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold flex items-center gap-3 shadow-xl hover:shadow-purple-500/30 transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Share2 size={20} className="relative z-10" />
                    <span className="relative z-10">Share Project</span>
                    {shareCount > 0 && (
                        <span className="relative z-10 px-2 py-1 bg-white/20 rounded-full text-xs">
                            {shareCount}
                        </span>
                    )}
                </motion.button>

                {/* Share Menu Dropdown */}
                <AnimatePresence>
                    {showShareMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full mt-4 right-0 z-50 bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl min-w-[400px]"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowShareMenu(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>

                            <h3 className="text-xl font-black text-white mb-6">Share this project</h3>

                            {/* Social Share Buttons Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {shareButtons.map((button, index) => (
                                    <motion.button
                                        key={button.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={button.action}
                                        className={`group relative px-4 py-3 bg-gradient-to-r ${button.color} text-white rounded-xl font-bold flex items-center gap-3 shadow-lg ${button.hoverColor} transition-all overflow-hidden`}
                                    >
                                        <button.icon size={20} className="relative z-10" />
                                        <span className="relative z-10 text-sm">{button.label}</span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Utility Buttons */}
                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <button
                                    onClick={copyToClipboard}
                                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all border border-white/10"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={20} className="text-green-500" />
                                            <span className="text-green-500">Link Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Link2 size={20} />
                                            <span>Copy Link</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        setShowQR(true);
                                        setShowShareMenu(false);
                                    }}
                                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all border border-white/10"
                                >
                                    <QrCode size={20} />
                                    <span>Generate QR Code</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* QR Code Modal */}
            <AnimatePresence>
                {showQR && (
                    <QRCodeGenerator
                        url={url}
                        title={project.title}
                        onClose={() => setShowQR(false)}
                    />
                )}
            </AnimatePresence>

            {/* LinkedIn Integration Modal */}
            <AnimatePresence>
                {showLinkedIn && (
                    <LinkedInIntegration
                        project={project}
                        url={url}
                        onClose={() => setShowLinkedIn(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default SocialShareManager;
