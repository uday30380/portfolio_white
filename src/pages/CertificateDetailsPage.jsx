import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { ArrowLeft, ZoomIn, ZoomOut, QrCode, Printer, Share2, Download, ExternalLink, ShieldCheck, CheckCircle, Home, Award, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';

const CertificateDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data } = useData();
    const [zoom, setZoom] = useState(1);
    const [showQR, setShowQR] = useState(false);
    const [certificate, setCertificate] = useState(null);

    useEffect(() => {
        if (!data) return;

        let foundCert = null;

        if (id.startsWith('cert-')) {
            const actualId = id.replace('cert-', '');
            foundCert = (data.certificates || []).find(c => c.id.toString() === actualId);
            if (foundCert) {
                foundCert = { ...foundCert, category: foundCert.category || 'Certification' };
            }
        } else if (data.honors) {
            foundCert = data.honors.find(h => h.id.toString() === id);
        }

        if (foundCert) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCertificate(prev => {
                if (prev?.id === foundCert?.id && prev?.category === foundCert?.category) return prev;
                return foundCert;
            });
        }
    }, [id, data]);

    if (!certificate && data?.honors) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Award size={48} className="text-gray-500" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Certificate Not Found</h2>
                <p className="text-gray-400 mb-8 max-w-md">The certificate you are looking for might have been removed or the link is incorrect.</p>
                <button
                    onClick={() => navigate('/honors')}
                    className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold uppercase tracking-widest transition-all"
                >
                    Back to Honors
                </button>
            </div>
        );
    }

    if (!certificate) return <div className="min-h-screen bg-black text-white flex items-center justify-center"><div className="animate-pulse font-mono">Loading Credentials...</div></div>;

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));

    const handlePrint = () => {
        const win = window.open('', '', 'height=700,width=1000');
        win.document.write('<html><head><title>Print Certificate</title></head><body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh;">');
        win.document.write(`<img src="${certificate.image}" style="max-width:100%; max-height:100vh;" />`);
        win.document.write('</body></html>');
        win.document.close();
        setTimeout(() => win.print(), 500);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: certificate.title,
                    text: `Check out my ${certificate.title} award from ${certificate.issuer}!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing', error);
            }
        } else {
            await navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    // Use a reliable QR code API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}&bgcolor=ffffff&color=000000&margin=10`;

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/honors')}
                        className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
                    >
                        <div className="p-2.5 bg-white/5 rounded-full group-hover:bg-white/10 transition-all border border-white/5 group-hover:border-white/20">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="font-bold uppercase tracking-wider text-xs hidden md:block">Back to Awards</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-mono text-gray-500 uppercase">
                            ID: {certificate.credentialId || 'REF-' + certificate.id}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:h-[80vh]">
                    {/* Left: Interactive Viewer */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 bg-[#0a0a0a] rounded-[32px] border border-white/10 relative flex flex-col overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                            <button onClick={handleZoomIn} className="p-3 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-md border border-white/10 transition-all"><ZoomIn size={20} /></button>
                            <button onClick={handleZoomOut} className="p-3 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-md border border-white/10 transition-all"><ZoomOut size={20} /></button>
                        </div>

                        <div className="flex-1 flex items-center justify-center overflow-auto p-4 md:p-10 custom-scrollbar bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100" id="certificate-print-area">
                            <motion.div
                                style={{ scale: zoom }}
                                className="relative shadow-2xl shadow-black/50"
                            >
                                <img
                                    src={certificate.image}
                                    alt={certificate.title}
                                    className="max-w-full max-h-[60vh] lg:max-h-[70vh] object-contain rounded-sm bg-white"
                                />
                            </motion.div>
                        </div>

                        {/* Controls Bar */}
                        <div className="bg-[#111] border-t border-white/10 p-4 md:p-6 flex flex-wrap gap-4 justify-between items-center z-30">
                            <div className="flex gap-2">
                                <button onClick={() => setShowQR(!showQR)} className={`p-3 rounded-xl transition-all border ${showQR ? 'bg-orange-500 text-white border-orange-500' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'}`} title="QR Code">
                                    <QrCode size={20} />
                                </button>
                                <button onClick={handlePrint} className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all border border-white/5" title="Print">
                                    <Printer size={20} />
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleShare} className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all text-xs font-black uppercase tracking-widest text-white">
                                    <Share2 size={16} /> <span className="hidden sm:inline">Share</span>
                                </button>
                                <a href={certificate.image} download className="flex items-center gap-2 px-5 py-3 bg-white text-black hover:bg-gray-200 rounded-xl transition-all text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                    <Download size={16} /> <span className="hidden sm:inline">Download</span>
                                </a>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showQR && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="absolute bottom-24 left-6 z-40 bg-white p-4 rounded-2xl shadow-2xl max-w-[200px]"
                                >
                                    <div className="bg-white rounded-xl overflow-hidden">
                                        <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                                    </div>
                                    <p className="mt-3 text-center text-black font-bold text-[10px] uppercase tracking-widest">Scan to Verify</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Right: Metadata Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="w-full lg:w-[400px] flex flex-col gap-6"
                    >
                        <div className="bg-[#0a0a0a] p-8 rounded-[32px] border border-white/10 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-3 mb-8">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${certificate.category === 'Award' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                    certificate.category === 'Certification' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                        'bg-purple-500/10 text-purple-500 border-purple-500/20'
                                    }`}>
                                    {certificate.category}
                                </span>
                                {certificate.featured && (
                                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20">
                                        <ShieldCheck size={12} /> Verified
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl font-black text-white leading-tight mb-2">{certificate.title}</h1>

                            <div className="flex items-center gap-2 mb-8 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <Calendar size={14} />
                                Issued on {new Date(certificate.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>

                            <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="w-12 h-12 rounded-full bg-[#111] flex items-center justify-center text-xl font-black border border-white/10 text-white">
                                    {certificate.issuer[0]}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Issued By Organisation</p>
                                    <p className="text-white font-bold">{certificate.issuer}</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
                                        Credential Details
                                    </h3>
                                    <p className="text-gray-300 leading-7 font-medium text-sm">
                                        {certificate.description || "No description provided for this credential."}
                                    </p>
                                </div>

                                {certificate.skills && certificate.skills.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                                            Validates Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {certificate.skills.map(skill => (
                                                <span key={skill} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-gray-300 flex items-center gap-2 transition-colors cursor-default">
                                                    <CheckCircle className="text-green-500" size={12} /> {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <a
                            href={certificate.verificationLink || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center gap-2 w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-[0.98] ${certificate.verificationLink
                                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {certificate.verificationLink ? (
                                <>
                                    <ExternalLink size={16} /> Verify Authenticity
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={16} /> No Verification Link
                                </>
                            )}
                        </a>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CertificateDetailsPage;
