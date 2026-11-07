import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import SEO from '../components/public/SEO';

const fallbackPosts = [
    {
        id: 1,
        title: 'Building and publishing my first mobile app on the Amazon App Store',
        category: 'Engineering',
        date: 'October 2024',
        readTime: '5 min read',
        excerpt: 'The lessons learned taking a standalone mobile application from concept to production submission, handling distribution and user feedback as a sophomore.',
        image: '/uday-portrait.png'
    },
    {
        id: 2,
        title: 'Designing with restraint: A product designer’s guide to calm interfaces',
        category: 'Design',
        date: 'August 2024',
        readTime: '4 min read',
        excerpt: 'Why cutting extraneous effects, glows, and noise creates a substantially faster, more accessible, and more trustworthy experience for end users.',
        image: '/uday-portrait.png'
    },
    {
        id: 3,
        title: 'Leading creative direction for student clubs at KL University',
        category: 'Student Life',
        date: 'May 2024',
        readTime: '6 min read',
        excerpt: 'Reflections on organizing design workflows, mentoring first-year teammates, and building recognizable digital branding across university events.',
        image: '/uday-portrait.png'
    }
];

const categories = ['All', 'Engineering', 'Design', 'Student Life'];

const Blog = () => {
    const { data } = useData() || {};
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const posts = useMemo(() => {
        const raw = (data?.blog && data.blog.length > 0) ? data.blog : fallbackPosts;
        return raw;
    }, [data]);

    const filtered = useMemo(() => {
        return posts.filter(post => {
            const matchesCategory = activeCategory === 'All' || (post.category || 'Engineering') === activeCategory;
            const query = searchQuery.toLowerCase().trim();
            const matchesQuery = !query ||
                post.title.toLowerCase().includes(query) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(query));
            return matchesCategory && matchesQuery;
        });
    }, [posts, activeCategory, searchQuery]);

    return (
        <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] flex flex-col justify-between">
            <SEO
                title="Blog · Uday Kiran Vempati"
                description="Articles on software engineering, product design, and building real digital products."
            />
            <Navbar />

            <main className="py-12 md:py-20 flex-1">
                <div className="max-w-[1100px] mx-auto px-6">
                    {/* Back Link */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-sm text-[#4B5F5C] hover:text-[#0F766E] font-medium mb-8 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to home</span>
                    </Link>

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#102A28] tracking-tight mb-3">
                            Blog
                        </h1>
                        <p className="text-base text-[#4B5F5C] max-w-[620px]">
                            Thoughts and case studies on full-stack development, product design, and building things that scale.
                        </p>
                    </div>

                    {/* Simple Search Box */}
                    <div className="relative mb-6 max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9B98] pointer-events-none"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search articles..."
                            className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#DDE7E5] bg-[#FFFFFF] text-sm text-[#102A28] placeholder:text-[#8A9B98] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors"
                        />
                    </div>

                    {/* One Filter Row of Chips */}
                    <div className="flex flex-wrap gap-2 mb-10">
                        {categories.map((cat) => {
                            const isSelected = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setActiveCategory(cat)}
                                    className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors border ${
                                        isSelected
                                            ? 'bg-[#0F766E] text-white border-[#0F766E]'
                                            : 'bg-[#E6F4F2] text-[#0F766E] border-[#DDE7E5] hover:border-[#7CC7BD]'
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    {/* Grid of Clean Cards */}
                    {filtered.length === 0 ? (
                        <div className="p-12 text-center rounded-xl border border-[#DDE7E5] bg-[#FFFFFF]">
                            <p className="text-base text-[#4B5F5C]">
                                No articles match your search.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filtered.map((post) => {
                                const imageSrc = post.image?.trim() ? post.image : (post.images?.[0] || '/uday-portrait.png');
                                return (
                                    <article
                                        key={post.id}
                                        className="bg-[#FFFFFF] border border-[#DDE7E5] rounded-xl overflow-hidden shadow-sm hover:border-[#7CC7BD] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="aspect-[16/10] bg-[#EEF4F3] border-b border-[#DDE7E5] overflow-hidden">
                                                <img
                                                    src={imageSrc}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>

                                            <div className="p-6 pb-2">
                                                <div className="flex items-center gap-2 text-xs font-medium text-[#8A9B98] mb-3">
                                                    <span>{post.date || '2024'}</span>
                                                    <span>·</span>
                                                    <span>{post.readTime || '4 min read'}</span>
                                                </div>

                                                <h2 className="text-xl font-semibold text-[#102A28] mb-2.5 line-clamp-2">
                                                    {post.title}
                                                </h2>

                                                <p className="text-sm text-[#4B5F5C] leading-relaxed line-clamp-3 mb-4">
                                                    {post.excerpt || post.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="px-6 pb-6 pt-2">
                                            <Link
                                                to={`/blog/${post.id}`}
                                                className="link-accent text-sm"
                                            >
                                                <span>Read article</span>
                                                <ArrowRight size={15} />
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
