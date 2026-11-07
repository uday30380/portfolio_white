import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Search, Award, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import SEO from '../components/public/SEO';

const fallbackList = [
    {
        id: 'canva-rec',
        title: 'Officially Recognized by Canva',
        issuer: 'Canva',
        category: 'Design',
        date: '2025',
        description: 'Recognized for mastery in visual communications and design leadership.'
    },
    {
        id: 'focus-lead',
        title: 'Provision Wing Lead – Graphic Design',
        issuer: 'FOCUS Club, KL University',
        category: 'Leadership',
        date: '2025',
        description: 'Appointed as student lead heading creative direction and campaign branding.'
    },
    {
        id: 'amazon-pub',
        title: 'Mobile App Publisher',
        issuer: 'Amazon App Store',
        category: 'Engineering',
        date: '2024',
        description: 'Published an independent mobile software application on the Amazon App Store.'
    },
    {
        id: 'rpa-admin',
        title: 'RPA Club Web Administrator & Designer',
        issuer: 'RPA Club, KL University',
        category: 'Engineering',
        date: '2024',
        description: 'Managed complete digital infrastructure and event branding operations.'
    },
    {
        id: 'canva-essentials',
        title: 'Canva for Work & Design Essentials',
        issuer: 'Canva Education',
        category: 'Design',
        date: '2024',
        description: 'Verified certification in digital asset generation and brand design systems.'
    },
    {
        id: 'cid-ap',
        title: 'Crime Investigation Department Portal Commendation',
        issuer: 'CID Andhra Pradesh',
        category: 'Engineering',
        date: '2023',
        description: 'Engineered a secure role-based access government portal for resource coordination.'
    }
];

const categories = ['All', 'Engineering', 'Design', 'Leadership'];

const HonorsPage = () => {
    const { data } = useData() || {};
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const allItems = useMemo(() => {
        const raw = [
            ...(data?.honors || []).map(h => ({
                id: h.id,
                title: h.title,
                issuer: h.issuer || h.organization || 'KL University',
                category: h.category || 'Engineering',
                date: h.date || h.year || '2024',
                image: h.image,
                description: h.description
            })),
            ...(data?.certificates || []).map(c => ({
                id: `cert-${c.id}`,
                title: c.title,
                issuer: c.issuer || c.organization || 'Certification',
                category: c.category || 'Design',
                date: c.date || c.year || '2024',
                image: c.image,
                description: c.description
            })),
            ...(data?.achievements || []).map(a => ({
                id: a.id,
                title: a.title,
                issuer: a.organization || 'Recognition',
                category: 'Leadership',
                date: a.date || '2024',
                image: a.image,
                description: a.description
            }))
        ];

        return raw.length >= 4 ? raw : fallbackList;
    }, [data]);

    const filtered = useMemo(() => {
        return allItems.filter(item => {
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
            const query = searchQuery.toLowerCase().trim();
            const matchesQuery = !query ||
                item.title.toLowerCase().includes(query) ||
                item.issuer.toLowerCase().includes(query) ||
                (item.description && item.description.toLowerCase().includes(query));
            return matchesCategory && matchesQuery;
        });
    }, [allItems, activeCategory, searchQuery]);

    return (
        <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] flex flex-col justify-between">
            <SEO
                title="Honors and Certifications · Uday Kiran Vempati"
                description="Browse professional credentials, honors, and verified design certifications earned by Uday Kiran Vempati."
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
                            Honors and certifications
                        </h1>
                        <p className="text-base text-[#4B5F5C] max-w-[620px]">
                            Verified credentials, academic achievements, and industry recognitions in software engineering and design.
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
                            placeholder="Search by title or organization..."
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
                                No credentials match your search.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {filtered.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-[#FFFFFF] border border-[#DDE7E5] rounded-xl p-6 shadow-sm flex flex-col justify-between transition-all duration-200 hover:border-[#7CC7BD] hover:-translate-y-0.5"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-[#E6F4F2] text-[#0F766E] flex items-center justify-center">
                                                <Award size={16} />
                                            </div>
                                            <span className="text-xs font-medium text-[#8A9B98]">
                                                {item.date}
                                            </span>
                                        </div>

                                        <h2 className="text-lg font-semibold text-[#102A28] mb-1.5 line-clamp-2">
                                            {item.title}
                                        </h2>
                                        <p className="text-sm font-medium text-[#4B5F5C] mb-3">
                                            {item.issuer}
                                        </p>
                                        {item.description && (
                                            <p className="text-sm text-[#8A9B98] leading-relaxed line-clamp-3">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-[#DDE7E5] flex items-center justify-between">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#E6F4F2] text-[#0F766E]">
                                            {item.category}
                                        </span>
                                        <Link
                                            to={`/certificate/${item.id}`}
                                            className="link-accent text-xs inline-flex items-center gap-1"
                                        >
                                            <span>View credential</span>
                                            <ArrowRight size={13} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HonorsPage;
