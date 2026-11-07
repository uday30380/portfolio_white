import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Save, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';

const AdminFooter = () => {
    const { data, updateData } = useData();
    const [footerData, setFooterData] = useState(data?.footer || {
        tagline: '',
        copyright: '',
        links: []
    });

    const handleSave = async (e) => {
        e.preventDefault();
        await updateData('footer', footerData);
        alert('Footer settings saved.');
    };

    const handleLinkChange = (index, field, value) => {
        const newLinks = [...(footerData.links || [])];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setFooterData({ ...footerData, links: newLinks });
    };

    const addLink = () => {
        setFooterData({
            ...footerData,
            links: [...(footerData.links || []), { name: '', url: '' }]
        });
    };

    const removeLink = (index) => {
        const newLinks = (footerData.links || []).filter((_, i) => i !== index);
        setFooterData({ ...footerData, links: newLinks });
    };

    return (
        <div className="space-y-6 max-w-4xl text-[#102A28]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-[#102A28]">Footer configuration</h2>
                    <p className="text-xs text-[#8A9B98]">Tagline, copyright notice, and social links</p>
                </div>
                <button
                    type="submit"
                    form="footerForm"
                    className="btn-primary"
                >
                    <Save size={16} />
                    <span>Save footer</span>
                </button>
            </div>

            <div className="bg-white rounded-[12px] border border-[#DDE7E5] p-6 md:p-8 shadow-sm">
                <form id="footerForm" onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Tagline / Subtitle</label>
                        <input
                            type="text"
                            value={footerData.tagline || ''}
                            onChange={(e) => setFooterData({ ...footerData, tagline: e.target.value })}
                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                            placeholder="Full-stack developer and designer"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Copyright text</label>
                        <input
                            type="text"
                            value={footerData.copyright || ''}
                            onChange={(e) => setFooterData({ ...footerData, copyright: e.target.value })}
                            className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                            placeholder="© 2026 Uday Kiran Vempati. All rights reserved."
                        />
                    </div>

                    <div className="space-y-3 pt-4 border-t border-[#DDE7E5]">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-medium text-[#102A28]">Social & navigation links</label>
                            <button
                                type="button"
                                onClick={addLink}
                                className="text-xs text-[#0F766E] hover:underline flex items-center gap-1 font-medium"
                            >
                                <Plus size={14} />
                                <span>Add link</span>
                            </button>
                        </div>

                        {(footerData.links || []).map((link, index) => (
                            <div key={index} className="flex gap-3 items-center bg-[#F7FAFA] p-3 rounded-[8px] border border-[#DDE7E5]">
                                <LinkIcon size={15} className="text-[#8A9B98] shrink-0" />
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={link.name}
                                        onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                                        placeholder="Label (e.g. GitHub)"
                                        className="bg-white border border-[#DDE7E5] rounded-[6px] h-9 px-3 text-xs text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                    />
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                        placeholder="URL (https://...)"
                                        className="bg-white border border-[#DDE7E5] rounded-[6px] h-9 px-3 text-xs text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeLink(index)}
                                    className="p-1.5 text-[#8A9B98] hover:text-[#DC2626] rounded transition-colors"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminFooter;
