import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-[1100px] w-full mx-auto px-6 py-24 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <p className="text-sm font-semibold text-[#0F766E] tracking-wide mb-2">404</p>
                    <h1 className="text-3xl sm:text-4xl font-semibold text-[#102A28] mb-3">Page not found</h1>
                    <p className="text-[#4B5F5C] text-base mb-8">
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link to="/" className="btn-primary">
                            Back to home
                        </Link>
                        <Link to="/#projects" className="btn-secondary">
                            View my work
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;
