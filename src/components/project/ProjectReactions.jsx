import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Heart, ThumbsUp, Flame, Zap, PartyPopper, Rocket, Sparkles } from 'lucide-react';

const ProjectReactions = ({ projectId, onReactionChange }) => {
    const [reactions, setReactions] = useState({
        heart: 0,
        thumbsUp: 0,
        fire: 0,
        zap: 0,
        party: 0,
        rocket: 0
    });
    const [userReaction, setUserReaction] = useState(null);
    const [showAnimation, setShowAnimation] = useState(null);

    const reactionTypes = [
        { id: 'heart', icon: Heart, label: 'Love', color: 'text-red-500', bgColor: 'bg-red-500/20', emoji: '❤️' },
        { id: 'thumbsUp', icon: ThumbsUp, label: 'Like', color: 'text-blue-500', bgColor: 'bg-blue-500/20', emoji: '👍' },
        { id: 'fire', icon: Flame, label: 'Fire', color: 'text-orange-500', bgColor: 'bg-orange-500/20', emoji: '🔥' },
        { id: 'zap', icon: Zap, label: 'Amazing', color: 'text-yellow-500', bgColor: 'bg-yellow-500/20', emoji: '⚡' },
        { id: 'party', icon: PartyPopper, label: 'Celebrate', color: 'text-purple-500', bgColor: 'bg-purple-500/20', emoji: '🎉' },
        { id: 'rocket', icon: Rocket, label: 'Awesome', color: 'text-green-500', bgColor: 'bg-green-500/20', emoji: '🚀' }
    ];

    useEffect(() => {
        // Load reactions from localStorage
        const savedReactions = localStorage.getItem(`reactions-${projectId}`);
        const savedUserReaction = localStorage.getItem(`user-reaction-${projectId}`);

        if (savedReactions) {
            const parsedReactions = JSON.parse(savedReactions);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setReactions(prev => JSON.stringify(prev) === JSON.stringify(parsedReactions) ? prev : parsedReactions);
        }
        if (savedUserReaction) {
            setUserReaction(prev => prev === savedUserReaction ? prev : savedUserReaction);
        }
    }, [projectId]);

    const handleReaction = (reactionId) => {
        let newReactions = { ...reactions };
        let newUserReaction = userReaction;

        // If user already reacted with this type, remove it
        if (userReaction === reactionId) {
            newReactions[reactionId] = Math.max(0, newReactions[reactionId] - 1);
            newUserReaction = null;
        } else {
            // Remove previous reaction if exists
            if (userReaction) {
                newReactions[userReaction] = Math.max(0, newReactions[userReaction] - 1);
            }
            // Add new reaction
            newReactions[reactionId] = (newReactions[reactionId] || 0) + 1;
            newUserReaction = reactionId;

            // Show animation
            setShowAnimation(reactionId);
            setTimeout(() => setShowAnimation(null), 1000);
        }

        setReactions(newReactions);
        setUserReaction(newUserReaction);

        // Save to localStorage
        localStorage.setItem(`reactions-${projectId}`, JSON.stringify(newReactions));
        if (newUserReaction) {
            localStorage.setItem(`user-reaction-${projectId}`, newUserReaction);
        } else {
            localStorage.removeItem(`user-reaction-${projectId}`);
        }

        // Callback for parent component
        if (onReactionChange) {
            onReactionChange(newReactions, newUserReaction);
        }
    };

    const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);

    return (
        <div className="relative">
            {/* Floating Reaction Animation */}
            <AnimatePresence>
                {showAnimation && (
                    <motion.div
                        initial={{ opacity: 1, y: 0, scale: 1 }}
                        animate={{ opacity: 0, y: -100, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 text-6xl pointer-events-none z-50"
                    >
                        {reactionTypes.find(r => r.id === showAnimation)?.emoji}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reactions Container */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Sparkles size={20} className="text-orange-500" />
                        <h3 className="text-lg font-black text-white uppercase tracking-wider">
                            React to this project
                        </h3>
                    </div>
                    {totalReactions > 0 && (
                        <div className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full">
                            <span className="text-sm font-bold text-orange-400">
                                {totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Reaction Buttons */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {reactionTypes.map((reaction, index) => {
                        const Icon = reaction.icon;
                        const count = reactions[reaction.id] || 0;
                        const isActive = userReaction === reaction.id;

                        return (
                            <motion.button
                                key={reaction.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleReaction(reaction.id)}
                                className={`group relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${isActive
                                    ? `${reaction.bgColor} border-2 ${reaction.color.replace('text-', 'border-')}`
                                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                {/* Icon */}
                                <Icon
                                    size={28}
                                    className={`transition-all ${isActive ? reaction.color : 'text-gray-400 group-hover:text-white'
                                        }`}
                                    fill={isActive ? 'currentColor' : 'none'}
                                />

                                {/* Label */}
                                <span className={`text-xs font-bold transition-all ${isActive ? reaction.color : 'text-gray-400 group-hover:text-white'
                                    }`}>
                                    {reaction.label}
                                </span>

                                {/* Count Badge */}
                                {count > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className={`absolute -top-2 -right-2 min-w-[24px] h-6 px-2 ${isActive ? reaction.bgColor : 'bg-white/10'
                                            } border ${isActive ? reaction.color.replace('text-', 'border-') : 'border-white/20'
                                            } rounded-full flex items-center justify-center`}
                                    >
                                        <span className={`text-xs font-black ${isActive ? reaction.color : 'text-white'
                                            }`}>
                                            {count}
                                        </span>
                                    </motion.div>
                                )}

                                {/* Active Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeReaction"
                                        className="absolute inset-0 rounded-2xl border-2 border-white/20"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* User Feedback */}
                {userReaction && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl text-center"
                    >
                        <p className="text-sm text-gray-400">
                            You reacted with{' '}
                            <span className={`font-bold ${reactionTypes.find(r => r.id === userReaction)?.color}`}>
                                {reactionTypes.find(r => r.id === userReaction)?.label}
                            </span>
                            {' '}• Click again to remove
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProjectReactions;
