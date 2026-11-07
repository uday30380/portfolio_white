import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useData } from '../../context/DataContext';
import ImageUpload from './ImageUpload';

const AdminProfile = () => {
    const { data, updateData } = useData();
    const [heroData, setHeroData] = useState(data.hero || {});
    const [aboutData, setAboutData] = useState(data.about || {});
    const [prevHero, setPrevHero] = useState(data.hero);
    const [prevAbout, setPrevAbout] = useState(data.about);

    // Sync state when context data loads without triggering cascading renders in effect
    if (data.hero !== prevHero) {
        setPrevHero(data.hero);
        setHeroData(data.hero || {});
    }
    if (data.about !== prevAbout) {
        setPrevAbout(data.about);
        setAboutData(data.about || {});
    }

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
        alert('Hero identity saved.');
    };

    const handleClearHeroImage = () => {
        setHeroData(prev => ({ ...prev, image: '' }));
    };

    const saveAbout = async () => {
        await updateData('about', aboutData);
        alert('About section saved.');
    };

    const handleClearAboutImage = () => {
        setAboutData(prev => ({ ...prev, image: '' }));
    };

    return (
        <div className="space-y-8 max-w-4xl text-[#102A28]">
            {/* Hero Section */}
            <div className="bg-white border border-[#DDE7E5] rounded-[12px] p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#DDE7E5]">
                    <div>
                        <h2 className="text-lg font-semibold text-[#102A28]">Hero profile</h2>
                        <p className="text-xs text-[#8A9B98]">Header name, role, and portrait</p>
                    </div>
                    <button onClick={saveHero} className="btn-primary">
                        <Save size={16} />
                        <span>Save hero</span>
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Name" name="name" value={heroData.name} onChange={handleHeroChange} placeholder="Uday Kiran Vempati" />
                        <InputField label="One-line role" name="tagline" value={heroData.tagline} onChange={handleHeroChange} placeholder="Full-stack developer and designer, B.Tech at KL University" />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Intro text</label>
                        <textarea
                            name="intro"
                            value={heroData.intro || ''}
                            onChange={handleHeroChange}
                            rows="3"
                            className="w-full bg-[#FFFFFF] border border-[#DDE7E5] rounded-[8px] p-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] resize-y leading-relaxed"
                            placeholder="I build and ship usable digital products..."
                        />
                    </div>

                    <div>
                        <ImageUpload
                            label="Hero portrait image"
                            helperText="Upload photo directly to ImgBB or provide direct link"
                            compact={true}
                            currentImage={heroData.image}
                            onImageUploaded={(url) => setHeroData(prev => ({ ...prev, image: url }))}
                            onImageRemoved={handleClearHeroImage}
                        />
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="bg-white border border-[#DDE7E5] rounded-[12px] p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#DDE7E5]">
                    <div>
                        <h2 className="text-lg font-semibold text-[#102A28]">About biography</h2>
                        <p className="text-xs text-[#8A9B98]">Personal story and university timeline background</p>
                    </div>
                    <button onClick={saveAbout} className="btn-primary">
                        <Save size={16} />
                        <span>Save about</span>
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Section heading" name="heading" value={aboutData.heading} onChange={handleAboutChange} placeholder="About me" />
                        <InputField label="Subheading" name="subheading" value={aboutData.subheading} onChange={handleAboutChange} placeholder="4 years at KL University" />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Primary bio paragraph</label>
                        <textarea
                            name="text1"
                            value={aboutData.text1 || ''}
                            onChange={handleAboutChange}
                            rows="4"
                            className="w-full bg-[#FFFFFF] border border-[#DDE7E5] rounded-[8px] p-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] resize-y leading-relaxed"
                            placeholder="Primary bio..."
                        />
                    </div>

                    <div>
                        <ImageUpload
                            label="About photo (Optional)"
                            helperText="Upload image or provide direct link"
                            compact={true}
                            currentImage={aboutData.image}
                            onImageUploaded={(url) => setAboutData(prev => ({ ...prev, image: url }))}
                            onImageRemoved={handleClearAboutImage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;

const InputField = ({ label, name, value, onChange, type = "text", placeholder }) => (
    <div>
        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">{label}</label>
        <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            className="w-full bg-[#FFFFFF] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
            placeholder={placeholder}
        />
    </div>
);
