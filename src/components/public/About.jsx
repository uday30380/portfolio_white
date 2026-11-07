import React from 'react';
import { useData } from '../../context/DataContext';

const timeline = [
    {
        year: 'Year 4 · 2025 – 2026',
        title: 'Full-stack engineering & graduation',
        desc: 'Architecting modern cloud-connected web applications and production systems. Preparing for full-time engineering and product roles.'
    },
    {
        year: 'Year 3 · 2024 – 2025',
        title: 'Design leadership & client work',
        desc: 'Appointed Provision Wing Lead for graphic design at FOCUS Club. Delivered brand identity systems for Eswar Gold & Silver and recognized by Canva for design excellence.'
    },
    {
        year: 'Year 2 · 2023 – 2024',
        title: 'App publishing & web administration',
        desc: 'Independently designed, built, and published an app on the Amazon App Store. Joined the RPA Club at KL University as Web Administrator and Lead Designer.'
    },
    {
        year: 'Year 1 · 2022 – 2023',
        title: 'Foundations & hackathons',
        desc: 'Started B.Tech in Computer Science at KL University. Focused on Java, data structures, multithreading, and participated in university-wide hackathons.'
    }
];

const About = () => {
    const { data } = useData() || {};
    const bioText = data?.about?.text1 ||
        "I'm a Computer Science student at KL University with a focus on full-stack software development and digital product design. Over the last four years, I've combined disciplined engineering with hands-on creative leadership — publishing a mobile app on the Amazon App Store, building enterprise portals, and directing visual communications for student clubs and real-world clients.";

    return (
        <section id="about" className="py-16 md:py-24 bg-[#F7FAFA] border-t border-[#DDE7E5]">
            <div className="max-w-[1100px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Bio */}
                    <div className="md:col-span-5">
                        <h2 className="text-2xl md:text-3xl font-semibold text-[#102A28] mb-4">
                            About me
                        </h2>
                        <p className="text-base text-[#4B5F5C] leading-relaxed mb-6">
                            {bioText}
                        </p>
                        <p className="text-base text-[#4B5F5C] leading-relaxed">
                            I enjoy working where engineering rigor meets thoughtful user experience. My goal is simple: build software that solves actual problems and feels intuitive from the very first click.
                        </p>
                    </div>

                    {/* Right Column: 4-Year Timeline */}
                    <div className="md:col-span-7">
                        <h3 className="text-xl font-semibold text-[#102A28] mb-6">
                            4 years at KL University
                        </h3>

                        <div className="relative pl-6 border-l border-[#DDE7E5] space-y-8">
                            {timeline.map((item, index) => (
                                <div key={index} className="relative">
                                    {/* Timeline Marker Dot */}
                                    <div
                                        className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#FFFFFF] border-2 border-[#0F766E]"
                                        aria-hidden="true"
                                    />

                                    <div className="text-xs font-medium text-[#8A9B98] mb-1">
                                        {item.year}
                                    </div>
                                    <div className="text-base font-semibold text-[#102A28] mb-1">
                                        {item.title}
                                    </div>
                                    <p className="text-sm text-[#4B5F5C] leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;