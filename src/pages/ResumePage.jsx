import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, ArrowLeft, Loader2 } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { downloadResumePdf } from '../utils/resumePdfGenerator';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import SEO from '../components/public/SEO';
import ResumeSheet from '../components/public/ResumeSheet';

const ResumePage = () => {
    const { resumeData, loading } = useResume();
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (downloading || !resumeData) return;
        setDownloading(true);
        try {
            await downloadResumePdf(resumeData);
        } catch (err) {
            console.error("PDF download failed:", err);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] flex flex-col justify-between">
            <SEO
                title="Resume | Uday Kiran Vempati"
                description="View and download the verified professional resume of Uday Kiran Vempati, Computer Science student (CGPA 9.52) and full-stack web developer."
            />

            <Navbar />

            {/* Sticky Action Bar under Navbar */}
            <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-[#DDE7E5] py-2.5 sm:py-3 shadow-xs">
                <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                    <div className="flex items-baseline justify-between sm:justify-start gap-2 sm:gap-3">
                        <span className="text-base font-semibold text-[#102A28]">Resume</span>
                        {resumeData?.updatedAt && (
                            <span className="text-xs text-[#8A9B98]">
                                Last updated: {resumeData.updatedAt}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            to="/"
                            className="btn-secondary !h-9 !px-3 sm:!px-3.5 text-xs inline-flex items-center gap-1.5 flex-1 sm:flex-initial justify-center"
                        >
                            <ArrowLeft size={14} />
                            <span>Back to portfolio</span>
                        </Link>

                        <button
                            type="button"
                            onClick={handleDownload}
                            disabled={downloading || loading}
                            className="btn-primary !h-9 !px-3.5 sm:!px-4 text-xs inline-flex items-center gap-1.5 disabled:opacity-60 cursor-pointer flex-1 sm:flex-initial justify-center"
                        >
                            {downloading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Preparing…</span>
                                </>
                            ) : (
                                <>
                                    <Download size={14} />
                                    <span>Download PDF</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Resume Sheet Container */}
            <main className="flex-1 py-8 md:py-14 px-4 sm:px-6">
                <div className="max-w-[820px] mx-auto">
                    {loading ? (
                        <div className="w-full bg-white border border-[#DDE7E5] rounded-[4px] p-8 md:p-12 animate-pulse space-y-6">
                            <div className="h-8 bg-[#EEF4F3] rounded w-1/2 mx-auto" />
                            <div className="h-4 bg-[#EEF4F3] rounded w-2/3 mx-auto" />
                            <div className="h-4 bg-[#EEF4F3] rounded w-1/3 mx-auto" />
                            <div className="border-b border-[#DDE7E5] my-6" />
                            <div className="space-y-3">
                                <div className="h-5 bg-[#EEF4F3] rounded w-1/4" />
                                <div className="h-16 bg-[#EEF4F3] rounded w-full" />
                            </div>
                            <div className="space-y-3 pt-4">
                                <div className="h-5 bg-[#EEF4F3] rounded w-1/4" />
                                <div className="h-20 bg-[#EEF4F3] rounded w-full" />
                            </div>
                        </div>
                    ) : (
                        <ResumeSheet resumeData={resumeData} />
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ResumePage;

