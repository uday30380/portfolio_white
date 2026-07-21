import React, { useState } from 'react';
import { Save, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

const AdminProfile = () => {
    const { data, updateData } = useData();
    const [heroData, setHeroData] = useState(data.hero || {});
    const [aboutData, setAboutData] = useState(data.about || {});

    // Sync state with data from context (Firestore)
    React.useEffect(() => {
        if (data.hero) setHeroData(data.hero);
        if (data.about) setAboutData(data.about);
    }, [data.hero, data.about]);

    const handleHeroChange = (e) => {
        const { name, value } = e.target;
        if (name === 'titles') {
            setHeroData(prev => ({ ...prev, [name]: value.split(',').map(t => t.trim()) }));
        } else {
            setHeroData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAboutChange = (e) => {
        const { name, value } = e.target;
        setAboutData(prev => ({ ...prev, [name]: value }));
    };

    const saveHero = async () => {
        await updateData('hero', heroData);
    };

    const handleClearHeroImage = () => {
        setHeroData(prev => ({ ...prev, image: '' }));
    };

    const saveAbout = async () => {
        await updateData('about', aboutData);
    };

    const handleClearAboutImage = () => {
        setAboutData(prev => ({ ...prev, image: '' }));
    };

    return (
        <div className="space-y-12 animate-fade-in max-w-5xl">
            {/* Hero Section */}
            <div className="bg-[#111111] border border-white/5 rounded-[48px] p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-[2px] bg-orange-500"></div>
                            <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Persona Config</span>
                        </div>
                        <h2 className="text-3xl font-black text-white">Hero Identity</h2>
                    </div>
                    <button onClick={saveHero} className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2 group">
                        <Save size={18} /> Commit Hero <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputField label="Signature Name" name="name" value={heroData.name} onChange={handleHeroChange} placeholder="Uday Kiran" />
                        <InputField label="Global Tagline" name="tagline" value={heroData.tagline} onChange={handleHeroChange} placeholder="Product Designer & Developer" />
                    </div>
                    {/* New Badge Config */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 p-6 rounded-3xl border border-white/5">
                        <InputField label="Floating Badge Main Text" name="expTitle" value={heroData.expTitle} onChange={handleHeroChange} placeholder="2nd Year" />
                        <InputField label="Floating Badge Sub Label" name="expSubtitle" value={heroData.expSubtitle} onChange={handleHeroChange} placeholder="Student" />
                    </div>
                    <InputField
                        label="Core Expertise (comma separated)"
                        name="titles"
                        value={Array.isArray(heroData.titles) ? heroData.titles.join(', ') : ''}
                        onChange={handleHeroChange}
                        placeholder="AI Automation, UI Design, Strategy"
                    />
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Elite Intro</label>
                        <textarea
                            name="intro"
                            value={heroData.intro || ''}
                            onChange={handleHeroChange}
                            rows="4"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold resize-none"
                            placeholder="Craft a high-impact introduction..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Asset Avatar URL</label>
                        <div className="flex gap-4 items-start">
                            <input
                                name="image"
                                value={heroData.image || ''}
                                onChange={handleHeroChange}
                                className="flex-1 bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                placeholder="https://..."
                            />
                            {heroData.image && (
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 group flex-shrink-0">
                                    <img src={heroData.image} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={handleClearHeroImage}
                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <ArrowRight size={14} className="text-white rotate-45" /> {/* Using generic icon as X substitute or styled X */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-white font-bold text-xs">✕</span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="bg-[#111111] border border-white/5 rounded-[48px] p-12 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-[2px] bg-orange-500"></div>
                            <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Narrative Config</span>
                        </div>
                        <h2 className="text-3xl font-black text-white">About Matrix</h2>
                    </div>
                    <button onClick={saveAbout} className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2 group">
                        <Save size={18} /> Commit Narrative <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputField label="Header" name="heading" value={aboutData.heading} onChange={handleAboutChange} placeholder="Turning Ideas into Digital Masterpieces" />
                        <InputField label="Sub-Header" name="subheading" value={aboutData.subheading} onChange={handleAboutChange} placeholder="Strategy Meets Execution" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Bio Fragment 01</label>
                        <textarea
                            name="text1"
                            value={aboutData.text1 || ''}
                            onChange={handleAboutChange}
                            rows="4"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold resize-none"
                            placeholder="Primary biography paragraph..."
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Bio Fragment 02</label>
                        <textarea
                            name="text2"
                            value={aboutData.text2 || ''}
                            onChange={handleAboutChange}
                            rows="4"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold resize-none"
                            placeholder="Secondary biography paragraph..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Narrative Image URL</label>
                        <div className="flex gap-4 items-start">
                            <input
                                name="image"
                                value={aboutData.image || ''}
                                onChange={handleAboutChange}
                                className="flex-1 bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
                                placeholder="https://..."
                            />
                            {aboutData.image && (
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 group flex-shrink-0">
                                    <img src={aboutData.image} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={handleClearAboutImage}
                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <span className="text-white font-bold text-xs">✕</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-10 border-t border-white/5">
                        <label className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-8 block">Key Metrics (Stats)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {aboutData.stats && aboutData.stats.map((stat, index) => (
                                <div key={index} className="flex gap-4 p-4 bg-black/40 rounded-[24px] border border-white/5 group hover:border-orange-500/20 transition-all">
                                    <input
                                        type="text"
                                        placeholder="Value"
                                        value={stat.value}
                                        onChange={(e) => {
                                            const newStats = [...(aboutData.stats || [])];
                                            newStats[index].value = e.target.value;
                                            setAboutData(prev => ({ ...prev, stats: newStats }));
                                        }}
                                        className="w-24 bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-orange-500 font-black text-center focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Label"
                                        value={stat.label}
                                        onChange={(e) => {
                                            const newStats = [...(aboutData.stats || [])];
                                            newStats[index].label = e.target.value;
                                            setAboutData(prev => ({ ...prev, stats: newStats }));
                                        }}
                                        className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-white font-bold focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;

const InputField = ({ label, name, value, onChange, type = "text", placeholder }) => (
    <div className="space-y-4">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold"
            placeholder={placeholder}
        />
    </div>
);