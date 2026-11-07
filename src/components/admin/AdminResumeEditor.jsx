import React, { useState, useEffect } from 'react';
import {
    Save, RotateCcw, Eye, Download, Plus, Trash2, Copy,
    ChevronUp, ChevronDown, EyeOff, AlertTriangle, CheckCircle2,
    Layers, BookOpen, Briefcase, Award, Cpu, User, FileText
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import ResumeSheet from '../public/ResumeSheet';
import { downloadResumePdf, previewResumePdfInTab } from '../../utils/resumePdfGenerator';

const AdminResumeEditor = () => {
    const { resumeData, saveResume } = useResume();
    const [formData, setFormData] = useState(resumeData);
    const [activeSection, setActiveSection] = useState('header');
    const [saving, setSaving] = useState(false);
    const [pdfAction, setPdfAction] = useState(null);

    // Sync formData when resumeData changes initially
    useEffect(() => {
        if (resumeData) {
            setFormData(resumeData);
        }
    }, [resumeData]);

    const isDirty = JSON.stringify(formData) !== JSON.stringify(resumeData);

    // Unsaved changes browser prompt
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveResume(formData);
        } finally {
            setSaving(false);
        }
    };

    const handleDiscard = () => {
        if (window.confirm("Discard all unsaved changes and reload saved resume?")) {
            setFormData(resumeData);
        }
    };

    const handlePreviewPdf = async () => {
        setPdfAction('preview');
        try {
            await previewResumePdfInTab(formData);
        } finally {
            setPdfAction(null);
        }
    };

    const handleDownloadPdf = async () => {
        setPdfAction('download');
        try {
            await downloadResumePdf(formData);
        } finally {
            setPdfAction(null);
        }
    };

    // Section ordering and visibility
    const moveSection = (idx, direction) => {
        const newOrder = [...formData.sectionOrder];
        const targetIdx = idx + direction;
        if (targetIdx < 0 || targetIdx >= newOrder.length) return;
        const [moved] = newOrder.splice(idx, 1);
        newOrder.splice(targetIdx, 0, moved);
        setFormData({ ...formData, sectionOrder: newOrder });
    };

    const toggleSectionVisibility = (sectionKey) => {
        setFormData({
            ...formData,
            sectionVisible: {
                ...formData.sectionVisible,
                [sectionKey]: !formData.sectionVisible[sectionKey]
            }
        });
    };

    // Generic list helpers
    const reorderList = (listKey, idx, direction) => {
        const list = [...(formData[listKey] || [])];
        const targetIdx = idx + direction;
        if (targetIdx < 0 || targetIdx >= list.length) return;
        const [moved] = list.splice(idx, 1);
        list.splice(targetIdx, 0, moved);
        const reindexed = list.map((item, i) => ({ ...item, order: i + 1 }));
        setFormData({ ...formData, [listKey]: reindexed });
    };

    const toggleItemVisibility = (listKey, idx) => {
        const list = [...(formData[listKey] || [])];
        list[idx] = { ...list[idx], visible: list[idx].visible === false ? true : false };
        setFormData({ ...formData, [listKey]: list });
    };

    const duplicateItem = (listKey, idx) => {
        const list = [...(formData[listKey] || [])];
        const cloned = {
            ...list[idx],
            id: `${listKey}-${Date.now()}`,
            order: list.length + 1
        };
        list.splice(idx + 1, 0, cloned);
        setFormData({ ...formData, [listKey]: list });
    };

    const deleteItem = (listKey, idx) => {
        if (!window.confirm("Delete this entry?")) return;
        const list = (formData[listKey] || []).filter((_, i) => i !== idx);
        setFormData({ ...formData, [listKey]: list });
    };

    // Bullet helpers for projects & experience
    const addBullet = (listKey, itemIdx) => {
        const list = [...(formData[listKey] || [])];
        const bullets = [...(list[itemIdx].bullets || []), 'New achievement or key metric...'];
        list[itemIdx] = { ...list[itemIdx], bullets };
        setFormData({ ...formData, [listKey]: list });
    };

    const updateBullet = (listKey, itemIdx, bIdx, text) => {
        const list = [...(formData[listKey] || [])];
        const bullets = [...(list[itemIdx].bullets || [])];
        bullets[bIdx] = text;
        list[itemIdx] = { ...list[itemIdx], bullets };
        setFormData({ ...formData, [listKey]: list });
    };

    const deleteBullet = (listKey, itemIdx, bIdx) => {
        const list = [...(formData[listKey] || [])];
        const bullets = (list[itemIdx].bullets || []).filter((_, i) => i !== bIdx);
        list[itemIdx] = { ...list[itemIdx], bullets };
        setFormData({ ...formData, [listKey]: list });
    };

    const moveBullet = (listKey, itemIdx, bIdx, direction) => {
        const list = [...(formData[listKey] || [])];
        const bullets = [...(list[itemIdx].bullets || [])];
        const target = bIdx + direction;
        if (target < 0 || target >= bullets.length) return;
        const [moved] = bullets.splice(bIdx, 1);
        bullets.splice(target, 0, moved);
        list[itemIdx] = { ...list[itemIdx], bullets };
        setFormData({ ...formData, [listKey]: list });
    };

    // Calculate approximate page density
    const totalBullets = [
        ...(formData.projects || []).flatMap(p => p.bullets || []),
        ...(formData.experience || []).flatMap(e => e.bullets || []),
        ...(formData.achievements || []).map(a => a.text)
    ].length;

    const isDensityHigh = totalBullets > 13 || (formData.profile?.length || 0) > 420;

    return (
        <div className="space-y-6 text-[#102A28]">
            {/* Top Action Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 rounded-[12px] border border-[#DDE7E5] shadow-sm sticky top-0 z-30">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-[#102A28]">Resume Editor</h2>
                        {isDirty && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                                Unsaved changes
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-[#8A9B98] mt-0.5">
                        Live Firestore resume content synced across public /resume page and downloadable PDF
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handlePreviewPdf}
                        disabled={pdfAction === 'preview'}
                        className="btn-secondary !h-9 !px-3 text-xs inline-flex items-center gap-1.5"
                    >
                        <Eye size={14} />
                        <span>{pdfAction === 'preview' ? 'Generating…' : 'Preview PDF'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleDownloadPdf}
                        disabled={pdfAction === 'download'}
                        className="btn-secondary !h-9 !px-3 text-xs inline-flex items-center gap-1.5"
                    >
                        <Download size={14} />
                        <span>{pdfAction === 'download' ? 'Preparing…' : 'Download PDF'}</span>
                    </button>

                    {isDirty && (
                        <button
                            type="button"
                            onClick={handleDiscard}
                            className="btn-secondary !h-9 !px-3 text-xs inline-flex items-center gap-1.5 text-[#DC2626] hover:bg-[#FEF2F2]"
                        >
                            <RotateCcw size={14} />
                            <span>Discard</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary !h-9 !px-4 text-xs inline-flex items-center gap-1.5"
                    >
                        <Save size={14} />
                        <span>{saving ? 'Saving…' : 'Save changes'}</span>
                    </button>
                </div>
            </div>

            {/* Density Hint Banner */}
            <div className={`p-3.5 rounded-[8px] border text-xs flex items-center justify-between gap-3 ${
                isDensityHigh
                    ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]'
                    : 'bg-[#E6F4F2] border-[#7CC7BD] text-[#0F766E]'
            }`}>
                <div className="flex items-center gap-2">
                    {isDensityHigh ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                    <span>
                        {isDensityHigh
                            ? 'Warning: Content density is high. Total bullet/achievement count exceeds 13 items — PDF may spill over onto a second page.'
                            : 'Optimal 1-Page ATS Layout: Section count and bullet density are balanced for single-page presentation.'}
                    </span>
                </div>
                <span className="font-mono text-[11px] shrink-0 font-medium">
                    {totalBullets} bullets / {formData.profile?.length || 0} chars
                </span>
            </div>

            {/* Split Screen Layout: Form Left, Preview Right */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Form Controls Column (Left) */}
                <div className="xl:col-span-6 space-y-6">
                    {/* Section Selector Tabs */}
                    <div className="flex flex-wrap gap-1.5 bg-white p-2 rounded-[10px] border border-[#DDE7E5] shadow-xs">
                        {[
                            { id: 'header', label: 'Header', icon: User },
                            { id: 'profile', label: 'Profile', icon: FileText },
                            { id: 'education', label: 'Education', icon: BookOpen },
                            { id: 'projects', label: 'Projects', icon: Briefcase },
                            { id: 'experience', label: 'Experience', icon: Layers },
                            { id: 'achievements', label: 'Certifications', icon: Award },
                            { id: 'skills', label: 'Skills', icon: Cpu },
                            { id: 'sections', label: 'Reorder Sections', icon: Layers }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveSection(tab.id)}
                                className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                    activeSection === tab.id
                                        ? 'bg-[#0F766E] text-white'
                                        : 'text-[#4B5F5C] hover:bg-[#E6F4F2] hover:text-[#0F766E]'
                                }`}
                            >
                                <tab.icon size={13} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Section 1: HEADER */}
                    {activeSection === 'header' && (
                        <div className="bg-white p-6 rounded-[12px] border border-[#DDE7E5] shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-[#102A28] border-b border-[#DDE7E5] pb-2">
                                Header Details
                            </h3>

                            <div>
                                <label className="block text-xs font-medium text-[#4B5F5C] mb-1">Full Name (All Caps)</label>
                                <input
                                    type="text"
                                    value={formData.header?.name || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        header: { ...formData.header, name: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 text-sm rounded-[6px] border border-[#DDE7E5] bg-[#F7FAFA] focus:outline-none focus:border-[#7CC7BD]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#4B5F5C] mb-1">Degree Line</label>
                                <input
                                    type="text"
                                    value={formData.header?.degreeLine || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        header: { ...formData.header, degreeLine: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 text-sm rounded-[6px] border border-[#DDE7E5] bg-[#F7FAFA] focus:outline-none focus:border-[#7CC7BD]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#4B5F5C] mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={formData.header?.phone || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            header: { ...formData.header, phone: e.target.value }
                                        })}
                                        className="w-full h-9 px-3 text-sm rounded-[6px] border border-[#DDE7E5] bg-[#F7FAFA] focus:outline-none focus:border-[#7CC7BD]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#4B5F5C] mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.header?.email || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            header: { ...formData.header, email: e.target.value }
                                        })}
                                        className="w-full h-9 px-3 text-sm rounded-[6px] border border-[#DDE7E5] bg-[#F7FAFA] focus:outline-none focus:border-[#7CC7BD]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#4B5F5C] mb-1">LinkedIn URL or handle</label>
                                    <input
                                        type="text"
                                        value={formData.header?.linkedin || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            header: { ...formData.header, linkedin: e.target.value }
                                        })}
                                        className="w-full h-9 px-3 text-sm rounded-[6px] border border-[#DDE7E5] bg-[#F7FAFA] focus:outline-none focus:border-[#7CC7BD]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#4B5F5C] mb-1">GitHub URL or handle</label>
                                    <input
                                        type="text"
                                        value={formData.header?.github || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            header: { ...formData.header, github: e.target.value }
                                        })}
                                        className="w-full h-9 px-3 text-sm rounded-[6px] border border-[#DDE7E5] bg-[#F7FAFA] focus:outline-none focus:border-[#7CC7BD]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#4B5F5C] mb-1">Portfolio Domain</label>
                                <input
                                    type="text"
                                    value={formData.header?.portfolio || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        header: { ...formData.header, portfolio: e.target.value }
                                    })}
                                    className="w-full h-9 px-3 text-sm rounded-[6px] border border-[#DDE7E5] bg-[#F7FAFA] focus:outline-none focus:border-[#7CC7BD]"
                                />
                            </div>
                        </div>
                    )}

                    {/* Section 2: PROFILE */}
                    {activeSection === 'profile' && (
                        <div className="bg-white p-6 rounded-[12px] border border-[#DDE7E5] shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-[#DDE7E5] pb-2">
                                <h3 className="text-sm font-semibold text-[#102A28]">Profile Summary</h3>
                                <span className={`text-xs ${
                                    (formData.profile?.length || 0) > 400 ? 'text-[#DC2626] font-semibold' : 'text-[#8A9B98]'
                                }`}>
                                    {formData.profile?.length || 0} / 400 chars { (formData.profile?.length || 0) > 400 && '(recommended under 400)' }
                                </span>
                            </div>

                            <textarea
                                rows={5}
                                value={formData.profile || ''}
                                onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                                placeholder="Summary of background, focus areas and target roles..."
                                className="w-full p-3 text-sm rounded-[6px] border border-[#DDE7E5] bg-[#F7FAFA] focus:outline-none focus:border-[#7CC7BD] leading-relaxed"
                            />
                        </div>
                    )}

                    {/* Section 3: EDUCATION */}
                    {activeSection === 'education' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-white p-4 rounded-[12px] border border-[#DDE7E5]">
                                <div>
                                    <h3 className="text-sm font-semibold text-[#102A28]">Education Entries</h3>
                                    <p className="text-xs text-[#8A9B98]">Institutions, degrees, years and marks</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newEdu = {
                                            id: `edu-${Date.now()}`,
                                            institution: 'New Institution',
                                            location: '',
                                            degree: 'Degree / Program',
                                            startYear: '',
                                            endYear: '',
                                            endLabel: '',
                                            scoreLabel: 'CGPA',
                                            score: '',
                                            note: '',
                                            order: (formData.education || []).length + 1,
                                            visible: true
                                        };
                                        setFormData({ ...formData, education: [...(formData.education || []), newEdu] });
                                    }}
                                    className="btn-primary !h-8 !px-3 text-xs inline-flex items-center gap-1"
                                >
                                    <Plus size={13} />
                                    <span>Add School</span>
                                </button>
                            </div>

                            {(formData.education || []).map((edu, idx) => (
                                <div key={edu.id || idx} className="bg-white p-5 rounded-[12px] border border-[#DDE7E5] shadow-xs space-y-3">
                                    <div className="flex items-center justify-between border-b border-[#DDE7E5] pb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-[#0F766E]">#{idx + 1}</span>
                                            <span className="text-sm font-semibold text-[#102A28]">{edu.institution || 'Untitled School'}</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => moveSection ? reorderList('education', idx, -1) : null}
                                                disabled={idx === 0}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded disabled:opacity-30"
                                                title="Move up"
                                            >
                                                <ChevronUp size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => reorderList('education', idx, 1)}
                                                disabled={idx === (formData.education || []).length - 1}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded disabled:opacity-30"
                                                title="Move down"
                                            >
                                                <ChevronDown size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => toggleItemVisibility('education', idx)}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded"
                                                title={edu.visible === false ? "Show in resume" : "Hide in resume"}
                                            >
                                                {edu.visible === false ? <EyeOff size={15} className="text-[#DC2626]" /> : <Eye size={15} />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => duplicateItem('education', idx)}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded"
                                                title="Duplicate"
                                            >
                                                <Copy size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteItem('education', idx)}
                                                className="p-1 text-[#DC2626] hover:bg-[#FEF2F2] rounded"
                                                title="Delete"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Institution</label>
                                            <input
                                                type="text"
                                                value={edu.institution || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.education];
                                                    list[idx] = { ...list[idx], institution: e.target.value };
                                                    setFormData({ ...formData, education: list });
                                                }}
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Location</label>
                                            <input
                                                type="text"
                                                value={edu.location || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.education];
                                                    list[idx] = { ...list[idx], location: e.target.value };
                                                    setFormData({ ...formData, education: list });
                                                }}
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Degree / Course</label>
                                        <input
                                            type="text"
                                            value={edu.degree || ''}
                                            onChange={(e) => {
                                                const list = [...formData.education];
                                                list[idx] = { ...list[idx], degree: e.target.value };
                                                setFormData({ ...formData, education: list });
                                            }}
                                            className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Start Year</label>
                                            <input
                                                type="text"
                                                value={edu.startYear || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.education];
                                                    list[idx] = { ...list[idx], startYear: e.target.value };
                                                    setFormData({ ...formData, education: list });
                                                }}
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">End Year</label>
                                            <input
                                                type="text"
                                                value={edu.endYear || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.education];
                                                    list[idx] = { ...list[idx], endYear: e.target.value };
                                                    setFormData({ ...formData, education: list });
                                                }}
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">End Label (e.g. expected)</label>
                                            <input
                                                type="text"
                                                value={edu.endLabel || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.education];
                                                    list[idx] = { ...list[idx], endLabel: e.target.value };
                                                    setFormData({ ...formData, education: list });
                                                }}
                                                placeholder="(expected)"
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Score Label</label>
                                            <input
                                                type="text"
                                                value={edu.scoreLabel || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.education];
                                                    list[idx] = { ...list[idx], scoreLabel: e.target.value };
                                                    setFormData({ ...formData, education: list });
                                                }}
                                                placeholder="CGPA / Score"
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Score Value</label>
                                            <input
                                                type="text"
                                                value={edu.score || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.education];
                                                    list[idx] = { ...list[idx], score: e.target.value };
                                                    setFormData({ ...formData, education: list });
                                                }}
                                                placeholder="9.52 / 10"
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Note (optional)</label>
                                            <input
                                                type="text"
                                                value={edu.note || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.education];
                                                    list[idx] = { ...list[idx], note: e.target.value };
                                                    setFormData({ ...formData, education: list });
                                                }}
                                                placeholder="(94.7%)"
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Section 4: PROJECTS */}
                    {activeSection === 'projects' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-white p-4 rounded-[12px] border border-[#DDE7E5]">
                                <div>
                                    <h3 className="text-sm font-semibold text-[#102A28]">Projects</h3>
                                    <p className="text-xs text-[#8A9B98]">Shipped apps, platforms and architecture work</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newProj = {
                                            id: `proj-${Date.now()}`,
                                            title: 'New Project Title',
                                            role: 'lead developer',
                                            techStack: 'React, Node.js',
                                            dates: '2026',
                                            link: '',
                                            bullets: ['Built core feature and improved performance.'],
                                            order: (formData.projects || []).length + 1,
                                            visible: true
                                        };
                                        setFormData({ ...formData, projects: [...(formData.projects || []), newProj] });
                                    }}
                                    className="btn-primary !h-8 !px-3 text-xs inline-flex items-center gap-1"
                                >
                                    <Plus size={13} />
                                    <span>Add Project</span>
                                </button>
                            </div>

                            {(formData.projects || []).map((proj, idx) => (
                                <div key={proj.id || idx} className="bg-white p-5 rounded-[12px] border border-[#DDE7E5] shadow-xs space-y-3">
                                    <div className="flex items-center justify-between border-b border-[#DDE7E5] pb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-[#0F766E]">#{idx + 1}</span>
                                            <span className="text-sm font-semibold text-[#102A28]">{proj.title || 'Untitled Project'}</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => reorderList('projects', idx, -1)}
                                                disabled={idx === 0}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded disabled:opacity-30"
                                            >
                                                <ChevronUp size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => reorderList('projects', idx, 1)}
                                                disabled={idx === (formData.projects || []).length - 1}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded disabled:opacity-30"
                                            >
                                                <ChevronDown size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => toggleItemVisibility('projects', idx)}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded"
                                            >
                                                {proj.visible === false ? <EyeOff size={15} className="text-[#DC2626]" /> : <Eye size={15} />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => duplicateItem('projects', idx)}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded"
                                            >
                                                <Copy size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteItem('projects', idx)}
                                                className="p-1 text-[#DC2626] hover:bg-[#FEF2F2] rounded"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Project Title</label>
                                            <input
                                                type="text"
                                                value={proj.title || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.projects];
                                                    list[idx] = { ...list[idx], title: e.target.value };
                                                    setFormData({ ...formData, projects: list });
                                                }}
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Role / Subtitle</label>
                                            <input
                                                type="text"
                                                value={proj.role || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.projects];
                                                    list[idx] = { ...list[idx], role: e.target.value };
                                                    setFormData({ ...formData, projects: list });
                                                }}
                                                placeholder="founder, full-stack"
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="sm:col-span-2">
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Tech Stack</label>
                                            <input
                                                type="text"
                                                value={proj.techStack || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.projects];
                                                    list[idx] = { ...list[idx], techStack: e.target.value };
                                                    setFormData({ ...formData, projects: list });
                                                }}
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Dates</label>
                                            <input
                                                type="text"
                                                value={proj.dates || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.projects];
                                                    list[idx] = { ...list[idx], dates: e.target.value };
                                                    setFormData({ ...formData, projects: list });
                                                }}
                                                placeholder="2025 – present"
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Project Link (optional)</label>
                                        <input
                                            type="text"
                                            value={proj.link || ''}
                                            onChange={(e) => {
                                                const list = [...formData.projects];
                                                list[idx] = { ...list[idx], link: e.target.value };
                                                setFormData({ ...formData, projects: list });
                                            }}
                                            placeholder="https://..."
                                            className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                        />
                                    </div>

                                    {/* Bullets List */}
                                    <div className="pt-2 border-t border-[#DDE7E5] space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[11px] font-medium text-[#4B5F5C]">Bullet Points</label>
                                            <button
                                                type="button"
                                                onClick={() => addBullet('projects', idx)}
                                                className="text-xs text-[#0F766E] font-medium hover:underline inline-flex items-center gap-1"
                                            >
                                                <Plus size={12} /> Add bullet
                                            </button>
                                        </div>

                                        {(proj.bullets || []).map((bullet, bIdx) => (
                                            <div key={bIdx} className="flex items-start gap-2">
                                                <span className="text-xs text-[#8A9B98] mt-1.5">•</span>
                                                <div className="flex-1">
                                                    <textarea
                                                        rows={2}
                                                        value={bullet}
                                                        onChange={(e) => updateBullet('projects', idx, bIdx, e.target.value)}
                                                        className="w-full p-2 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA] leading-normal"
                                                    />
                                                    <span className={`text-[10px] block text-right ${
                                                        bullet.length > 200 ? 'text-[#DC2626] font-semibold' : 'text-[#8A9B98]'
                                                    }`}>
                                                        {bullet.length}/200 chars
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => moveBullet('projects', idx, bIdx, -1)}
                                                        disabled={bIdx === 0}
                                                        className="p-0.5 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded disabled:opacity-20"
                                                    >
                                                        <ChevronUp size={13} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveBullet('projects', idx, bIdx, 1)}
                                                        disabled={bIdx === (proj.bullets || []).length - 1}
                                                        className="p-0.5 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded disabled:opacity-20"
                                                    >
                                                        <ChevronDown size={13} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteBullet('projects', idx, bIdx)}
                                                        className="p-0.5 text-[#DC2626] hover:bg-[#FEF2F2] rounded"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Section 5: EXPERIENCE & LEADERSHIP */}
                    {activeSection === 'experience' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-white p-4 rounded-[12px] border border-[#DDE7E5]">
                                <div>
                                    <h3 className="text-sm font-semibold text-[#102A28]">Experience & Leadership</h3>
                                    <p className="text-xs text-[#8A9B98]">Clubs, internships and studio positions</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newExp = {
                                            id: `exp-${Date.now()}`,
                                            role: 'Role Title',
                                            organisation: 'Organisation Name',
                                            mode: 'remote',
                                            dates: '2026',
                                            bullets: ['Coordinated project delivery.'],
                                            order: (formData.experience || []).length + 1,
                                            visible: true
                                        };
                                        setFormData({ ...formData, experience: [...(formData.experience || []), newExp] });
                                    }}
                                    className="btn-primary !h-8 !px-3 text-xs inline-flex items-center gap-1"
                                >
                                    <Plus size={13} />
                                    <span>Add Role</span>
                                </button>
                            </div>

                            {(formData.experience || []).map((exp, idx) => (
                                <div key={exp.id || idx} className="bg-white p-5 rounded-[12px] border border-[#DDE7E5] shadow-xs space-y-3">
                                    <div className="flex items-center justify-between border-b border-[#DDE7E5] pb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-[#0F766E]">#{idx + 1}</span>
                                            <span className="text-sm font-semibold text-[#102A28]">{exp.role || 'Untitled Role'}</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => reorderList('experience', idx, -1)}
                                                disabled={idx === 0}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded disabled:opacity-30"
                                            >
                                                <ChevronUp size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => reorderList('experience', idx, 1)}
                                                disabled={idx === (formData.experience || []).length - 1}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded disabled:opacity-30"
                                            >
                                                <ChevronDown size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => toggleItemVisibility('experience', idx)}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded"
                                            >
                                                {exp.visible === false ? <EyeOff size={15} className="text-[#DC2626]" /> : <Eye size={15} />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => duplicateItem('experience', idx)}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded"
                                            >
                                                <Copy size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteItem('experience', idx)}
                                                className="p-1 text-[#DC2626] hover:bg-[#FEF2F2] rounded"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Role Title</label>
                                            <input
                                                type="text"
                                                value={exp.role || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.experience];
                                                    list[idx] = { ...list[idx], role: e.target.value };
                                                    setFormData({ ...formData, experience: list });
                                                }}
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Organisation</label>
                                            <input
                                                type="text"
                                                value={exp.organisation || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.experience];
                                                    list[idx] = { ...list[idx], organisation: e.target.value };
                                                    setFormData({ ...formData, experience: list });
                                                }}
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Mode (virtual / remote / on-site)</label>
                                            <input
                                                type="text"
                                                value={exp.mode || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.experience];
                                                    list[idx] = { ...list[idx], mode: e.target.value };
                                                    setFormData({ ...formData, experience: list });
                                                }}
                                                placeholder="virtual"
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Dates</label>
                                            <input
                                                type="text"
                                                value={exp.dates || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.experience];
                                                    list[idx] = { ...list[idx], dates: e.target.value };
                                                    setFormData({ ...formData, experience: list });
                                                }}
                                                placeholder="Nov 2025 – present"
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                    </div>

                                    {/* Bullets List */}
                                    <div className="pt-2 border-t border-[#DDE7E5] space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[11px] font-medium text-[#4B5F5C]">Bullet Points</label>
                                            <button
                                                type="button"
                                                onClick={() => addBullet('experience', idx)}
                                                className="text-xs text-[#0F766E] font-medium hover:underline inline-flex items-center gap-1"
                                            >
                                                <Plus size={12} /> Add bullet
                                            </button>
                                        </div>

                                        {(exp.bullets || []).map((bullet, bIdx) => (
                                            <div key={bIdx} className="flex items-start gap-2">
                                                <span className="text-xs text-[#8A9B98] mt-1.5">•</span>
                                                <div className="flex-1">
                                                    <textarea
                                                        rows={2}
                                                        value={bullet}
                                                        onChange={(e) => updateBullet('experience', idx, bIdx, e.target.value)}
                                                        className="w-full p-2 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA] leading-normal"
                                                    />
                                                    <span className={`text-[10px] block text-right ${
                                                        bullet.length > 200 ? 'text-[#DC2626] font-semibold' : 'text-[#8A9B98]'
                                                    }`}>
                                                        {bullet.length}/200 chars
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => moveBullet('experience', idx, bIdx, -1)}
                                                        disabled={bIdx === 0}
                                                        className="p-0.5 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded disabled:opacity-20"
                                                    >
                                                        <ChevronUp size={13} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveBullet('experience', idx, bIdx, 1)}
                                                        disabled={bIdx === (exp.bullets || []).length - 1}
                                                        className="p-0.5 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded disabled:opacity-20"
                                                    >
                                                        <ChevronDown size={13} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteBullet('experience', idx, bIdx)}
                                                        className="p-0.5 text-[#DC2626] hover:bg-[#FEF2F2] rounded"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Section 6: CERTIFICATIONS & ACHIEVEMENTS */}
                    {activeSection === 'achievements' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-white p-4 rounded-[12px] border border-[#DDE7E5]">
                                <div>
                                    <h3 className="text-sm font-semibold text-[#102A28]">Certifications & Achievements</h3>
                                    <p className="text-xs text-[#8A9B98]">Skill badges, hackathons and case studies</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newAch = {
                                            id: `ach-${Date.now()}`,
                                            text: 'New verified certification or hackathon recognition text.',
                                            order: (formData.achievements || []).length + 1,
                                            visible: true
                                        };
                                        setFormData({ ...formData, achievements: [...(formData.achievements || []), newAch] });
                                    }}
                                    className="btn-primary !h-8 !px-3 text-xs inline-flex items-center gap-1"
                                >
                                    <Plus size={13} />
                                    <span>Add Item</span>
                                </button>
                            </div>

                            {(formData.achievements || []).map((ach, idx) => (
                                <div key={ach.id || idx} className="bg-white p-4 rounded-[12px] border border-[#DDE7E5] shadow-xs space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-[#0F766E]">#{idx + 1}</span>

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => reorderList('achievements', idx, -1)}
                                                disabled={idx === 0}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded disabled:opacity-30"
                                            >
                                                <ChevronUp size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => reorderList('achievements', idx, 1)}
                                                disabled={idx === (formData.achievements || []).length - 1}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded disabled:opacity-30"
                                            >
                                                <ChevronDown size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => toggleItemVisibility('achievements', idx)}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded"
                                            >
                                                {ach.visible === false ? <EyeOff size={15} className="text-[#DC2626]" /> : <Eye size={15} />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => duplicateItem('achievements', idx)}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded"
                                            >
                                                <Copy size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteItem('achievements', idx)}
                                                className="p-1 text-[#DC2626] hover:bg-[#FEF2F2] rounded"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    <textarea
                                        rows={2}
                                        value={ach.text || ''}
                                        onChange={(e) => {
                                            const list = [...formData.achievements];
                                            list[idx] = { ...list[idx], text: e.target.value };
                                            setFormData({ ...formData, achievements: list });
                                        }}
                                        className="w-full p-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA] leading-relaxed"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Section 7: SKILLS */}
                    {activeSection === 'skills' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-white p-4 rounded-[12px] border border-[#DDE7E5]">
                                <div>
                                    <h3 className="text-sm font-semibold text-[#102A28]">Skills</h3>
                                    <p className="text-xs text-[#8A9B98]">Categorized skills with bold labels</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newSk = {
                                            id: `skill-${Date.now()}`,
                                            label: 'Category',
                                            items: 'Item 1, Item 2',
                                            order: (formData.skills || []).length + 1,
                                            visible: true
                                        };
                                        setFormData({ ...formData, skills: [...(formData.skills || []), newSk] });
                                    }}
                                    className="btn-primary !h-8 !px-3 text-xs inline-flex items-center gap-1"
                                >
                                    <Plus size={13} />
                                    <span>Add Category</span>
                                </button>
                            </div>

                            {(formData.skills || []).map((sk, idx) => (
                                <div key={sk.id || idx} className="bg-white p-4 rounded-[12px] border border-[#DDE7E5] shadow-xs space-y-3">
                                    <div className="flex items-center justify-between border-b border-[#DDE7E5] pb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-[#0F766E]">#{idx + 1}</span>
                                            <span className="text-xs font-semibold text-[#102A28]">{sk.label || 'New Category'}</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => reorderList('skills', idx, -1)}
                                                disabled={idx === 0}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded disabled:opacity-30"
                                            >
                                                <ChevronUp size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => reorderList('skills', idx, 1)}
                                                disabled={idx === (formData.skills || []).length - 1}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded disabled:opacity-30"
                                            >
                                                <ChevronDown size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => toggleItemVisibility('skills', idx)}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded"
                                            >
                                                {sk.visible === false ? <EyeOff size={15} className="text-[#DC2626]" /> : <Eye size={15} />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => duplicateItem('skills', idx)}
                                                className="p-1 text-[#4B5F5C] hover:bg-[#EEF4F3] rounded"
                                            >
                                                <Copy size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteItem('skills', idx)}
                                                className="p-1 text-[#DC2626] hover:bg-[#FEF2F2] rounded"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Category Label</label>
                                            <input
                                                type="text"
                                                value={sk.label || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.skills];
                                                    list[idx] = { ...list[idx], label: e.target.value };
                                                    setFormData({ ...formData, skills: list });
                                                }}
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-[11px] font-medium text-[#4B5F5C] mb-1">Items (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={sk.items || ''}
                                                onChange={(e) => {
                                                    const list = [...formData.skills];
                                                    list[idx] = { ...list[idx], items: e.target.value };
                                                    setFormData({ ...formData, skills: list });
                                                }}
                                                className="w-full h-8 px-2.5 text-xs rounded border border-[#DDE7E5] bg-[#F7FAFA]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Section 8: SECTION CONTROLS (ORDER & VISIBILITY) */}
                    {activeSection === 'sections' && (
                        <div className="bg-white p-6 rounded-[12px] border border-[#DDE7E5] shadow-sm space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-[#102A28]">Reorder & Toggle Sections</h3>
                                <p className="text-xs text-[#8A9B98]">Adjust section placement on both the webpage and PDF</p>
                            </div>

                            <div className="space-y-2">
                                {(formData.sectionOrder || []).map((secKey, idx) => {
                                    const isVisible = formData.sectionVisible?.[secKey] !== false;
                                    const labels = {
                                        profile: 'Profile Summary',
                                        education: 'Education',
                                        projects: 'Projects',
                                        experience: 'Experience & Leadership',
                                        achievements: 'Certifications & Achievements',
                                        skills: 'Skills'
                                    };

                                    return (
                                        <div
                                            key={secKey}
                                            className="flex items-center justify-between p-3 rounded-[8px] border border-[#DDE7E5] bg-[#F7FAFA]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-mono text-[#8A9B98]">{idx + 1}</span>
                                                <span className="text-sm font-medium text-[#102A28]">
                                                    {labels[secKey] || secKey}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => moveSection(idx, -1)}
                                                    disabled={idx === 0}
                                                    className="p-1.5 text-[#4B5F5C] hover:bg-white rounded border border-[#DDE7E5] disabled:opacity-30"
                                                    title="Move up"
                                                >
                                                    <ChevronUp size={14} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => moveSection(idx, 1)}
                                                    disabled={idx === formData.sectionOrder.length - 1}
                                                    className="p-1.5 text-[#4B5F5C] hover:bg-white rounded border border-[#DDE7E5] disabled:opacity-30"
                                                    title="Move down"
                                                >
                                                    <ChevronDown size={14} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => toggleSectionVisibility(secKey)}
                                                    className={`px-3 py-1 text-xs rounded border font-medium ${
                                                        isVisible
                                                            ? 'bg-[#E6F4F2] text-[#0F766E] border-[#7CC7BD]'
                                                            : 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]'
                                                    }`}
                                                >
                                                    {isVisible ? 'Visible' : 'Hidden'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Live Preview Column (Right) */}
                <div className="xl:col-span-6 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#8A9B98] uppercase tracking-wider">
                            Live Document Preview
                        </span>
                        <span className="text-[11px] text-[#4B5F5C]">
                            A4 Sheet Preview (Live Sync)
                        </span>
                    </div>

                    <div className="bg-[#EEF4F3] p-4 sm:p-6 rounded-[12px] border border-[#DDE7E5] overflow-auto max-h-[calc(100vh-200px)]">
                        <ResumeSheet resumeData={formData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminResumeEditor;

