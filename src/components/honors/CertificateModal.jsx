import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { X, Download, Share2, ExternalLink, QrCode, Printer, ZoomIn, ZoomOut, CheckCircle, ShieldCheck } from 'lucide-react';
import QRCode from 'react-qr-code';

const CertificateModal = ({ certificate, onClose }) => {
    const [zoom, setZoom] = useState(1);
    const [showQR, setShowQR] = useState(false);

    if (!certificate) return null;

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));

    const handlePrint = () => {
        const printContent = document.getElementById('certificate-print-area');
        const win = window.open('', '', 'height=700,width=1000');
        win.document.write('<html><head><title>Print Certificate</title></head><body>');
        win.document.write(printContent.innerHTML);
        win.document.write('</body></html>');
        win.document.close();
        win.print();
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: certificate.title,
                    text: `Check out my ${certificate.title} award!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing', error);
            }
        } else {
            alert('Share copied to clipboard!');
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                onClick={onClose}
            >
                <div onClick={e => e.stopPropagation()} className="relative w-full max-w-6xl h-[90vh] bg-[#0A0A0A] rounded-[40px] border border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden">

                    {/* Left: Image Viewer */}
                    <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden p-8 group">
                        <div className="absolute top-6 left-6 z-20 flex gap-2">
                            <button onClick={handleZoomIn} className="p-3 bg-black/50 hover:bg-white/10 text-white rounded-xl backdrop-blur-md border border-white/10 transition-all"><ZoomIn size={20} /></button>
                            <button onClick={handleZoomOut} className="p-3 bg-black/50 hover:bg-white/10 text-white rounded-xl backdrop-blur-md border border-white/10 transition-all"><ZoomOut size={20} /></button>
                        </div>

                        <div className="overflow-auto w-full h-full flex items-center justify-center no-scrollbar" id="certificate-print-area">
                            <motion.img
                                src={certificate.image}
                                alt={certificate.title}
                                style={{ scale: zoom }}
                                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg transition-transform duration-200"
                            />
                        </div>

                        {/* QR Code Overlay */}
                        <AnimatePresence>
                            {showQR && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
                                    onClick={() => setShowQR(false)}
                                >
                                    <div className="bg-white p-6 rounded-3xl shadow-2xl text-center">
                                        <div className="bg-white p-2 rounded-xl">
                                            <QRCode value={window.location.href} size={200} />
                                        </div>
                                        <p className="mt-4 text-black font-bold text-sm uppercase tracking-widest">Scan to Verify</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: Details Panel */}
                    <div className="w-full md:w-[400px] bg-[#111111] border-l border-white/5 flex flex-col">
                        <div className="p-8 border-b border-white/5 flex justify-between items-start">
                            <div className="flex-1 pr-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${certificate.category === 'Award' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                        certificate.category === 'Certification' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                            'bg-purple-500/10 text-purple-500 border-purple-500/20'
                                        }`}>
                                        {certificate.category}
                                    </span>
                                    {certificate.featured && (
                                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-orange-500">
                                            <ShieldCheck size={12} /> Verified
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-black text-white leading-tight mb-2">{certificate.title}</h2>
                                <p className="text-gray-400 font-medium text-sm">{certificate.issuer}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
                            <div>
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Description</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {certificate.description}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Validated Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {certificate.skills?.map(skill => (
                                        <span key={skill} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-gray-300 flex items-center gap-2 hover:bg-white/10 transition-colors cursor-default">
                                            <CheckCircle className="text-green-500" size={12} /> {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Issue Date</p>
                                    <p className="text-white font-bold">{new Date(certificate.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Credential ID</p>
                                    <p className="text-white font-mono text-xs truncate" title={certificate.credentialId}>{certificate.credentialId || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="p-8 border-t border-white/5 bg-[#0A0A0A] space-y-3">
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                <button onClick={() => setShowQR(!showQR)} className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group" title="QR Code">
                                    <QrCode size={20} className="text-gray-400 group-hover:text-white" />
                                    <span className="text-[10px] font-bold text-gray-500">QR</span>
                                </button>
                                <button onClick={handlePrint} className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group" title="Print">
                                    <Printer size={20} className="text-gray-400 group-hover:text-white" />
                                    <span className="text-[10px] font-bold text-gray-500">Print</span>
                                </button>
                                <button onClick={handleShare} className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group" title="Share">
                                    <Share2 size={20} className="text-gray-400 group-hover:text-white" />
                                    <span className="text-[10px] font-bold text-gray-500">Share</span>
                                </button>
                                <a href={certificate.image} download className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group" title="Download">
                                    <Download size={20} className="text-gray-400 group-hover:text-white" />
                                    <span className="text-[10px] font-bold text-gray-500">Save</span>
                                </a>
                            </div>

                            <a
                                href={certificate.verificationLink || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95"
                            >
                                <ExternalLink size={16} /> Verify Credential
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CertificateModal;
