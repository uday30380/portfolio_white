import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ADMIN_EMAILS } from '../../config/admin';

const navLinks = [
    { name: 'Work', href: '/#work' },
    { name: 'About', href: '/#about' },
    { name: 'Honors', href: '/honors' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/#contact' },
];

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Close mobile menu on route change without cascading effect render
    const [prevPath, setPrevPath] = useState(location.pathname);
    if (prevPath !== location.pathname) {
        setPrevPath(location.pathname);
        setIsMobileMenuOpen(false);
    }

    const isAdmin = Boolean(user && user.email && ADMIN_EMAILS.includes(user.email));

    return (
        <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#DDE7E5]">
            <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
                {/* Left: Name */}
                <Link
                    to="/"
                    className="text-base font-semibold text-[#102A28] hover:bg-[#E6F4F2] px-3 py-1.5 rounded-[8px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7CC7BD]"
                >
                    Uday Kiran Vempati
                </Link>

                {/* Right: Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1.5">
                    {navLinks.map((link) => {
                        const isInternal = link.href.startsWith('/#');
                        const isActive =
                            link.href === location.pathname ||
                            (link.href.startsWith('/blog') && location.pathname.startsWith('/blog')) ||
                            (link.href.startsWith('/honors') && location.pathname.startsWith('/honors'));

                        const baseClasses =
                            'text-sm px-3 py-1.5 rounded-[8px] transition-colors hover:bg-[#E6F4F2] hover:text-[#0F766E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7CC7BD]';
                        const activeClasses = isActive
                            ? 'text-[#0F766E] font-medium underline decoration-2 decoration-[#0F766E] underline-offset-8'
                            : 'text-[#4B5F5C]';

                        return isInternal ? (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`${baseClasses} ${activeClasses}`}
                            >
                                {link.name}
                            </a>
                        ) : (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`${baseClasses} ${activeClasses}`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}

                    {/* Resume Outlined Button */}
                    <div className="ml-3 pl-3 border-l border-[#DDE7E5] flex items-center gap-2">
                        <Link
                            to="/resume"
                            className={`inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7CC7BD] ${
                                location.pathname === '/resume'
                                    ? 'bg-[#E6F4F2] border-[#7CC7BD] text-[#0F766E]'
                                    : 'border-[#DDE7E5] bg-white text-[#102A28] hover:bg-[#E6F4F2] hover:border-[#7CC7BD]'
                            }`}
                        >
                            <span>Resume</span>
                        </Link>

                        {/* Admin Link: only visible when logged in as admin */}
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="text-sm font-medium text-[#4B5F5C] hover:text-[#0F766E] hover:bg-[#E6F4F2] px-3 py-1.5 rounded-[8px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7CC7BD]"
                            >
                                Admin
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-[#102A28] hover:bg-[#E6F4F2] rounded-[8px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7CC7BD]"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[#FFFFFF] border-b border-[#DDE7E5] px-6 py-4 space-y-2">
                    {navLinks.map((link) => {
                        const isInternal = link.href.startsWith('/#');
                        const isActive =
                            link.href === location.pathname ||
                            (link.href.startsWith('/blog') && location.pathname.startsWith('/blog')) ||
                            (link.href.startsWith('/honors') && location.pathname.startsWith('/honors'));

                        const baseClasses =
                            'block px-3 py-2 text-base rounded-[8px] transition-colors hover:bg-[#E6F4F2] hover:text-[#0F766E]';
                        const activeClasses = isActive
                            ? 'text-[#0F766E] font-medium underline decoration-2 decoration-[#0F766E] underline-offset-4'
                            : 'text-[#4B5F5C]';

                        return isInternal ? (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`${baseClasses} ${activeClasses}`}
                            >
                                {link.name}
                            </a>
                        ) : (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`${baseClasses} ${activeClasses}`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}

                    <div className="pt-2 border-t border-[#DDE7E5] space-y-2">
                        <Link
                            to="/resume"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`inline-flex items-center justify-center gap-1.5 w-full h-10 rounded-lg border text-sm font-medium transition-colors ${
                                location.pathname === '/resume'
                                    ? 'bg-[#E6F4F2] border-[#7CC7BD] text-[#0F766E]'
                                    : 'border-[#DDE7E5] bg-white text-[#102A28] hover:bg-[#E6F4F2] hover:border-[#7CC7BD]'
                            }`}
                        >
                            <span>Resume</span>
                        </Link>

                        {isAdmin && (
                            <Link
                                to="/admin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-center py-2 text-sm font-medium text-[#4B5F5C] hover:text-[#0F766E] hover:bg-[#E6F4F2] rounded-[8px] transition-colors"
                            >
                                Admin Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;