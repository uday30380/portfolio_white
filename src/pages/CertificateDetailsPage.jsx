import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Printer, Share2, Download, ExternalLink, Award, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import SEO from '../components/public/SEO';

const CertificateDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data } = useData();
    const [zoom, setZoom] = useState(1);
    const [copied, setCopied] = useState(false);

    const certificate = useMemo(() => {
        if (!data) return null;

        if (id?.startsWith('cert-')) {
            const actualId = id.replace('cert-', '');
            const foundCert = (data.certificates || []).find(c => c.id.toString() === actualId);
            if (foundCert) {
                return { ...foundCert, category: foundCert.category || 'Certification' };
            }
        } else if (data.honors) {
            return data.honors.find(h => h.id.toString() === id) || null;
        }

        return null;
    }, [id, data]);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 1));

    const handlePrint = () => {
        const win = window.open('', '', 'height=700,width=1000');
        if (!win) return;
        win.document.write('<html><head><title>Print certificate</title></head><body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh; background:#fff;">');
        if (certificate?.image?.trim()) {
            win.document.write(`<img src="${certificate.image}" style="max-width:100%; max-height:100vh; object-contain;" />`);
        }
        win.document.write('</body></html>');
        win.document.close();
        setTimeout(() => win.print(), 500);
    };

    const handleShare = async () => {
        if (navigator.share && certificate) {
            try {
                await navigator.share({
                    title: certificate.title,
                    text: `Check out my ${certificate.title} credential from ${certificate.issuer}!`,
                    url: window.location.href,
                });
            } catch {
                // user cancelled
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch {
                // clipboard failed
            }
        }
    };

    if (!certificate && data?.honors) {
        return (
            <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] flex flex-col">
                <Navbar />
                <main className="flex-1 max-w-[1100px] w-full mx-auto px-6 py-24 flex items-center justify-center">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-[#EEF4F3] border border-[#DDE7E5] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Award size={32} className="text-[#8A9B98]" />
                        </div>
                        <h1 className="text-2xl font-semibold text-[#102A28] mb-3">Certificate not found</h1>
                        <p className="text-[#4B5F5C] text-base mb-8">
                            The certificate you are looking for might have been removed or the link is incorrect.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate('/honors')}
                            className="btn-primary"
                        >
                            Back to honors
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!certificate) {
        return (
            <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm text-[#8A9B98]">Loading certificate...</p>
                </div>
                <Footer />
            </div>
        );
    }

    const BASE_URL = 'https://udaykiranportfolio.web.app';
    const certPageUrl = `${BASE_URL}/certificate/${id}`;
    const certPageTitle = `${certificate.title} – Uday Kiran Vempati | ${certificate.issuer || 'Certificate'}`;
    const certPageDesc = `${certificate.title} certificate issued by ${certificate.issuer || 'an organization'} to Vempati Uday Kiran. Earned in ${certificate.date || 'recent years'}. View, download, or share this verified credential.`;

    const certSchema = [
        {
            '@type': 'EducationalOccupationalCredential',
            '@id': certPageUrl,
            name: certificate.title,
            url: certPageUrl,
            image: certificate.image,
            description: certPageDesc,
            dateCreated: certificate.date || undefined,
            credentialCategory: certificate.category || 'Certification',
            recognizedBy: { '@type': 'Organization', name: certificate.issuer || '' },
            about: { '@type': 'Person', name: 'Vempati Uday Kiran', url: BASE_URL },
        },
    ];

    const certImage = certificate.image?.trim() ? certificate.image : '/uday-portrait.png';

    return (
        <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] flex flex-col">
            <SEO
                pageTitle={certPageTitle}
                pageDescription={certPageDesc}
                pageImage={certificate.image}
                pageUrl={certPageUrl}
                extraSchemas={certSchema}
            />

            <Navbar />

            <main className="flex-1 py-12 md:py-16">
                <div className="max-w-[1100px] mx-auto px-6">
                    {/* Back link */}
                    <div className="mb-8">
                        <Link
                            to="/honors"
                            className="inline-flex items-center gap-2 text-sm font-medium text-[#4B5F5C] hover:text-[#0F766E] transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to honors and certifications
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Certificate Preview Card */}
                        <div className="lg:col-span-7 bg-white border border-[#DDE7E5] rounded-[12px] p-6 shadow-sm flex flex-col">
                            <div className="bg-[#EEF4F3] rounded-[8px] p-4 flex items-center justify-center min-h-[380px] md:min-h-[460px] overflow-hidden">
                                <div
                                    style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease-out' }}
                                    className="max-w-full"
                                >
                                    <img
                                        src={certImage}
                                        alt={certificate.title}
                                        onError={(e) => { e.currentTarget.src = '/uday-portrait.png'; }}
                                        className="max-w-full max-h-[500px] object-contain rounded-[4px] bg-white shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Viewer Controls */}
                            <div className="mt-4 pt-4 border-t border-[#DDE7E5] flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleZoomIn}
                                        disabled={zoom >= 2}
                                        className="btn-secondary !h-9 !px-3 text-xs disabled:opacity-50"
                                        title="Zoom in"
                                    >
                                        <ZoomIn size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleZoomOut}
                                        disabled={zoom <= 1}
                                        className="btn-secondary !h-9 !px-3 text-xs disabled:opacity-50"
                                        title="Zoom out"
                                    >
                                        <ZoomOut size={15} />
                                    </button>
                                    <span className="text-xs text-[#8A9B98] ml-1">
                                        {Math.round(zoom * 100)}%
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handlePrint}
                                        className="btn-secondary !h-9 !px-3 text-xs"
                                        title="Print"
                                    >
                                        <Printer size={15} />
                                        <span className="hidden sm:inline">Print</span>
                                    </button>
                                    {certificate.image && (
                                        <a
                                            href={certificate.image}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-secondary !h-9 !px-3 text-xs"
                                        >
                                            <Download size={15} />
                                            <span className="hidden sm:inline">Download</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Certificate Info Card */}
                        <div className="lg:col-span-5 bg-white border border-[#DDE7E5] rounded-[12px] p-6 md:p-8 shadow-sm space-y-6">
                            <div>
                                <span className="inline-block px-2.5 py-1 bg-[#E6F4F2] text-[#0F766E] text-xs font-medium rounded-[6px] mb-3">
                                    {certificate.category || 'Certification'}
                                </span>
                                <h1 className="text-2xl md:text-3xl font-semibold text-[#102A28] tracking-tight leading-tight mb-2">
                                    {certificate.title}
                                </h1>
                                <p className="text-sm text-[#8A9B98] flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    <span>Issued {certificate.date}</span>
                                </p>
                            </div>

                            <div className="p-4 bg-[#EEF4F3] rounded-[8px] border border-[#DDE7E5]">
                                <p className="text-xs text-[#8A9B98] mb-0.5">Issuing organization</p>
                                <p className="text-base font-medium text-[#102A28]">{certificate.issuer}</p>
                            </div>

                            {certificate.description && (
                                <div>
                                    <h2 className="text-sm font-semibold text-[#102A28] mb-2">About this credential</h2>
                                    <p className="text-sm text-[#4B5F5C] leading-relaxed">
                                        {certificate.description}
                                    </p>
                                </div>
                            )}

                            {certificate.skills && certificate.skills.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-semibold text-[#102A28] mb-2">Skills validated</h2>
                                    <div className="flex flex-wrap gap-1.5">
                                        {certificate.skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2.5 py-1 bg-[#E6F4F2] text-[#0F766E] text-xs rounded-[6px] border border-[#DDE7E5]"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-[#DDE7E5] flex flex-col gap-3">
                                {certificate.verificationLink && (
                                    <a
                                        href={certificate.verificationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary w-full"
                                    >
                                        <ExternalLink size={16} />
                                        <span>Verify credential</span>
                                    </a>
                                )}
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="btn-secondary w-full"
                                >
                                    <Share2 size={16} />
                                    <span>{copied ? 'Link copied' : 'Share credential'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CertificateDetailsPage;
