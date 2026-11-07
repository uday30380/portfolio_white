import React from 'react';

const skillGroups = [
    {
        title: 'Frontend',
        skills: [
            'React',
            'JavaScript (ES6+)',
            'Tailwind CSS',
            'HTML5 & Modern CSS',
            'Responsive web design',
            'State management',
            'Component architecture'
        ]
    },
    {
        title: 'Backend and Cloud',
        skills: [
            'Java (OOP & Multithreading)',
            'Firebase (Firestore, Auth, Storage)',
            'REST APIs',
            'Node.js basics',
            'SQL & database design',
            'Git & GitHub version control',
            'Web deployment & hosting'
        ]
    },
    {
        title: 'Design',
        skills: [
            'Figma',
            'Canva (Certified)',
            'UI/UX wireframing & prototyping',
            'Visual identity & branding',
            'Design systems',
            'Typography & layout',
            'Creative direction'
        ]
    }
];

const Skills = () => {
    return (
        <section id="skills" className="py-16 md:py-24 bg-[#EEF4F3] border-t border-[#DDE7E5]">
            <div className="max-w-[1100px] mx-auto px-6">
                <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#102A28] mb-3">
                        Skills & capabilities
                    </h2>
                    <p className="text-base text-[#4B5F5C] max-w-[620px]">
                        The languages, frameworks, and creative tools I work with daily across software engineering and product design.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {skillGroups.map((group) => (
                        <div
                            key={group.title}
                            className="bg-[#FFFFFF] border border-[#DDE7E5] rounded-xl p-6 shadow-sm hover:border-[#7CC7BD] hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <h3 className="text-lg font-semibold text-[#102A28] mb-5 pb-3 border-b border-[#DDE7E5]">
                                {group.title}
                            </h3>

                            <ul className="space-y-3">
                                {group.skills.map((skill, index) => (
                                    <li
                                        key={index}
                                        className="text-sm text-[#4B5F5C] flex items-center gap-2.5"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E]" aria-hidden="true" />
                                        <span>{skill}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;