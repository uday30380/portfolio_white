import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        size: 'A4',
        paddingTop: 36,
        paddingBottom: 36,
        paddingLeft: 40,
        paddingRight: 40,
        fontFamily: 'Times-Roman',
        fontSize: 9.5,
        lineHeight: 1.3,
        color: '#111111',
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
    },
    name: {
        fontFamily: 'Times-Bold',
        fontSize: 18,
        color: '#1E4D3A',
        letterSpacing: 0.5,
        textAlign: 'center',
        marginBottom: 3,
        textTransform: 'uppercase',
    },
    degreeLine: {
        fontSize: 9.5,
        textAlign: 'center',
        color: '#222222',
        marginBottom: 3,
    },
    contactLine: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 9,
        color: '#222222',
        marginBottom: 2,
    },
    link: {
        color: '#111111',
        textDecoration: 'none',
    },
    separator: {
        marginHorizontal: 4,
        color: '#666666',
    },
    section: {
        marginTop: 8,
        marginBottom: 2,
    },
    sectionHeading: {
        fontFamily: 'Times-Bold',
        fontSize: 11,
        color: '#1E4D3A',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        paddingBottom: 2,
        borderBottomWidth: 0.75,
        borderBottomColor: '#1E4D3A',
        marginBottom: 5,
    },
    profileText: {
        fontSize: 9.5,
        textAlign: 'justify',
        lineHeight: 1.35,
        color: '#111111',
    },
    entryBlock: {
        marginBottom: 5,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    entryTitle: {
        fontFamily: 'Times-Bold',
        fontSize: 9.5,
        color: '#111111',
        flex: 1,
        paddingRight: 8,
    },
    entryDates: {
        fontSize: 9,
        color: '#333333',
        textAlign: 'right',
    },
    entrySubtitle: {
        fontFamily: 'Times-Italic',
        fontSize: 9,
        color: '#222222',
        marginTop: 1,
        marginBottom: 2,
    },
    bulletList: {
        marginTop: 1,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 1.5,
    },
    bulletDot: {
        width: 10,
        fontSize: 9,
        color: '#111111',
    },
    bulletContent: {
        flex: 1,
        fontSize: 9,
        lineHeight: 1.3,
        color: '#111111',
    },
    skillRow: {
        flexDirection: 'row',
        marginBottom: 2.5,
        lineHeight: 1.25,
    },
    skillLabel: {
        fontFamily: 'Times-Bold',
        fontSize: 9,
        color: '#111111',
        width: 110,
    },
    skillItems: {
        flex: 1,
        fontSize: 9,
        color: '#111111',
    },
    achievementRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 2.5,
    },
});

