import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { MessageSquare, Send, Heart, Reply, Edit2, Trash2, User, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ProjectComments = ({ projectId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [userName, setUserName] = useState('');
    const [showNameInput, setShowNameInput] = useState(true);

    useEffect(() => {
        // Load comments from localStorage
        const savedComments = JSON.parse(localStorage.getItem(`comments-${projectId}`) || '[]');
        setComments(savedComments);

        // Load user name
        const savedName = localStorage.getItem('user-name');
        if (savedName) {
            setUserName(savedName);
            setShowNameInput(false);
        }
    }, [projectId]);

    const addComment = () => {
        if (!newComment.trim()) return;

        if (!userName.trim()) {
            setShowNameInput(true);
            return;
        }

        const comment = {
            id: Date.now(),
            text: newComment,
            author: userName,
            timestamp: new Date().toISOString(),
            likes: 0,
            replies: [],
            parentId: replyTo
        };

        let updatedComments;
        if (replyTo) {
            // Add as reply
            updatedComments = comments.map(c => {
                if (c.id === replyTo) {
                    return {
                        ...c,
                        replies: [...(c.replies || []), comment]
                    };
                }
                return c;
            });
        } else {
            // Add as top-level comment
            updatedComments = [comment, ...comments];
        }

        setComments(updatedComments);
        localStorage.setItem(`comments-${projectId}`, JSON.stringify(updatedComments));
        localStorage.setItem('user-name', userName);

        setNewComment('');
        setReplyTo(null);
    };

    const likeComment = (commentId, isReply = false, parentId = null) => {
        const updatedComments = comments.map(comment => {
            if (isReply && comment.id === parentId) {
                return {
                    ...comment,
                    replies: comment.replies.map(reply =>
                        reply.id === commentId ? { ...reply, likes: reply.likes + 1 } : reply
                    )
                };
            } else if (comment.id === commentId) {
                return { ...comment, likes: comment.likes + 1 };
            }
            return comment;
        });

        setComments(updatedComments);
        localStorage.setItem(`comments-${projectId}`, JSON.stringify(updatedComments));
    };

    const deleteComment = (commentId, isReply = false, parentId = null) => {
        let updatedComments;
        if (isReply) {
            updatedComments = comments.map(comment => {
                if (comment.id === parentId) {
                    return {
                        ...comment,
                        replies: comment.replies.filter(reply => reply.id !== commentId)
                    };
                }
                return comment;
            });
        } else {
            updatedComments = comments.filter(comment => comment.id !== commentId);
        }

        setComments(updatedComments);
        localStorage.setItem(`comments-${projectId}`, JSON.stringify(updatedComments));
    };

    const CommentItem = ({ comment, isReply = false, parentId = null }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`${isReply ? 'ml-12 mt-3' : ''}`}
        >
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                {/* Comment Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-white">{comment.author}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock size={12} />
                                <span>{formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => deleteComment(comment.id, isReply, parentId)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                    >
                        <Trash2 size={16} className="text-gray-500 group-hover:text-red-400" />
                    </button>
                </div>

                {/* Comment Text */}
                <p className="text-gray-300 mb-3 leading-relaxed">{comment.text}</p>

                {/* Comment Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => likeComment(comment.id, isReply, parentId)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-red-500/20 rounded-lg transition-all group"
                    >
                        <Heart size={14} className="text-gray-400 group-hover:text-red-400" />
                        <span className="text-xs font-bold text-gray-400 group-hover:text-red-400">
                            {comment.likes > 0 ? comment.likes : 'Like'}
                        </span>
                    </button>
                    {!isReply && (
                        <button
                            onClick={() => setReplyTo(comment.id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-blue-500/20 rounded-lg transition-all group"
                        >
                            <Reply size={14} className="text-gray-400 group-hover:text-blue-400" />
                            <span className="text-xs font-bold text-gray-400 group-hover:text-blue-400">
                                Reply
                            </span>
                        </button>
                    )}
                </div>

                {/* Replies */}
                {!isReply && comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3">
                        {comment.replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                isReply={true}
                                parentId={comment.id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <MessageSquare size={24} className="text-blue-500" />
                    <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                        Comments
                    </h3>
                </div>
                <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full">
                    <span className="text-sm font-bold text-blue-400">
                        {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                    </span>
                </div>
            </div>

            {/* Name Input (First Time) */}
            {showNameInput && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl"
                >
                    <label className="block text-sm font-bold text-white mb-2">
                        What's your name?
                    </label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                </motion.div>
            )}

            {/* Comment Input */}
            <div className="mb-8">
                {replyTo && (
                    <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between">
                        <span className="text-sm text-blue-400 font-medium">
                            Replying to {comments.find(c => c.id === replyTo)?.author}
                        </span>
                        <button
                            onClick={() => setReplyTo(null)}
                            className="text-xs text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                )}
                <div className="flex gap-3">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
                        rows={3}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all resize-none"
                    />
                    <button
                        onClick={addComment}
                        disabled={!newComment.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed self-end"
                    >
                        <Send size={18} />
                        <span>Post</span>
                    </button>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {comments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <MessageSquare size={48} className="text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No comments yet. Be the first to comment!</p>
                        </motion.div>
                    ) : (
                        comments.map(comment => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProjectComments;
