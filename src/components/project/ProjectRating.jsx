import React, { useState } from 'react';
import { Award, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to load ratings from localStorage for a given projectId
const loadRatingsData = (projectId) => {
    try {
        const savedData = localStorage.getItem(`ratings-${projectId}`);
        const ratingsData = savedData ? JSON.parse(savedData) : { ratings: [], distribution: [0, 0, 0, 0, 0] };
        const userRatingData = localStorage.getItem(`user-rating-${projectId}`);

        let averageRating = 0;
        let totalRatings = 0;
        let ratingDistribution = [0, 0, 0, 0, 0];
        let userRating = 0;

        if (ratingsData.ratings.length > 0) {
            averageRating = ratingsData.ratings.reduce((sum, r) => sum + r, 0) / ratingsData.ratings.length;
            totalRatings = ratingsData.ratings.length;
            ratingDistribution = ratingsData.distribution;
        }

        if (userRatingData) {
            userRating = parseInt(userRatingData);
        }

        return { averageRating, totalRatings, ratingDistribution, userRating };
    } catch {
        return { averageRating: 0, totalRatings: 0, ratingDistribution: [0, 0, 0, 0, 0], userRating: 0 };
    }
};

const ProjectRating = ({ projectId, onRatingChange }) => {
    // Lazily initialize all state from localStorage — no useEffect needed
    const [rating, setRating] = useState(() => loadRatingsData(projectId).userRating);
    const [averageRating, setAverageRating] = useState(() => loadRatingsData(projectId).averageRating);
    const [totalRatings, setTotalRatings] = useState(() => loadRatingsData(projectId).totalRatings);
    const [hoverRating, setHoverRating] = useState(0);
    const [userRating, setUserRating] = useState(() => loadRatingsData(projectId).userRating);
    const [ratingDistribution, setRatingDistribution] = useState(() => loadRatingsData(projectId).ratingDistribution);

    const handleRating = (value) => {
        const ratingsData = JSON.parse(localStorage.getItem(`ratings-${projectId}`) || '{"ratings": [], "distribution": [0,0,0,0,0]}');
        let newRatings = [...ratingsData.ratings];
        let newDistribution = [...ratingsData.distribution];

        // Remove previous rating if exists
        if (userRating > 0) {
            const index = newRatings.indexOf(userRating);
            if (index > -1) {
                newRatings.splice(index, 1);
                newDistribution[userRating - 1] = Math.max(0, newDistribution[userRating - 1] - 1);
            }
        }

        // Add new rating
        newRatings.push(value);
        newDistribution[value - 1] += 1;

        // Calculate new average
        const avg = newRatings.reduce((sum, r) => sum + r, 0) / newRatings.length;

        // Save to localStorage
        localStorage.setItem(`ratings-${projectId}`, JSON.stringify({
            ratings: newRatings,
            distribution: newDistribution
        }));
        localStorage.setItem(`user-rating-${projectId}`, value.toString());

        // Update state
        setRating(value);
        setUserRating(value);
        setAverageRating(avg);
        setTotalRatings(newRatings.length);
        setRatingDistribution(newDistribution);

        if (onRatingChange) {
            onRatingChange(value, avg, newRatings.length);
        }
    };

    const getRatingLabel = (value) => {
        const labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
        return labels[value - 1] || '';
    };

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Award size={24} className="text-yellow-500" />
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                    Rate This Project
                </h3>
            </div>

            {/* Average Rating Display */}
            {totalRatings > 0 && (
                <div className="mb-8 p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-yellow-500">
                                    {averageRating.toFixed(1)}
                                </span>
                                <span className="text-2xl text-gray-400">/5</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                                Based on {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={24}
                                    className={star <= Math.round(averageRating) ? 'text-yellow-500' : 'text-gray-600'}
                                    fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = ratingDistribution[star - 1];
                            const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

                            return (
                                <div key={star} className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-gray-400 w-8">{star} ★</span>
                                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.5, delay: (5 - star) * 0.1 }}
                                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 w-12 text-right">
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Star Rating Input */}
            <div className="text-center">
                <p className="text-sm text-gray-400 mb-4 font-medium">
                    {userRating > 0 ? 'Your rating:' : 'Click to rate:'}
                </p>

                <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                            key={star}
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none"
                        >
                            <Star
                                size={48}
                                className={`transition-all ${star <= (hoverRating || rating)
                                    ? 'text-yellow-500'
                                    : 'text-gray-600 hover:text-gray-500'
                                    }`}
                                fill={star <= (hoverRating || rating) ? 'currentColor' : 'none'}
                            />
                        </motion.button>
                    ))}
                </div>

                {/* Rating Label */}
                {(hoverRating || rating) > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4"
                    >
                        <p className="text-lg font-bold text-white">
                            {getRatingLabel(hoverRating || rating)}
                        </p>
                    </motion.div>
                )}

                {/* User Feedback */}
                {userRating > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                    >
                        <p className="text-sm text-green-400 font-medium">
                            ✓ Thank you for rating this project! Click a star to change your rating.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProjectRating;
