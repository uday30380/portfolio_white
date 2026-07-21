import React, { useState, useEffect } from 'react';
import { Menu, X, User, Search, LogOut, Command, ChevronRight } from 'lucide-react';
import { auth } from '../../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';


const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        if (window.confirm('Sign out from session?')) {
            await signOut(auth);
        }
    };

    const handleSearch = () => {
        window.dispatchEvent(new CustomEvent('openCommandPalette'));
    };

    const isAdmin = user?.email?.toLowerCase() === 'udaykiranvempati123@gmail.com';

    const navLinks = [
        { name: 'Home', href: '/#home' },
        { name: 'About', href: '/#about' },
        { name: 'Skills', href: '/#skills' },
        { name: 'Honors', href: '/honors' },
        { name: 'Projects', href: '/#projects' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/#contact' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${isScrolled ? 'pt-4' : 'pt-6'}`}
            >
                {/* Floating Island Container */}
                <div className={`
                    relative flex items-center justify-between px-3 md:px-4 py-2.5 transition-all duration-500
                    ${isScrolled
                        ? 'w-[90%] md:w-auto md:min-w-[700px] bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_40px_rgba(0,0,0,0.5)]'
                        : 'w-[95%] md:w-full max-w-7xl bg-transparent border-transparent'
                    }
                `}>

                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-xs shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform duration-300">
                            V
                        </div>
                        <div className={`flex flex-col ${isScrolled ? 'hidden md:flex' : 'flex'}`}>
                            <span className="text-sm font-bold text-white leading-none tracking-tight whitespace-nowrap">UDAY KIRAN VEMPATI</span>
                            <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Portfolio</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5 mx-4">
                        {navLinks.map((link) => (
                            link.href.startsWith('#') ? (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="px-5 py-2 rounded-full text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 uppercase tracking-wide"
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="px-5 py-2 rounded-full text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 uppercase tracking-wide"
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-3">


                        {/* Search */}
                        <button
                            onClick={handleSearch}
                            className={`p-2.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all ${isScrolled ? '' : 'bg-black/20 backdrop-blur-md border border-white/5'}`}
                        >
                            <Search size={18} />
                        </button>

                        {/* Login/Admin Status */}
                        {!user ? (
                            <Link
                                to="/login"
                                className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-full font-bold text-xs uppercase tracking-wider hover:bg-orange-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-orange-500/20"
                            >
                                Sign In
                            </Link>
                        ) : (
                            <div className="hidden md:flex items-center gap-1 pl-1 pr-1 py-1 rounded-full bg-[#111111] border border-white/10 shadow-lg">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border-2 border-white/10 shadow-lg object-cover" />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#000000] border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)] relative group overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-tr from-orange-500 to-purple-500 group-hover:from-white group-hover:to-white transition-all duration-300">
                                            {user.displayName?.[0] || 'U'}
                                        </div>
                                    </div>
                                )}
                                {isAdmin && (
                                    <Link to="/admin" className="px-4 py-1.5 bg-orange-500 rounded-full text-[10px] font-black text-white hover:bg-orange-600 transition-all uppercase tracking-wider mx-1 shadow-[0_2px_10px_rgba(249,115,22,0.3)] hover:shadow-orange-500/50">
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all group"
                                    aria-label="Sign out"
                                >
                                    <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2.5 rounded-full bg-white/10 text-white hover:bg-orange-500 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: '-100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-100%' }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[100] bg-black bg-grid-white/[0.05] flex flex-col"
                    >
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-xs">V</div>
                                <span className="font-bold text-lg tracking-tight">MENU</span>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-3 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Mobile Links */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center space-y-2">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                                >
                                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700 group-hover:from-white group-hover:to-gray-400 transition-all uppercase tracking-tighter">
                                        {link.name}
                                    </span>
                                    <ChevronRight className="text-gray-600 group-hover:text-orange-500 transition-colors" />
                                </motion.a>
                            ))}
                        </div>

                        {/* Mobile Footer */}
                        <div className="p-6 border-t border-white/10">
                            {!user ? (
                                <a href="/login" className="flex items-center justify-center w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-widest text-sm hover:bg-orange-500 hover:text-white transition-colors">
                                    Sign In To Account
                                </a>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center font-bold text-white">
                                            {user.displayName?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{user.displayName || 'User'}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                    {isAdmin && (
                                        <a href="/admin" className="flex items-center justify-center w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-orange-500 hover:border-orange-500 transition-colors">
                                            Access Dashboard
                                        </a>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-center w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
