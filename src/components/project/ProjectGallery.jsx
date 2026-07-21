import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { ChevronLeft, ChevronRight, X, ZoomIn, Image as ImageIcon } from 'lucide-react';

const ProjectGallery = ({ images, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);

    // If images is a string (single image), convert to array
    const imageArray = Array.isArray(images) ? images : [images];

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % imageArray.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length);
    };

    if (imageArray.length === 0) return null;

    return (
        <>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <ImageIcon size={24} className="text-purple-500" />
                        <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                            Project Gallery
                        </h3>
                    </div>
                    <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full">
                        <span className="text-sm font-bold text-purple-400">
                            {currentIndex + 1} / {imageArray.length}
                        </span>
                    </div>
                </div>

                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden bg-black/20 mb-6 group">
                    <motion.img
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        src={imageArray[currentIndex]}
                        alt={`${title} - Image ${currentIndex + 1}`}
                        className="w-full h-[400px] object-contain cursor-pointer"
                        onClick={() => setShowLightbox(true)}
                    />

                    {/* Zoom Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                            <ZoomIn size={32} className="text-white" />
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    {imageArray.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full transition-all"
                            >
                                <ChevronLeft size={24} className="text-white" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full transition-all"
                            >
                                <ChevronRight size={24} className="text-white" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {imageArray.length > 1 && (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {imageArray.map((img, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentIndex(index)}
                                className={`relative rounded-xl overflow-hidden border-2 transition-all ${index === currentIndex
                                    ? 'border-purple-500 ring-2 ring-purple-500/50'
                                    : 'border-white/10 hover:border-white/30'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-20 object-cover"
                                />
                                {index === currentIndex && (
                                    <div className="absolute inset-0 bg-purple-500/20"></div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {showLightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowLightbox(false)}
                        className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowLightbox(false)}
                            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all z-10"
                        >
                            <X size={24} className="text-white" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                            <span className="text-white font-bold">
                                {currentIndex + 1} / {imageArray.length}
                            </span>
                        </div>

                        {/* Main Image */}
                        <motion.img
                            key={currentIndex}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            src={imageArray[currentIndex]}
                            alt={`${title} - Image ${currentIndex + 1}`}
                            className="max-w-full max-h-[90vh] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Navigation */}
                        {imageArray.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all"
                                >
                                    <ChevronLeft size={32} className="text-white" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all"
                                >
                                    <ChevronRight size={32} className="text-white" />
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProjectGallery;
