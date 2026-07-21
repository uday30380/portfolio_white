import React, { useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Bookmark, BookmarkCheck } from 'lucide-react';

const ProjectBookmark = ({ projectId, onBookmarkChange }) => {
    const [isBookmarked, setIsBookmarked] = useState(() => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarked-projects') || '[]');
        return bookmarks.includes(projectId);
    });

    const toggleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarked-projects') || '[]');

        let newBookmarks;
        if (isBookmarked) {
            // Remove bookmark
            newBookmarks = bookmarks.filter(id => id !== projectId);
        } else {
            // Add bookmark
            newBookmarks = [...bookmarks, projectId];
        }

        localStorage.setItem('bookmarked-projects', JSON.stringify(newBookmarks));
        setIsBookmarked(!isBookmarked);

        if (onBookmarkChange) {
            onBookmarkChange(!isBookmarked);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleBookmark}
            className={`group relative px-6 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-xl transition-all overflow-hidden ${isBookmarked
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                : 'bg-white/5 backdrop-blur-xl text-white border border-white/10 hover:bg-white/10'
                }`}
        >
            <div className={`absolute inset-0 transition-opacity ${isBookmarked
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 opacity-0 group-hover:opacity-100'
                : ''
                }`}></div>

            {isBookmarked ? (
                <>
                    <BookmarkCheck size={20} className="relative z-10" />
                    <span className="relative z-10">Bookmarked</span>
                </>
            ) : (
                <>
                    <Bookmark size={20} className="relative z-10" />
                    <span className="relative z-10">Bookmark</span>
                </>
            )}
        </motion.button>
    );
};

export default ProjectBookmark;
