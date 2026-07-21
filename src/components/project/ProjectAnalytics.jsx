import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Eye, TrendingUp, Clock, Share2, MapPin, Users } from 'lucide-react';

const ProjectAnalytics = ({ projectId }) => {
    const [analytics, setAnalytics] = useState({
        views: 0,
        uniqueVisitors: 0,
        shares: 0,
        avgTimeSpent: 0,
        lastViewed: null
    });

    useEffect(() => {
        // Load analytics from localStorage
        const savedAnalytics = JSON.parse(
            localStorage.getItem(`analytics-${projectId}`) ||
            '{"views": 0, "uniqueVisitors": 0, "shares": 0, "avgTimeSpent": 0, "sessions": []}'
        );

        // Increment view count
        const sessionId = sessionStorage.getItem('session-id') || `session-${Date.now()}`;
        sessionStorage.setItem('session-id', sessionId);

        const isNewVisitor = !savedAnalytics.sessions?.includes(sessionId);

        const updatedAnalytics = {
            ...savedAnalytics,
            views: savedAnalytics.views + 1,
            uniqueVisitors: isNewVisitor ? (savedAnalytics.uniqueVisitors || 0) + 1 : (savedAnalytics.uniqueVisitors || 0),
            sessions: [...(savedAnalytics.sessions || []), sessionId].slice(-100), // Keep last 100 sessions
            lastViewed: new Date().toISOString()
        };

        localStorage.setItem(`analytics-${projectId}`, JSON.stringify(updatedAnalytics));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAnalytics(updatedAnalytics);

        // Track time spent
        const startTime = Date.now();
        return () => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000); // seconds
            const currentAnalytics = JSON.parse(localStorage.getItem(`analytics-${projectId}`) || '{}');
            const totalTime = (currentAnalytics.totalTimeSpent || 0) + timeSpent;
            const avgTime = Math.floor(totalTime / currentAnalytics.views);

            localStorage.setItem(`analytics-${projectId}`, JSON.stringify({
                ...currentAnalytics,
                totalTimeSpent: totalTime,
                avgTimeSpent: avgTime
            }));
        };
    }, [projectId]);

    const formatTime = (seconds) => {
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    };

    const stats = [
        {
            icon: Eye,
            label: 'Total Views',
            value: analytics.views,
            color: 'from-blue-500 to-blue-600',
            iconColor: 'text-blue-500'
        },
        {
            icon: Users,
            label: 'Unique Visitors',
            value: analytics.uniqueVisitors,
            color: 'from-purple-500 to-purple-600',
            iconColor: 'text-purple-500'
        },
        {
            icon: Share2,
            label: 'Shares',
            value: analytics.shares || 0,
            color: 'from-green-500 to-green-600',
            iconColor: 'text-green-500'
        },
        {
            icon: Clock,
            label: 'Avg. Time',
            value: formatTime(analytics.avgTimeSpent || 0),
            color: 'from-orange-500 to-orange-600',
            iconColor: 'text-orange-500'
        }
    ];

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <TrendingUp size={24} className="text-green-500" />
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                    Project Analytics
                </h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group"
                        >
                            <div className="p-6 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl hover:border-white/20 transition-all">
                                {/* Icon */}
                                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon size={24} className="text-white" />
                                </div>

                                {/* Value */}
                                <div className="text-3xl font-black text-white mb-2">
                                    {stat.value}
                                </div>

                                {/* Label */}
                                <div className="text-sm text-gray-400 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Last Viewed */}
            {analytics.lastViewed && (
                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Viewed</p>
                    <p className="text-sm text-gray-300 font-medium">
                        {new Date(analytics.lastViewed).toLocaleString()}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProjectAnalytics;
