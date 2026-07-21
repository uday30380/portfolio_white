import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ExternalLink, Award, ShieldCheck, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';

const Certificates = () => {
    const { data } = useData();
    const navigate = useNavigate();

    const combinedCertificates = React.useMemo(() => {
        const certs = (data?.certificates || []).map(c => ({
            ...c,
            id: `cert-${c.id}` // Match prefix for CertificateDetailsPage
        }));
        const honors = (data?.honors || []).map(h => ({
            ...h,
            id: h.id // Already has safe ID from AdminHonors
        }));
        return [...certs, ...honors];
    }, [data]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    return (
        <section id="certificates" className="py-32 bg-[#050505] relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
                >
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-[2px] bg-gradient-to-r from-orange-500 to-transparent"></div>
                            <span className="text-sm font-bold tracking-[0.3em] text-orange-500 uppercase flex items-center gap-2">
                                <ShieldCheck size={16} /> Validated Skills
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tight mt-4">
                            HONORS <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">
                                & AWARDS
                            </span>
                        </h2>
                    </div>

                    <div className="md:text-right w-full md:max-w-xs">
                        <p className="text-gray-400 font-medium leading-relaxed">
                            A showcase of professional certifications and industry recognitions validating my technical expertise.
                        </p>
                    </div>
                </motion.div>

                {/* Certificates Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                    {combinedCertificates.map((cert) => (
                        <motion.div
                            key={cert.id}
                            variants={item}
                            whileHover={{ y: -10, scale: 1.02 }}
                            onClick={() => navigate(`/certificate/${cert.id}`)}
                            className="group relative block h-full select-none cursor-pointer"
                        >
                            {/* Hover Shimmer Effect */}
                            <div className="absolute inset-0 z-10 overflow-hidden rounded-[2rem] pointer-events-none">
                                <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:animate-shimmer" />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] blur-xl -z-10"></div>

                            <div className="relative h-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden group-hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col">

                                {/* Image Area */}
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10"></div>
                                    <img
                                        src={cert.image}
                                        alt={cert.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                                    />

                                    {/* Floating Badge */}
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500"
                                    >
                                        <ExternalLink size={20} className="text-white" />
                                    </motion.div>
                                </div>

                                {/* Content Area */}
                                <div className="p-8 flex-1 flex flex-col relative z-20 -mt-10">
                                    <div className="w-14 h-14 bg-[#111] rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:border-orange-500/50 transition-all duration-500">
                                        <Award size={28} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-orange-500 transition-colors">
                                        {cert.title}
                                    </h3>

                                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Issued By</span>
                                            <span className="text-sm font-bold text-gray-300">{cert.issuer}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Date</span>
                                            <span className="text-sm font-bold text-gray-300">{cert.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State / Decorative Element if no certs */}
                {combinedCertificates.length === 0 && (
                    <div className="text-center py-20 opacity-30">
                        <Sparkles size={48} className="mx-auto mb-4 text-white" />
                        <p className="text-sm font-black uppercase tracking-widest">Credentials Loading...</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Certificates;
