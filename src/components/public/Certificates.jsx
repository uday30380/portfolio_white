import React from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';

const fallbackHonors = [
    {
        id: 'canva-rec',
        title: 'Officially Recognized by Canva',
        issuer: 'Canva',
        date: '2025',
    },
    {
        id: 'focus-lead',
        title: 'Provision Wing Lead – Graphic Design',
        issuer: 'FOCUS Club, KL University',
        date: '2025',
    },
    {
        id: 'amazon-pub',
        title: 'Mobile App Publisher',
        issuer: 'Amazon App Store',
        date: '2024',
    },
    {
        id: 'rpa-admin',
        title: 'Web Administrator & Designer',
        issuer: 'RPA Club, KL University',
        date: '2024',
    },
    {
        id: 'canva-cert',
        title: 'Canva for Work & Design Essentials',
        issuer: 'Canva Certification',
        date: '2024',
    },
    {
        id: 'merit-cid',
        title: 'State Portal Recognition',
        issuer: 'CID Andhra Pradesh',
        date: '2023',
    }
];

const Certificates = () => {
    const { data } = useData() || {};

    const rawList = [
        ...(data?.honors || []).map(h => ({
            id: `honor-${h.id}`,
            title: h.title,
            issuer: h.issuer || h.organization || 'KL University',
            date: h.date || h.year || '2025'
        })),
        ...(data?.certificates || []).map(c => ({
            id: `cert-${c.id}`,
            title: c.title,
            issuer: c.issuer || c.organization || 'Industry Certification',
            date: c.date || c.year || '2024'
        })),
        ...(data?.achievements || []).map(a => ({
            id: `achieve-${a.id}`,
            title: a.title,
            issuer: a.organization || 'Recognition',
            date: a.date || '2024'
        }))
    ];

    const displayList = rawList.length >= 4 ? rawList.slice(0, 6) : fallbackHonors;

    return (
        <section id="honors" className="py-16 md:py-24 bg-[#F7FAFA] border-t border-[#DDE7E5]">
            <div className="max-w-[1100px] mx-auto px-6">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold text-[#102A28] mb-2">
                            Honors and certifications
                        </h2>
                        <p className="text-base text-[#4B5F5C]">
                            Recent awards, official recognitions, and professional credentials.
                        </p>
                    </div>

                    <Link
                        to="/honors"
                        className="link-accent shrink-0 text-sm"
                    >
                        <span>See all honors & certifications</span>
                        <ArrowRight size={15} />
                    </Link>
                </div>

                {/* 6 Compact Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {displayList.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#FFFFFF] border border-[#DDE7E5] rounded-xl p-5 shadow-sm hover:border-[#7CC7BD] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-8 h-8 rounded-lg bg-[#E6F4F2] text-[#0F766E] flex items-center justify-center mb-3">
                                    <Award size={16} />
                                </div>
                                <h3 className="text-base font-semibold text-[#102A28] mb-1.5 line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-[#4B5F5C] mb-4">
                                    {item.issuer}
                                </p>
                            </div>

                            <span className="text-xs font-medium text-[#8A9B98]">
                                {item.date}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certificates;
