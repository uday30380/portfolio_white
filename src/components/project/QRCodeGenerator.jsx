import React from 'react';
import { motion } from 'framer-motion';
import { X, Download } from 'lucide-react';
import QRCode from 'react-qr-code';

const QRCodeGenerator = ({ url, title, onClose }) => {
    const downloadQR = () => {
        const svg = document.getElementById("ProjectQRCode");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `${title.replace(/\s+/g, '-')}-QR-Code.png`;
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
                {/* Header ... */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-white">QR Code</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                {/* QR Code Display */}
                <div className="bg-white rounded-2xl p-6 mb-6 flex items-center justify-center">
                    <div style={{ height: "auto", margin: "0 auto", maxWidth: 256, width: "100%" }}>
                        <QRCode
                            id="ProjectQRCode"
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={url}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                </div>

                {/* Project Title ... */}
                <p className="text-center text-gray-400 mb-6 font-medium">
                    Scan to view: <span className="text-white font-bold">{title}</span>
                </p>

                {/* Download Button */}
                <button
                    onClick={downloadQR}
                    className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-orange-500/30 transition-all font-black uppercase text-xs tracking-widest"
                >
                    <Download size={20} />
                    <span>Download QR Code</span>
                </button>

                {/* URL Display */}
                <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">URL</p>
                    <p className="text-sm text-gray-300 break-all font-mono">{url}</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default QRCodeGenerator;

