import React from 'react';
import { Trash2, Star, Eye, EyeOff, X, Archive, CheckCircle2, XCircle, MoreVertical } from 'lucide-react';

const BulkActionToolbar = ({
    selectedCount,
    onBulkDelete,
    onBulkFeature,
    onBulkUnfeature,
    onBulkPublish,
    onBulkDraft,
    onClearSelection
}) => {
    if (selectedCount === 0) return null;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
            <div className="bg-[#0F0F0F] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 flex items-center gap-4">
                {/* Selection Count */}
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-xl">
                    <span className="text-orange-500 font-black text-sm">
                        {selectedCount} Selected
                    </span>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-white/10" />

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onBulkFeature}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-orange-500 text-gray-400 hover:text-white rounded-xl transition-all font-bold text-sm"
                        title="Feature Selected"
                    >
                        <Star size={16} />
                        <span className="hidden sm:inline">Feature</span>
                    </button>

                    <button
                        onClick={onBulkUnfeature}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-gray-500 text-gray-400 hover:text-white rounded-xl transition-all font-bold text-sm"
                        title="Unfeature Selected"
                    >
                        <Star size={16} />
                        <span className="hidden sm:inline">Unfeature</span>
                    </button>

                    <button
                        onClick={onBulkPublish}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-green-500 text-gray-400 hover:text-white rounded-xl transition-all font-bold text-sm"
                        title="Publish Selected"
                    >
                        <Eye size={16} />
                        <span className="hidden sm:inline">Publish</span>
                    </button>

                    <button
                        onClick={onBulkDraft}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-yellow-500 text-gray-400 hover:text-white rounded-xl transition-all font-bold text-sm"
                        title="Draft Selected"
                    >
                        <EyeOff size={16} />
                        <span className="hidden sm:inline">Draft</span>
                    </button>

                    <button
                        onClick={onBulkDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500 text-gray-400 hover:text-white rounded-xl transition-all font-bold text-sm"
                        title="Delete Selected"
                    >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Delete</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-white/10" />

                {/* Clear Selection */}
                <button
                    onClick={onClearSelection}
                    className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
                    title="Clear Selection"
                >
                    <X size={20} />
                </button>
            </div>
        </motion.div>
    );
};

export default BulkActionToolbar;
