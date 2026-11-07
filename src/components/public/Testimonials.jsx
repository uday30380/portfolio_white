import React from 'react';
import { useData } from '../../context/DataContext';

const defaultTestimonials = [
    {
        id: 1,
        quote: "We collaborated with Uday Kiran from Vempati Creations for our brand and cover song poster designs. We were truly impressed by his attention to detail, visual balance, and distinct creative direction. A true professional.",
        author: "ESWAR GOLD AND SILVER",
        role: "Brand Collaboration Client"
    },
    {
        id: 2,
        quote: "Uday brings a rare mix of strong technical discipline and creative vision to our university club initiatives. When he takes on a project, you know it will ship cleanly and look exceptional.",
        author: "FOCUS Club Executive Team",
        role: "KL University"
    },
    {
        id: 3,
        quote: "Always dependable under deadlines. His ability to build multithreaded software and immediately translate requirements into working code made a real difference in our technical projects.",
        author: "RPA Club Faculty & Peers",
        role: "Engineering Collaboration"
    }
];

const Testimonials = () => {
    const { data } = useData() || {};

    const list = (data?.testimonials && data.testimonials.length > 0)
        ? data.testimonials.slice(0, 3).map((t, idx) => ({
            id: t.id || idx,
            quote: t.text || t.quote,
            author: t.name || t.author || 'Collaborator',
            role: [t.role, t.company].filter(Boolean).join(', ') || 'Client'
        }))
        : defaultTestimonials;

    return (
        <section id="testimonials" className="py-16 md:py-24 bg-[#EEF4F3] border-t border-[#DDE7E5]">
            <div className="max-w-[1100px] mx-auto px-6">
                <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#102A28] mb-3">
                        Testimonials
                    </h2>
                    <p className="text-base text-[#4B5F5C] max-w-[620px]">
                        What clients, mentors, and teammates say about working with me.
                    </p>
                </div>

                {/* Static Grid (No carousel) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {list.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#FFFFFF] border border-[#DDE7E5] rounded-xl p-6 shadow-sm hover:border-[#7CC7BD] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                        >
                            <p className="text-base text-[#4B5F5C] leading-relaxed mb-6 italic">
                                "{item.quote}"
                            </p>

                            <div className="pt-4 border-t border-[#DDE7E5]">
                                <div className="text-sm font-semibold text-[#102A28]">
                                    {item.author}
                                </div>
                                <div className="text-xs text-[#8A9B98]">
                                    {item.role}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
