import React from 'react';
import { Search, Filter, LayoutGrid, List, ArrowUpDown } from 'lucide-react';


const HonorsToolbar = ({
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    sort,
    setSort,
    viewMode,
    setViewMode
}) => {
    const filters = ['All', 'Award', 'Certification', 'Recognition', 'Achievement'];
    const sortOptions = [
        { label: 'Newest', value: 'newest' },
        { label: 'Oldest', value: 'oldest' },
        { label: 'A-Z', value: 'az' },
        { label: 'Z-A', value: 'za' }
    ];

    return (
        <div className="bg-[#111111] border border-white/5 rounded-[32px] p-6 mb-12 animate-fade-in sticky top-24 z-30 shadow-2xl backdrop-blur-md bg-opacity-90">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
                {/* Search */}
                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search awards, skills, or issuers..."
                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-600"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${filter === f
                                ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                                : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* View & Sort */}
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <ArrowUpDown size={14} className="text-gray-500" />
                        </div>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="appearance-none bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-8 text-xs font-bold text-white focus:outline-none focus:border-orange-500 hover:bg-white/5 transition-all outline-none cursor-pointer"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-orange-500 shadow-sm' : 'text-gray-500 hover:text-white'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-orange-500 shadow-sm' : 'text-gray-500 hover:text-white'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HonorsToolbar;
