import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import SEO from '../components/public/SEO';

const BlogDetails = () => {
    const { id } = useParams();
    const { data } = useData();
    const posts = data?.blog || [];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [prevId, setPrevId] = useState(id);
    const [copied, setCopied] = useState(false);

    // Reset image index when navigating to a new post
    if (prevId !== id) {
        setPrevId(id);
        setCurrentImageIndex(0);
    }

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

    const handleShare = async () => {
        if (navigator.share && post) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                });
            } catch {
                // user cancelled or share failed
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch {
                // clipboard failed
            }
        }
    };

    if (!post) {
        return (
            <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] flex flex-col">
                <Navbar />
                <main className="flex-1 max-w-[1100px] w-full mx-auto px-6 py-24 flex items-center justify-center">
                    <div className="text-center max-w-md">
                        <h1 className="text-3xl font-semibold text-[#102A28] mb-3">Article not found</h1>
                        <p className="text-[#4B5F5C] text-base mb-8">
                            The article you are looking for doesn't exist or has been moved.
                        </p>
                        <Link to="/blog" className="btn-primary inline-flex">
                            Back to blog
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const currentImage = (post.images && post.images.length > 0 && post.images[currentImageIndex]?.trim())
        ? post.images[currentImageIndex]
        : (post.image?.trim() || '/uday-portrait.png');

    return (
        <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] flex flex-col">
            <SEO
                pageTitle={`${post.title} | Uday Kiran Vempati`}
                pageDescription={post.excerpt}
                pageImage={currentImage}
                pageUrl={`https://udaykiranportfolio.web.app/blog/${post.id}`}
            />

            <Navbar />

            <main className="flex-1 py-12 md:py-16">
                <article className="max-w-[760px] mx-auto px-6">
                    {/* Back link */}
                    <div className="mb-8">
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 text-sm font-medium text-[#4B5F5C] hover:text-[#0F766E] transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to blog
                        </Link>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2.5 py-1 bg-[#E6F4F2] text-[#0F766E] text-xs font-medium rounded-[6px]"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#102A28] tracking-tight leading-tight mb-6">
                        {post.title}
                    </h1>

                    {/* Metadata */}
                    <div className="flex items-center gap-6 text-sm text-[#8A9B98] pb-8 border-b border-[#DDE7E5] mb-8">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={15} />
                            <span>{post.date}</span>
                        </div>
                        {post.readTime && (
                            <div className="flex items-center gap-1.5">
                                <Clock size={15} />
                                <span>{post.readTime}</span>
                            </div>
                        )}
                    </div>

                    {/* Featured Image */}
                    {currentImage && (
                        <div className="mb-10 bg-white border border-[#DDE7E5] rounded-[12px] overflow-hidden">
                            <div className="relative aspect-video max-h-[460px] w-full bg-[#EEF4F3] flex items-center justify-center overflow-hidden">
                                <img
                                    src={currentImage}
                                    alt={post.title}
                                    onError={(e) => { e.currentTarget.src = '/uday-portrait.png'; }}
                                    className="w-full h-full object-cover"
                                />

                                {post.images && post.images.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handlePrevImage}
                                            aria-label="Previous image"
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#102A28] border border-[#DDE7E5] flex items-center justify-center transition-colors"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextImage}
                                            aria-label="Next image"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#102A28] border border-[#DDE7E5] flex items-center justify-center transition-colors"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                            {post.images.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    aria-label={`Go to image ${idx + 1}`}
                                                    className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === idx ? 'bg-[#0F766E] w-5' : 'bg-white/70'}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Excerpt callout */}
                    {post.excerpt && (
                        <div className="p-6 bg-[#EEF4F3] border border-[#DDE7E5] rounded-[12px] mb-8">
                            <p className="text-base md:text-lg font-medium text-[#102A28] leading-relaxed italic m-0">
                                "{post.excerpt}"
                            </p>
                        </div>
                    )}

                    {/* Markdown Body */}
                    <div className="prose prose-neutral max-w-none text-[#4B5F5C] text-base leading-relaxed space-y-6">
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => <h1 className="text-2xl font-semibold text-[#102A28] mt-8 mb-4">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xl font-semibold text-[#102A28] mt-8 mb-4">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-lg font-semibold text-[#102A28] mt-6 mb-3">{children}</h3>,
                                p: ({ children }) => <p className="text-base text-[#4B5F5C] leading-[1.6] mb-4">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-4 text-[#4B5F5C]">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-4 text-[#4B5F5C]">{children}</ol>,
                                li: ({ children }) => <li className="text-base text-[#4B5F5C] leading-[1.6]">{children}</li>,
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-[#0F766E] pl-4 italic text-[#4B5F5C] my-4">
                                        {children}
                                    </blockquote>
                                ),
                                a: ({ href, children }) => (
                                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#0F766E] hover:underline">
                                        {children}
                                    </a>
                                ),
                                code: ({ inline, children, ...props }) => {
                                    return !inline ? (
                                        <div className="bg-[#EEF4F3] border border-[#DDE7E5] rounded-[8px] p-4 my-6 overflow-x-auto text-sm">
                                            <code className="font-mono text-[#102A28]" {...props}>
                                                {children}
                                            </code>
                                        </div>
                                    ) : (
                                        <code className="bg-[#E6F4F2] px-1.5 py-0.5 rounded text-xs font-mono text-[#0F766E]" {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>

                    {/* Article Footer: Author & Share */}
                    <div className="mt-12 pt-8 border-t border-[#DDE7E5] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="text-sm font-semibold text-[#102A28]">Uday Kiran Vempati</p>
                            <p className="text-xs text-[#8A9B98]">Full-stack developer and designer, B.Tech at KL University</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleShare}
                            className="btn-secondary"
                        >
                            <Share2 size={16} />
                            <span>{copied ? 'Link copied' : 'Share article'}</span>
                        </button>
                    </div>

                    {/* Bottom navigation */}
                    <div className="mt-8 pt-8 border-t border-[#DDE7E5]">
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 text-sm font-medium text-[#4B5F5C] hover:text-[#0F766E] transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to all articles
                        </Link>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default BlogDetails;
