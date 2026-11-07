import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const Breadcrumb = ({ items }) => {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm mb-8"
            aria-label="Breadcrumb"
        >
            <Link
                to="/"
                className="flex items-center gap-1 text-gray-400 hover:text-orange-500 transition-colors group"
            >
                <Home size={16} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Home</span>
            </Link>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight size={16} className="text-gray-600" />
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="text-gray-400 hover:text-orange-500 transition-colors truncate max-w-[200px]"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-white font-medium truncate max-w-[200px]">
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </motion.nav>
    );
};

export default Breadcrumb;

