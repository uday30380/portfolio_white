import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Trash2, Folder, Image as ImageIcon, Save } from 'lucide-react';
import ImageUpload from './ImageUpload';

const AdminFileManager = () => {
    const { data, updateData } = useData();
    const [assets, setAssets] = useState(data.assets || []);
    const [newUrl, setNewUrl] = useState('');
    const [newName, setNewName] = useState('');
    const [newImage, setNewImage] = useState('');

    const handleAdd = () => {
        if (!newUrl.trim()) return;
        setAssets([{ id: Date.now(), name: newName || 'Asset item', url: newUrl, image: newImage }, ...assets]);
        setNewUrl('');
        setNewName('');
        setNewImage('');
    };

    const handleDelete = (id) => {
        setAssets(assets.filter(a => a.id !== id));
    };

    const handleSave = async () => {
        await updateData('assets', assets);
        alert('Media assets saved.');
    };

    return (
        <div className="space-y-6 text-[#102A28]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-[#102A28]">Media & assets</h2>
                    <p className="text-xs text-[#8A9B98]">Manage uploaded images, files, and asset links</p>
                </div>
                <button
                    type="button"
                    onClick={handleSave}
                    className="btn-primary"
                >
                    <Save size={16} />
                    <span>Save assets</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Uploader Column */}
                <div className="lg:col-span-1">
                    <div className="p-6 bg-white border border-[#DDE7E5] rounded-[12px] space-y-4 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#102A28]">Add new asset</h3>

                        <div>
                            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Asset name</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="e.g. Hero Pattern"
                                className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                            />
                        </div>

                        <div>
                            <ImageUpload
                                label="Upload image"
                                helperText="Upload to ImgBB to auto-fill asset URL"
                                compact={true}
                                currentImage={newImage || newUrl}
                                onImageUploaded={(url) => {
                                    setNewUrl(url);
                                    setNewImage(url);
                                }}
                                onImageRemoved={() => {
                                    setNewUrl('');
                                    setNewImage('');
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Or direct URL</label>
                            <input
                                type="text"
                                value={newUrl}
                                onChange={(e) => {
                                    setNewUrl(e.target.value);
                                    if (!newImage) setNewImage(e.target.value);
                                }}
                                placeholder="https://..."
                                className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleAdd}
                            className="btn-secondary w-full"
                        >
                            <Plus size={15} />
                            <span>Add to list</span>
                        </button>
                    </div>
                </div>

                {/* Assets Grid */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {assets.map((asset) => (
                            <div
                                key={asset.id}
                                className="bg-white p-4 rounded-[12px] border border-[#DDE7E5] shadow-sm flex flex-col justify-between"
                            >
                                <div>
                                    <div className="aspect-video bg-[#EEF4F3] rounded-[8px] mb-3 overflow-hidden relative border border-[#DDE7E5]">
                                        {(asset.image || asset.url?.match(/\.(jpeg|jpg|gif|png|webp|svg)$/)) ? (
                                            <img
                                                src={asset.image?.trim() || asset.url?.trim() || null}
                                                alt={asset.name}
                                                onError={(e) => { e.currentTarget.src = '/uday-portrait.png'; }}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-[#8A9B98]">
                                                <ImageIcon size={32} />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(asset.id)}
                                            className="absolute top-2 right-2 p-1.5 bg-white/90 text-[#DC2626] hover:bg-[#FEF2F2] rounded-[6px] border border-[#DDE7E5] transition-colors"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                    <h4 className="font-medium text-[#102A28] text-sm mb-1 line-clamp-1">{asset.name}</h4>
                                    <p className="text-xs text-[#8A9B98] truncate">
                                        {asset.url}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {assets.length === 0 && (
                        <div className="py-24 bg-white rounded-[12px] border border-[#DDE7E5] flex flex-col items-center justify-center text-center p-6">
                            <Folder size={36} className="text-[#8A9B98] mb-3" />
                            <h3 className="text-base font-semibold text-[#102A28] mb-1">No assets</h3>
                            <p className="text-xs text-[#8A9B98]">Upload images or add links using the panel on the left.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminFileManager;