const cleanUrl = (url, prefix = 'https://') => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${prefix}${url}`;
};

const ResumePdfDocument = ({ resumeData }) => {
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
                    <View key="profile" style={styles.section}>
                        <Text style={styles.sectionHeading}>Profile</Text>
                        <Text style={styles.profileText}>{profile}</Text>
                    </View>
                );

            case 'education':
                if (visibleEducation.length === 0) return null;
                return (
                    <View key="education" style={styles.section}>
                        <Text style={styles.sectionHeading}>Education</Text>
                        {visibleEducation.map((edu, idx) => {
                            const dateStr = [edu.startYear, edu.endYear].filter(Boolean).join(' – ') +
                                (edu.endLabel ? ` ${edu.endLabel}` : '');

                            return (
                                <View key={edu.id || idx} style={styles.entryBlock}>
                                    <View style={styles.entryHeader}>
                                        <Text style={styles.entryTitle}>
                                            {edu.institution}{edu.location ? ` | ${edu.location}` : ''}
                                        </Text>
                                        {dateStr ? <Text style={styles.entryDates}>{dateStr}</Text> : null}
                                    </View>
                                    <Text style={styles.entrySubtitle}>{edu.degree}</Text>
                                    {(edu.score || edu.note) && (
                                        <Text style={styles.bulletContent}>
                                            {edu.scoreLabel ? `${edu.scoreLabel}: ` : ''}{edu.score} {edu.note || ''}
                                        </Text>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                );

            case 'projects':
                if (visibleProjects.length === 0) return null;
                return (
                    <View key="projects" style={styles.section}>
                        <Text style={styles.sectionHeading}>Projects</Text>
                        {visibleProjects.map((proj, idx) => (
                            <View key={proj.id || idx} style={styles.entryBlock}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryTitle}>
                                        {proj.title}
                                        {proj.role ? ` (${proj.role})` : ''}
                                    </Text>
                                    {proj.dates ? <Text style={styles.entryDates}>{proj.dates}</Text> : null}
                                </View>
                                <Text style={styles.entrySubtitle}>
                                    {proj.techStack}
                                    {proj.link ? ` | Link: ${proj.link}` : ''}
                                </Text>
                                {proj.bullets && proj.bullets.length > 0 && (
                                    <View style={styles.bulletList}>
                                        {proj.bullets.map((b, bIdx) => (
                                            <View key={bIdx} style={styles.bulletRow}>
                                                <Text style={styles.bulletDot}>•</Text>
                                                <Text style={styles.bulletContent}>{b}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                );

            case 'experience':
                if (visibleExperience.length === 0) return null;
                return (
                    <View key="experience" style={styles.section}>
                        <Text style={styles.sectionHeading}>Experience & Leadership</Text>
                        {visibleExperience.map((exp, idx) => (
                            <View key={exp.id || idx} style={styles.entryBlock}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryTitle}>
                                        {exp.role}{exp.mode ? ` (${exp.mode})` : ''}
                                    </Text>
                                    {exp.dates ? <Text style={styles.entryDates}>{exp.dates}</Text> : null}
                                </View>
                                <Text style={styles.entrySubtitle}>{exp.organisation}</Text>
                                {exp.bullets && exp.bullets.length > 0 && (
                                    <View style={styles.bulletList}>
                                        {exp.bullets.map((b, bIdx) => (
                                            <View key={bIdx} style={styles.bulletRow}>
                                                <Text style={styles.bulletDot}>•</Text>
                                                <Text style={styles.bulletContent}>{b}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                );

            case 'achievements':
                if (visibleAchievements.length === 0) return null;
                return (
                    <View key="achievements" style={styles.section}>
                        <Text style={styles.sectionHeading}>Certifications & Achievements</Text>
                        {visibleAchievements.map((ach, idx) => (
                            <View key={ach.id || idx} style={styles.achievementRow}>
                                <Text style={styles.bulletDot}>•</Text>
                                <Text style={styles.bulletContent}>{ach.text}</Text>
                            </View>
                        ))}
                    </View>
                );

            case 'skills':
                if (visibleSkills.length === 0) return null;
                return (
                    <View key="skills" style={styles.section}>
                        <Text style={styles.sectionHeading}>Skills</Text>
                        {visibleSkills.map((sk, idx) => (
                            <View key={sk.id || idx} style={styles.skillRow}>
                                <Text style={styles.skillLabel}>{sk.label}:</Text>
                                <Text style={styles.skillItems}>{sk.items}</Text>
                            </View>
                        ))}
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <Document
            title={`Resume - ${header.name || 'Uday Kiran Vempati'}`}
            author={header.name || 'Uday Kiran Vempati'}
            subject="Software Engineering & Design Resume"
        >
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{header.name || 'UDAY KIRAN VEMPATI'}</Text>

                    {header.degreeLine && (
                        <Text style={styles.degreeLine}>{header.degreeLine}</Text>
                    )}

                    <View style={styles.contactLine}>
                        {header.phone && (
                            <Link src={`tel:${header.phone.replace(/\s+/g, '')}`} style={styles.link}>
                                <Text>{header.phone}</Text>
                            </Link>
                        )}

                        {header.phone && header.email && <Text style={styles.separator}>|</Text>}

                        {header.email && (
                            <Link src={`mailto:${header.email}`} style={styles.link}>
                                <Text>{header.email}</Text>
                            </Link>
                        )}

                        {(header.phone || header.email) && header.linkedin && <Text style={styles.separator}>|</Text>}

                        {header.linkedin && (
                            <Link src={cleanUrl(header.linkedin)} style={styles.link}>
                                <Text>{header.linkedin}</Text>
                            </Link>
                        )}

                        {(header.phone || header.email || header.linkedin) && header.github && (
                            <Text style={styles.separator}>|</Text>
                        )}

                        {header.github && (
                            <Link src={cleanUrl(header.github)} style={styles.link}>
                                <Text>{header.github}</Text>
                            </Link>
                        )}
                    </View>

                    {header.portfolio && (
                        <View style={styles.contactLine}>
                            <Link src={cleanUrl(header.portfolio)} style={styles.link}>
                                <Text style={{ fontFamily: 'Times-Bold' }}>Portfolio: {header.portfolio}</Text>
                            </Link>
                        </View>
                    )}
                </View>

                {/* Sections in configured sectionOrder */}
                {sectionOrder.map(sectionKey => renderSection(sectionKey))}
            </Page>
        </Document>
    );
};

export default ResumePdfDocument;

