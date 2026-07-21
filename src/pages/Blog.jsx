import React, { useState } from 'react';
import Footer from '../components/public/Footer';
import { Calendar, ArrowRight, Search, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import PageWrapper from '../components/public/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import SmokeEffect from '../components/public/SmokeEffect';

const Blog = () => {
    const { data } = useData();
    const [searchQuery, setSearchQuery] = useState('');

    const blogPosts = data?.blog || [];

    const filteredPosts = blogPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageWrapper className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden relative">
            <SmokeEffect color="249, 115, 22" opacity={0.15} density={40} />

            {/* Custom Header (Replaces Navbar) */}
            <div className="relative z-50 px-6 py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="p-3 bg-white/5 group-hover:bg-white/10 rounded-full transition-all border border-white/5">
                        <ArrowLeft size={20} className="text-gray-400 group-hover:text-white" />
                    </div>
                    <span className="text-sm font-bold text-gray-400 group-hover:text-white uppercase tracking-widest transition-colors">Back to Home</span>
                </Link>
                <div className="hidden md:block">
                    <span className="text-xs font-black text-orange-500 uppercase tracking-[0.3em]">Editorial / v2.0</span>
                </div>
            </div>

            {/* Hero Section / Header */}
            <div className="relative pt-12 pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 mb-8"
                    >
                        <div className="w-10 h-[2px] bg-orange-500"></div>
                        <span className="text-sm font-bold tracking-[0.2em] text-orange-500 uppercase">Editorial Hub</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black text-white mb-12 leading-[1.1]"
                    >
                        Ideas, Tutorials <br />& <span className="text-orange-500">Insights</span>
                    </motion.h1>

                    {/* Search Field */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto relative group"
                    >
                        <input
                            type="text"
                            placeholder="Explore our archives..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-6 px-10 pl-16 text-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-lg shadow-2xl backdrop-blur-sm placeholder:text-gray-600"
                        />
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-orange-500 transition-colors" size={24} />
                    </motion.div>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-40">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post, idx) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={post.id}
                                    className="group"
                                >
                                    <Link to={`/blog/${post.id}`} className="block h-full flex flex-col">
                                        <div className="aspect-[16/10] rounded-[40px] overflow-hidden mb-8 border border-white/5 group-hover:border-orange-500/50 shadow-2xl relative transition-all duration-500 bg-[#111]">
                                            <img
                                                src={(post.images && post.images.length > 0 ? post.images[0] : post.image) || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?fit=crop&w=800&q=80'}
                                                alt={post.title}
                                                className="w-full h-full object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                                                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white group-hover:bg-orange-500 group-hover:border-orange-500 transition-colors">
                                                    Read Article
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col px-2">
                                            <div className="flex items-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
                                                <span className="flex items-center gap-2 group-hover:text-orange-500 transition-colors"><Calendar size={14} /> {post.date}</span>
                                                <span className="flex items-center gap-2"><Clock size={14} /> {post.readTime || '5 min read'}</span>
                                            </div>

                                            <h3 className="text-2xl font-black text-white mb-4 group-hover:text-orange-500 transition-colors leading-tight line-clamp-2 uppercase tracking-tight">
                                                {post.title}
                                            </h3>

                                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-medium mb-6">
                                                {post.excerpt}
                                            </p>

                                            <div className="mt-auto pt-4 flex items-center gap-3 text-xs font-black text-white uppercase tracking-widest group-hover:text-orange-500 transition-all">
                                                View Publication
                                                <div className="w-8 h-[2px] bg-white group-hover:w-16 group-hover:bg-orange-500 transition-all duration-500"></div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-40 border-2 border-dashed border-white/5 rounded-[48px] bg-white/5">
                                <Search size={64} className="mx-auto text-gray-700 mb-6" />
                                <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-2">Zero Results Found</h3>
                                <p className="text-gray-500 mb-8">We couldn't find any articles matching "{searchQuery}"</p>
                                <button onClick={() => setSearchQuery('')} className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors">Clear Filter</button>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <Footer />
        </PageWrapper>
    );
};

export default Blog;
