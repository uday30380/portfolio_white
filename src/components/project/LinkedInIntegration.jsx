import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Linkedin, Image, Send, Check, AlertCircle } from 'lucide-react';

const LinkedInIntegration = ({ project, url, onClose }) => {
    const [postText, setPostText] = useState(
        `🚀 Excited to share my latest project: ${project.title}\n\n${project.description}\n\n💻 Tech Stack: ${project.techUsed?.join(', ') || 'N/A'}\n\n🔗 Check it out:`
    );
    const [includeImage, setIncludeImage] = useState(true);
    const [posting, setPosting] = useState(false);
    const [posted, setPosted] = useState(false);
    const [error, setError] = useState(null);

    // Simple LinkedIn share (opens LinkedIn share dialog)
    const shareToLinkedIn = () => {
        setPosting(true);

        // LinkedIn share URL
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

        // Open LinkedIn share dialog
        const shareWindow = window.open(
            linkedInUrl,
            'linkedin-share',
            'width=550,height=500'
        );

        // Check if window opened successfully
        if (shareWindow) {
            setPosted(true);
            setTimeout(() => {
                setPosting(false);
                setTimeout(() => onClose(), 1500);
            }, 1000);
        } else {
            setError('Please allow popups to share on LinkedIn');
            setPosting(false);
        }
    };

    // Advanced LinkedIn OAuth posting (requires backend setup)


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#102A28] rounded-xl">
                            <Linkedin size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white">Share on LinkedIn</h3>
                            <p className="text-sm text-gray-400">Share your project with your network</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                {/* Post Preview */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                        Post Preview
                    </label>
                    <textarea
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        rows={8}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:text-[#4B5F5C]/50 focus:bg-white/10 transition-all resize-none font-medium"
                        placeholder="Write your LinkedIn post..."
                    />
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">{postText.length} characters</p>
                        <p className="text-xs text-gray-500">Recommended: 150-300 characters</p>
                    </div>
                </div>

                {/* Image Preview */}
                {includeImage && project.image?.trim() && (
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                            Attached Image
                        </label>
                        <div className="relative rounded-2xl overflow-hidden border border-white/10">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-48 object-cover"
                            />
                            <button
                                onClick={() => setIncludeImage(false)}
                                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
                            >
                                <X size={16} className="text-white" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Add Image Button */}
                {!includeImage && project.image && (
                    <button
                        onClick={() => setIncludeImage(true)}
                        className="mb-6 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold flex items-center gap-2 transition-all"
                    >
                        <Image size={18} />
                        <span>Add Project Image</span>
                    </button>
                )}

                {/* URL Display */}
                <div className="mb-6 p-4 bg-[#EEF4F3] border border-[#DDE7E5] rounded-2xl">
                    <p className="text-xs text-[#8A9B98] mb-2 uppercase tracking-wider font-bold">Link to Share</p>
                    <p className="text-sm text-white break-all font-mono">{url}</p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
                    >
                        <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-400">{error}</p>
                    </motion.div>
                )}

                {/* Success Message */}
                {posted && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3"
                    >
                        <Check size={20} className="text-green-400" />
                        <p className="text-sm text-green-400 font-bold">Opening LinkedIn share dialog...</p>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={shareToLinkedIn}
                        disabled={posting || posted}
                        className="flex-1 px-6 py-4 bg-gradient-to-r text-[#4B5F5C] text-[#4B5F5C] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-xl hover:bg-[#EEF4F3] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {posting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Opening...</span>
                            </>
                        ) : posted ? (
                            <>
                                <Check size={20} />
                                <span>Opened!</span>
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                <span>Share on LinkedIn</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Info Note */}
                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-xs text-gray-400 leading-relaxed">
                        <strong className="text-white">Note:</strong> This will open LinkedIn's share dialog.
                        For advanced posting with OAuth (direct posting without dialog), backend integration is required.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LinkedInIntegration;

