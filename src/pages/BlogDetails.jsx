import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import ReactMarkdown from 'react-markdown';
import Footer from '../components/public/Footer';
import PageWrapper from '../components/public/PageWrapper';
import { motion } from 'framer-motion';
import SmokeEffect from '../components/public/SmokeEffect';

const BlogDetails = () => {
    const { id } = useParams();
    const { data } = useData();
    const posts = data?.blog || [];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Reset image index when navigating to a new post
    React.useEffect(() => {
        setCurrentImageIndex(0);
    }, [id]);

    const post = posts.find(p => p.id.toString() === id);

    const handleNextImage = () => {
        if (post?.images?.length) {
            setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
        }
    };

    const handlePrevImage = () => {
        if (post?.images?.length) {
            setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
        }
    };

    if (!post) {
        return (
            <PageWrapper className="min-h-screen bg-[#0A0A0A] text-white flex flex-col relative overflow-hidden">
                <SmokeEffect color="249, 115, 22" opacity={0.15} density={40} />
                <div className="relative z-50 px-6 py-8">
                    <Link to="/blog" className="inline-flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5 group">
                        <ArrowLeft size={20} className="text-gray-400 group-hover:text-white" />
                    </Link>
                </div>
                <div className="flex-1 flex items-center justify-center relative z-10">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <ArrowLeft className="text-orange-500" size={32} />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Article Not Found</h2>
                        <Link to="/blog" className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-black uppercase text-xs tracking-widest hover:bg-orange-500 hover:border-orange-500 transition-all">Back to Archives</Link>
                    </div>
                </div>
                <Footer />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
            <SmokeEffect color="249, 115, 22" opacity={0.1} density={40} />

            {/* Custom Header (Replaces Navbar) */}
            <div className="relative z-50 px-6 py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
                <Link to="/blog" className="flex items-center gap-3 group">
                    <div className="p-3 bg-white/5 group-hover:bg-white/10 rounded-full transition-all border border-white/5">
                        <ArrowLeft size={20} className="text-gray-400 group-hover:text-white" />
                    </div>
                    <span className="text-sm font-bold text-gray-400 group-hover:text-white uppercase tracking-widest transition-colors">Return to Archives</span>
                </Link>
            </div>

            <article className="pt-12 pb-32 relative z-10">
                {/* Meta Info Header */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] -z-10"></div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Link to="/blog" className="inline-flex items-center text-gray-500 hover:text-orange-500 mb-12 transition-all group font-black uppercase text-[10px] tracking-widest bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full border border-white/5">
                            <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-1 transition-transform" />
                            Return to Archives
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-3 mb-8"
                    >
                        {post.tags?.map((tag, idx) => (
                            <span key={idx} className="px-5 py-2 bg-orange-500/10 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                                {tag}
                            </span>
                        ))}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-12 leading-[1.1] uppercase tracking-tighter"
                    >
                        {post.title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-10 border-t border-b border-white/5 py-8"
                    >
                        <div className="flex items-center gap-3 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                            <Calendar size={16} className="text-orange-500" />
                            <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                            <Clock size={16} className="text-orange-500" />
                            <span>{post.readTime}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Asset with Carousel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24"
                >
                    <div className="w-full h-[500px] md:h-[700px] rounded-[60px] overflow-hidden shadow-2xl relative border border-white/5 bg-[#111]">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img
                                key={currentImageIndex} // Key forces re-render for simple transition
                                src={post.images && post.images.length > 0 ? post.images[currentImageIndex] : post.image}
                                alt={post.title}
                                className="w-full h-full object-contain" // Changed to object-contain for full visibility
                            />
                        </div>

                        {/* Navigation Buttons */}
                        {post.images && post.images.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-orange-500 transition-all border border-white/10 group z-20"
                                >
                                    <ChevronLeft size={32} className="group-hover:scale-110 transition-transform" />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-orange-500 transition-all border border-white/10 group z-20"
                                >
                                    <ChevronRight size={32} className="group-hover:scale-110 transition-transform" />
                                </button>

                                {/* Dots Indicator */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                                    {post.images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`w-3 h-3 rounded-full transition-all ${currentImageIndex === idx ? 'bg-orange-500 w-8' : 'bg-white/30 hover:bg-white/50'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Content Matrix */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none prose-invert prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-white prose-p:text-gray-400 prose-p:leading-relaxed prose-strong:text-white prose-blockquote:border-orange-500 prose-blockquote:bg-white/5 prose-blockquote:rounded-3xl prose-blockquote:px-10 prose-blockquote:py-2 prose-blockquote:not-italic prose-li:text-gray-400">
                        <div className="bg-[#111] p-10 md:p-16 rounded-[48px] border border-white/10 mb-16 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <p className="text-2xl md:text-3xl text-white font-bold leading-relaxed italic m-0 relative z-10">
                                "{post.excerpt}"
                            </p>
                        </div>

                        <ReactMarkdown
                            components={{
                                code: ({ inline, children, ...props }) => {
                                    return !inline ? (
                                        <div className="bg-[#050505] border border-white/5 rounded-3xl p-8 my-10 overflow-x-auto shadow-2xl">
                                            <code className="text-sm font-mono text-orange-400" {...props}>
                                                {children}
                                            </code>
                                        </div>
                                    ) : (
                                        <code className="bg-orange-500/10 px-2 py-1 rounded text-sm text-orange-500 font-medium" {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>

                    <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-black text-white text-xl">U</div>
                            <div>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Author Identity</span>
                                <span className="text-sm font-black text-white uppercase">Uday Kiran Vempati</span>
                            </div>
                        </div>
                        <button className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-orange-500 hover:text-white rounded-full text-white font-black uppercase text-[10px] tracking-widest transition-all shadow-lg border border-white/5 hover:border-orange-500">
                            <Share2 size={16} />
                            <span>Broadcast Signal</span>
                        </button>
                    </div>
                </div>
            </article>

            <Footer />
        </PageWrapper>
    );
};

export default BlogDetails;
