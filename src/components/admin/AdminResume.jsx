import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Save, FileText, ArrowRight, Eye, Link as LinkIcon } from 'lucide-react';

const AdminResume = () => {
    const { data, updateData } = useData();
    const { showToast } = useToast();
    const [resumeData, setResumeData] = useState(data.resume || {
        link: '',
        enabled: true,
        lastUpdated: ''
    });

    // Validates that state is synced with Firestore
    useEffect(() => {
        if (data.resume && JSON.stringify(data.resume) !== JSON.stringify(resumeData)) {

            setResumeData(data.resume);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.resume]);

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        try {
            await updateData('resume', {
                ...resumeData,
                lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            });
            showToast('Resume configuration updated successfully.', 'success');
        } catch (error) {
            console.error("Resume save error:", error);
            showToast('Failed to save changes. Please try again.', 'error');
        }
    };

    return (
        <div className="space-y-12 animate-fade-in max-w-4xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-[2px] bg-orange-500"></div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">CV Management</span>
                    </div>
                    <h2 className="text-3xl font-black text-white">Resume Configuration</h2>
                </div>
                <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-3 px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 active:scale-95 group"
                >
                    <Save size={18} />
                    Deploy Changes <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="bg-[#111111] border border-white/5 rounded-[40px] p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>

                <div className="grid gap-8 relative z-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Resume Source URL (PDF/Drive Link)</label>
                        <div className="relative">
                            <LinkIcon className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500" size={18} />
                            <input
                                type="url"
                                value={resumeData.link}
                                onChange={(e) => setResumeData({ ...resumeData, link: e.target.value })}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold placeholder-gray-600"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-orange-500/20 transition-all">
                        <div>
                            <div className="text-sm font-black text-white uppercase tracking-widest">Public Visibility</div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mt-1">Enable or disable resume access</div>
                        </div>
                        <button
                            onClick={() => setResumeData({ ...resumeData, enabled: !resumeData.enabled })}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${resumeData.enabled ? 'bg-orange-500' : 'bg-gray-800'}`}
                            aria-label={resumeData.enabled ? "Disable resume visibility" : "Enable resume visibility"}
                        >
                            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${resumeData.enabled ? 'translate-x-[1.625rem]' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="p-6 bg-black/40 rounded-3xl border border-white/5 flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-xl text-orange-500">
                            <FileText size={24} />
                        </div>
                        <div className="flex-1">
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Current Status</div>
                            <div className="text-white font-bold flex items-center gap-2">
                                {resumeData.link ? 'Active Link configured' : 'No Link set'}
                                {resumeData.lastUpdated && <span className="text-gray-600 text-[10px] font-normal">• Last updated: {resumeData.lastUpdated}</span>}
                            </div>
                        </div>
                        {resumeData.link && (
                            <a
                                href={resumeData.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                                aria-label="Preview Resume"
                            >
                                <Eye size={20} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminResume;
