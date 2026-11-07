import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, ExternalLink, Share2, Calendar, ShieldCheck, Download, ChevronRight, Star } from 'lucide-react';

const CertificateCard = ({ certificate, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative"
        >
            <Link to={`/honors/${certificate.id}`} className="block h-full">
                <div className="h-full bg-[#111111] border border-white/5 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col">
                    {/* Image Section */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-black">
                        <img
                            src={certificate.image?.trim() ? certificate.image : null}
                            alt={certificate.title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />

                        {/* Overlay Badge */}
                        <div className="absolute top-4 right-4">
                            <div className="w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                <Award size={18} className="text-white" />
                            </div>
                        </div>

                        {certificate.featured && (
                            <div className="absolute top-4 left-4">
                                <span className="bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1">
                                    <Star size={10} fill="black" /> Featured
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest border border-orange-500/20 px-2 py-0.5 rounded-full bg-orange-500/5">
                                {certificate.category}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                <Calendar size={10} />
                                {new Date(certificate.date).getFullYear()}
                            </span>
                        </div>

                        <h3 className="text-lg font-black text-white mb-2 leading-tight group-hover:text-orange-500 transition-colors line-clamp-2">
                            {certificate.title}
                        </h3>

                        <p className="text-sm text-gray-400 font-medium mb-4 line-clamp-2 flex-1">
                            {certificate.description}
                        </p>

                        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-bold text-gray-400">{certificate.issuer}</span>
                            </div>
                            <span className="flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                                View <ChevronRight size={14} className="text-orange-500" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default CertificateCard;

