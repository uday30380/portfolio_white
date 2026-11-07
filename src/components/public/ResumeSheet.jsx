import React from 'react';

const cleanUrl = (url, prefix = 'https://') => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${prefix}${url}`;
};

const ResumeSheet = ({ resumeData }) => {
    if (!resumeData) return null;

    const {
        header = {},
        profile = '',
        education = [],
        projects = [],
        experience = [],
        achievements = [],
        skills = [],
        sectionOrder = ['profile', 'education', 'projects', 'experience', 'achievements', 'skills'],
        sectionVisible = {}
    } = resumeData;

    const visibleEducation = education
        .filter(item => item.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    const visibleProjects = projects
        .filter(item => item.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    const visibleExperience = experience
        .filter(item => item.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    const visibleAchievements = achievements
        .filter(item => item.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    const visibleSkills = skills
        .filter(item => item.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    const renderSection = (sectionKey) => {
        if (sectionVisible[sectionKey] === false) return null;

        switch (sectionKey) {
            case 'profile':
                if (!profile?.trim()) return null;
                return (
                    <section key="profile" className="mt-6 first:mt-0">
                        <h2 className="text-[13px] md:text-[14px] font-bold text-[#1E4D3A] uppercase tracking-wide pb-1 border-b border-[#1E4D3A] mb-2.5">
                            Profile
                        </h2>
                        <p className="text-[13px] md:text-[14px] leading-relaxed text-[#111111] text-justify">
                            {profile}
                        </p>
                    </section>
                );

            case 'education':
                if (visibleEducation.length === 0) return null;
                return (
                    <section key="education" className="mt-6">
                        <h2 className="text-[13px] md:text-[14px] font-bold text-[#1E4D3A] uppercase tracking-wide pb-1 border-b border-[#1E4D3A] mb-3">
                            Education
                        </h2>
                        <div className="space-y-3">
                            {visibleEducation.map((edu, idx) => {
                                const dateStr = [edu.startYear, edu.endYear].filter(Boolean).join(' – ') +
                                    (edu.endLabel ? ` ${edu.endLabel}` : '');

                                return (
                                    <div key={edu.id || idx} className="text-[13px] md:text-[14px]">
                                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                                            <span className="font-bold text-[#111111]">
                                                {edu.institution}{edu.location ? ` | ${edu.location}` : ''}
                                            </span>
                                            {dateStr && (
                                                <span className="text-[12px] md:text-[13px] text-[#333333] shrink-0">
                                                    {dateStr}
                                                </span>
                                            )}
                                        </div>
                                        <div className="italic text-[#222222] text-[12px] md:text-[13px]">
                                            {edu.degree}
                                        </div>
                                        {(edu.score || edu.note) && (
                                            <div className="text-[12px] md:text-[13px] text-[#111111]">
                                                {edu.scoreLabel ? `${edu.scoreLabel}: ` : ''}
                                                <span className="font-medium">{edu.score}</span> {edu.note || ''}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );

            case 'projects':
                if (visibleProjects.length === 0) return null;
                return (
                    <section key="projects" className="mt-6">
                        <h2 className="text-[13px] md:text-[14px] font-bold text-[#1E4D3A] uppercase tracking-wide pb-1 border-b border-[#1E4D3A] mb-3">
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {visibleProjects.map((proj, idx) => (
                                <div key={proj.id || idx} className="text-[13px] md:text-[14px]">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                                        <span className="font-bold text-[#111111]">
                                            {proj.title}
                                            {proj.role ? ` (${proj.role})` : ''}
                                        </span>
                                        {proj.dates && (
                                            <span className="text-[12px] md:text-[13px] text-[#333333] shrink-0">
                                                {proj.dates}
                                            </span>
                                        )}
                                    </div>
                                    <div className="italic text-[#222222] text-[12px] md:text-[13px]">
                                        {proj.techStack}
                                        {proj.link && (
                                            <>
                                                {' | Link: '}
                                                <a
                                                    href={cleanUrl(proj.link)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline hover:text-[#1E4D3A]"
                                                >
                                                    {proj.link}
                                                </a>
                                            </>
                                        )}
                                    </div>
                                    {proj.bullets && proj.bullets.length > 0 && (
                                        <ul className="list-disc list-outside pl-4 space-y-1 mt-1 text-[12.5px] md:text-[13.5px] text-[#111111] leading-relaxed">
                                            {proj.bullets.map((b, bIdx) => (
                                                <li key={bIdx}>{b}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'experience':
                if (visibleExperience.length === 0) return null;
                return (
                    <section key="experience" className="mt-6">
                        <h2 className="text-[13px] md:text-[14px] font-bold text-[#1E4D3A] uppercase tracking-wide pb-1 border-b border-[#1E4D3A] mb-3">
                            Experience & Leadership
                        </h2>
                        <div className="space-y-4">
                            {visibleExperience.map((exp, idx) => (
                                <div key={exp.id || idx} className="text-[13px] md:text-[14px]">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                                        <span className="font-bold text-[#111111]">
                                            {exp.role}{exp.mode ? ` (${exp.mode})` : ''}
                                        </span>
                                        {exp.dates && (
                                            <span className="text-[12px] md:text-[13px] text-[#333333] shrink-0">
                                                {exp.dates}
                                            </span>
                                        )}
                                    </div>
                                    <div className="italic text-[#222222] text-[12px] md:text-[13px]">
                                        {exp.organisation}
                                    </div>
                                    {exp.bullets && exp.bullets.length > 0 && (
                                        <ul className="list-disc list-outside pl-4 space-y-1 mt-1 text-[12.5px] md:text-[13.5px] text-[#111111] leading-relaxed">
                                            {exp.bullets.map((b, bIdx) => (
                                                <li key={bIdx}>{b}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'achievements':
                if (visibleAchievements.length === 0) return null;
                return (
                    <section key="achievements" className="mt-6">
                        <h2 className="text-[13px] md:text-[14px] font-bold text-[#1E4D3A] uppercase tracking-wide pb-1 border-b border-[#1E4D3A] mb-3">
                            Certifications & Achievements
                        </h2>
                        <ul className="list-disc list-outside pl-4 space-y-1.5 text-[12.5px] md:text-[13.5px] text-[#111111] leading-relaxed">
                            {visibleAchievements.map((ach, idx) => (
                                <li key={ach.id || idx}>{ach.text}</li>
                            ))}
                        </ul>
                    </section>
                );

            case 'skills':
                if (visibleSkills.length === 0) return null;
                return (
                    <section key="skills" className="mt-6">
                        <h2 className="text-[13px] md:text-[14px] font-bold text-[#1E4D3A] uppercase tracking-wide pb-1 border-b border-[#1E4D3A] mb-3">
                            Skills
                        </h2>
                        <div className="space-y-1.5 text-[12.5px] md:text-[13.5px]">
                            {visibleSkills.map((sk, idx) => (
                                <div key={sk.id || idx} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                                    <span className="font-bold text-[#111111] sm:min-w-[130px] shrink-0">
                                        {sk.label}:
                                    </span>
                                    <span className="text-[#111111] leading-snug">
                                        {sk.items}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            default:
                return null;
        }
    };

    return (
        <article
            className="w-full max-w-[820px] mx-auto bg-white border border-[#DDE7E5] rounded-[4px] shadow-sm p-4 sm:p-8 md:p-12 text-[#111111] font-serif select-text overflow-hidden break-words"
            style={{
                fontFamily: '"Times New Roman", Times, Georgia, serif',
            }}
        >
            {/* Header */}
            <header className="text-center pb-3 border-b border-transparent">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E4D3A] uppercase mb-1">
                    {header.name || 'UDAY KIRAN VEMPATI'}
                </h1>

                {header.degreeLine && (
                    <p className="text-[13px] sm:text-[14px] text-[#222222] mb-1.5 font-normal">
                        {header.degreeLine}
                    </p>
                )}

                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12px] sm:text-[13px] text-[#222222] mb-1">
                    {header.phone && (
                        <a
                            href={`tel:${header.phone.replace(/\s+/g, '')}`}
                            className="hover:text-[#1E4D3A] underline-offset-2 hover:underline"
                        >
                            {header.phone}
                        </a>
                    )}

                    {header.phone && header.email && <span className="text-[#888888]">|</span>}

                    {header.email && (
                        <a
                            href={`mailto:${header.email}`}
                            className="hover:text-[#1E4D3A] underline-offset-2 hover:underline"
                        >
                            {header.email}
                        </a>
                    )}

                    {(header.phone || header.email) && header.linkedin && (
                        <span className="text-[#888888]">|</span>
                    )}

                    {header.linkedin && (
                        <a
                            href={cleanUrl(header.linkedin)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#1E4D3A] underline-offset-2 hover:underline"
                        >
                            {header.linkedin}
                        </a>
                    )}

                    {(header.phone || header.email || header.linkedin) && header.github && (
                        <span className="text-[#888888]">|</span>
                    )}

                    {header.github && (
                        <a
                            href={cleanUrl(header.github)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#1E4D3A] underline-offset-2 hover:underline"
                        >
                            {header.github}
                        </a>
                    )}
                </div>

                {header.portfolio && (
                    <div className="text-[12px] sm:text-[13px] text-[#222222]">
                        <span className="font-bold">Portfolio: </span>
                        <a
                            href={cleanUrl(header.portfolio)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-[#1E4D3A]"
                        >
                            {header.portfolio}
                        </a>
                    </div>
                )}
            </header>

            {/* Configured sections in sectionOrder */}
            <div className="mt-2">
                {sectionOrder.map(sectionKey => renderSection(sectionKey))}
            </div>
        </article>
    );
};

export default ResumeSheet;

