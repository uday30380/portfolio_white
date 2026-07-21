import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Book, Briefcase, Mail, Moon, Sun, LayoutDashboard, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();

    // Toggle logic
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('openCommandPalette', () => setIsOpen(true));
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('openCommandPalette', () => setIsOpen(true));
        };
    }, []);

    // Reset filtering when opening
    useEffect(() => {
        if (!isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const actions = [
        {
            group: 'Navigation',
            items: [
                { id: 'home', icon: Home, label: 'Go to Home', action: () => navigate('/') },
                { id: 'projects', icon: Briefcase, label: 'View Projects', action: () => { navigate('/'); setTimeout(() => document.getElementById('projects')?.scrollIntoView(), 100); } },
                { id: 'blog', icon: Book, label: 'Read Blog', action: () => navigate('/blog') },
                { id: 'admin', icon: LayoutDashboard, label: 'Admin Dashboard', action: () => navigate('/admin') },
            ]
        },
        {
            group: 'Actions',
            items: [
                { id: 'contact', icon: Mail, label: 'Contact Me', action: () => window.dispatchEvent(new CustomEvent('openHireMeModal')) },
                { id: 'theme', icon: Moon, label: 'Toggle Theme', action: () => document.querySelector('[aria-label="Toggle Theme"]')?.click() },
                { id: 'login', icon: User, label: 'Login', action: () => navigate('/login') },
            ]
        }
    ];

    // Filter items based on query
    const filteredGroups = actions.map(group => ({
        ...group,
        items: group.items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
    })).filter(group => group.items.length > 0);

    // Flatten for keyboard navigation
    const flatItems = filteredGroups.flatMap(group => group.items);

    const handleSelect = (item) => {
        item.action();
        setIsOpen(false);
    };

    // Keyboard navigation for list
    useEffect(() => {
        const handleListNav = (e) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % flatItems.length);
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + flatItems.length) % flatItems.length);
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                if (flatItems[selectedIndex]) {
                    handleSelect(flatItems[selectedIndex]);
                }
            }
        };

        window.addEventListener('keydown', handleListNav);
        return () => window.removeEventListener('keydown', handleListNav);
    }, [isOpen, flatItems, selectedIndex]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh] px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    ></motion.div>

                    {/* Window */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-xl bg-[#0a1322] border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] text-slate-200"
                    >
                        {/* Search Input */}
                        <div className="flex items-center px-4 py-4 border-b border-slate-700">
                            <Search className="text-slate-400 mr-3" size={20} />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Type a command or search..."
                                className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-slate-500"
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                            />
                            <div className="text-xs text-slate-500 px-2 py-1 border border-slate-700 rounded select-none">ESC</div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                            {flatItems.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    No results found.
                                </div>
                            ) : (
                                filteredGroups.map((group, groupIdx) => (
                                    <div key={groupIdx} className="mb-2">
                                        <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            {group.group}
                                        </div>
                                        {group.items.map((item) => {
                                            // Calculate index in flat array to determine active state
                                            const flatIdx = flatItems.indexOf(item);
                                            const isActive = flatIdx === selectedIndex;

                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleSelect(item)}
                                                    onMouseMove={() => setSelectedIndex(flatIdx)}
                                                    className={`w-full flex items-center px-3 py-3 rounded-lg text-sm transition-colors ${isActive
                                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                                        : 'text-slate-300 hover:bg-white/5'
                                                        }`}
                                                >
                                                    <item.icon size={18} className={`mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                                    <span>{item.label}</span>
                                                    {item.id === 'contact' && <span className="ml-auto text-xs opacity-60">Hire Me</span>}
                                                </button>
                                            )
                                        })}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer Hint */}
                        <div className="p-2 border-t border-slate-800 bg-slate-900/50 flex justify-end items-center gap-4 text-[10px] text-slate-500">
                            <span className="flex items-center gap-1"><span className="bg-slate-700 px-1 rounded">↑</span> <span className="bg-slate-700 px-1 rounded">↓</span> to navigate</span>
                            <span className="flex items-center gap-1"><span className="bg-slate-700 px-1 rounded">↵</span> to select</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
