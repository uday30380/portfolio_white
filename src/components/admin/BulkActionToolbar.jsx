import React from 'react';
import { Trash2, Star, Eye, EyeOff, X } from 'lucide-react';

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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-white border border-[#DDE7E5] rounded-[12px] shadow-lg p-3 flex items-center gap-3">
                {/* Selection Count */}
                <div className="px-2.5 py-1 bg-[#EEF4F3] rounded-[6px]">
                    <span className="text-[#102A28] font-semibold text-xs">
                        {selectedCount} selected
                    </span>
                </div>

                <div className="w-px h-5 bg-[#DDE7E5]" />

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={onBulkFeature}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7FAFA] hover:bg-[#EEF4F3] text-[#102A28] rounded-[6px] border border-[#DDE7E5] text-xs font-medium transition-colors"
                        title="Feature selected"
                    >
                        <Star size={14} className="text-[#102A28]" />
                        <span className="hidden sm:inline">Feature</span>
                    </button>

                    <button
                        type="button"
                        onClick={onBulkUnfeature}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7FAFA] hover:bg-[#EEF4F3] text-[#4B5F5C] rounded-[6px] border border-[#DDE7E5] text-xs font-medium transition-colors"
                        title="Unfeature selected"
                    >
                        <Star size={14} />
                        <span className="hidden sm:inline">Unfeature</span>
                    </button>

                    <button
                        type="button"
                        onClick={onBulkPublish}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7FAFA] hover:bg-[#EEF4F3] text-[#15803D] rounded-[6px] border border-[#DDE7E5] text-xs font-medium transition-colors"
                        title="Publish selected"
                    >
                        <Eye size={14} />
                        <span className="hidden sm:inline">Publish</span>
                    </button>

                    <button
                        type="button"
                        onClick={onBulkDraft}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7FAFA] hover:bg-[#EEF4F3] text-[#4B5F5C] rounded-[6px] border border-[#DDE7E5] text-xs font-medium transition-colors"
                        title="Draft selected"
                    >
                        <EyeOff size={14} />
                        <span className="hidden sm:inline">Draft</span>
                    </button>

                    <button
                        type="button"
                        onClick={onBulkDelete}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF2F2] hover:bg-red-100 text-[#DC2626] rounded-[6px] border border-[#FCA5A5] text-xs font-medium transition-colors"
                        title="Delete selected"
                    >
                        <Trash2 size={14} />
                        <span className="hidden sm:inline">Delete</span>
                    </button>
                </div>

                <div className="w-px h-5 bg-[#DDE7E5]" />

                {/* Clear Selection */}
                <button
                    type="button"
                    onClick={onClearSelection}
                    className="p-1.5 hover:bg-[#EEF4F3] text-[#8A9B98] hover:text-[#0F766E] rounded-[6px] transition-colors"
                    title="Clear selection"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default BulkActionToolbar;
