import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import HonorsToolbar from '../components/honors/HonorsToolbar';
import HonorsStats from '../components/honors/HonorsStats';
import CertificateCard from '../components/honors/CertificateCard';
import Preloader from '../components/public/Preloader';
const HonorsPage = () => {
    const navigate = useNavigate();
    const { data } = useData();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        // Simulate initial loading
        setTimeout(() => setLoading(false), 800);
    }, []);

    const filteredHonors = React.useMemo(() => {
        const honors = data?.honors || [];
        const certificates = (data?.certificates || []).map(c => ({
            ...c,
            id: `cert-${c.id}`, // Avoid ID collisions
            category: c.category || 'Certification',
            date: c.date || '2023'
        }));

        let results = [...honors, ...certificates];

        // 1. Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            results = results.filter(h =>
                h.title.toLowerCase().includes(lowerQuery) ||
                h.issuer.toLowerCase().includes(lowerQuery) ||
                h.skills?.some(s => s.toLowerCase().includes(lowerQuery))
            );
        }

        // 2. Filter
        if (filter !== 'All') {
            results = results.filter(h => h.category === filter);
        }

        // 3. Sort
        results.sort((a, b) => {
            if (sort === 'newest') return new Date(b.date) - new Date(a.date);
            if (sort === 'oldest') return new Date(a.date) - new Date(b.date);
            if (sort === 'az') return a.title.localeCompare(b.title);
            if (sort === 'za') return b.title.localeCompare(a.title);
            return 0;
        });

        return results;
    }, [data, searchQuery, filter, sort]);

    if (loading) return <Preloader />;

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>
            {/* Back Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="fixed top-24 left-4 md:left-8 z-50"
            >
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-6 py-3 bg-black/80 backdrop-blur-xl hover:bg-orange-500 text-white rounded-full transition-all border border-white/10 font-bold shadow-xl group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                    <span className="hidden md:inline">Back to Home</span>
                </button>
            </motion.div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 mb-4"
                    >
                        <div className="w-12 h-[2px] bg-orange-500"></div>
                        <h1 className="text-sm font-black text-orange-500 uppercase tracking-[0.3em]">Recognition</h1>
                        <div className="w-12 h-[2px] bg-orange-500"></div>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 uppercase tracking-wider relative inline-block"
                    >
                        Honors & <span className="text-orange-500">Awards</span>
                        <div className="hidden lg:block absolute -top-10 -right-12 w-20 h-20 bg-orange-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto font-medium"
                    >
                        A curated collection of global hackathon wins, technical certifications, and industry recognitions validating my expertise.
                    </motion.p>
                </div>

                <HonorsStats
                    honors={[...(data?.honors || []), ...(data?.certificates || [])]}
                    validatedSkills={Array.from(new Set([...(data?.honors || []), ...(data?.certificates || [])].flatMap(h => h.skills || [])))}
                />

                <HonorsToolbar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filter={filter}
                    setFilter={setFilter}
                    sort={sort}
                    setSort={setSort}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />

                {/* Results Grid */}
                {filteredHonors.length > 0 ? (
                    <motion.div
                        layout
                        className={`grid gap-4 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                    >
                        <AnimatePresence>
                            {filteredHonors.map((cert, index) => (
                                <CertificateCard
                                    key={cert.id}
                                    certificate={cert}
                                    index={index}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No recognition found matching your criteria</p>
                        <button
                            onClick={() => { setSearchQuery(''); setFilter('All'); }}
                            className="mt-4 text-orange-500 text-xs font-black uppercase tracking-widest hover:underline"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HonorsPage;
