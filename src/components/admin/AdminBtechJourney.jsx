import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Trash2, Save, Film, Image as ImageIcon, Youtube, Instagram, GraduationCap, ChevronUp, ChevronDown, Eye, EyeOff, Link } from 'lucide-react';
import ImageUpload from './ImageUpload';

const YEAR_OPTIONS = ['Year 1', 'Year 2', 'Year 3', 'Year 4'];
const TYPE_OPTIONS = [
  { value: 'youtube', label: 'YouTube / Shorts', icon: Youtube, color: 'text-red-500', bg: 'bg-red-50' },
  { value: 'instagram', label: 'Instagram Reel / Post', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-50' },
  { value: 'local-video', label: 'Local Video (.mp4)', icon: Film, color: 'text-[#102A28]', bg: 'bg-[#EEF4F3]' },
  { value: 'image', label: 'Photo / Image Upload', icon: ImageIcon, color: 'text-[#4B5F5C]', bg: 'text-[#4B5F5C]' },
];

const ASPECT_RATIO_OPTIONS = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '9:16', label: 'Portrait (9:16)' },
  { value: '16:9', label: 'Landscape (16:9)' },
  { value: 'auto', label: 'Auto height' },
];

const defaultHighlight = {
  id: Date.now(),
  title: '',
  description: '',
  url: '',
  type: 'image',
  year: 'Year 1',
  isShort: false,
  aspectRatio: '1:1',
};

const HighlightForm = ({ highlight, onChange, onDelete, index, totalCount, onMoveUp, onMoveDown }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const typeInfo = TYPE_OPTIONS.find(t => t.value === highlight.type) || TYPE_OPTIONS[0];

  return (
    <div className="bg-white rounded-[12px] border border-[#DDE7E5] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#DDE7E5] bg-[#F7FAFA]">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-[6px] ${typeInfo.bg} flex items-center justify-center flex-shrink-0`}>
            <typeInfo.icon size={16} className={typeInfo.color} />
          </div>
          <div>
            <p className="text-[#102A28] font-medium text-sm truncate max-w-[220px]">
              {highlight.title || `Highlight #${index + 1}`}
            </p>
            <p className="text-[#8A9B98] text-xs">{typeInfo.label} • {highlight.year}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Reorder */}
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1.5 text-[#8A9B98] hover:text-[#0F766E] disabled:opacity-30 transition-colors"
            title="Move up"
          >
            <ChevronUp size={16} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === totalCount - 1}
            className="p-1.5 text-[#8A9B98] hover:text-[#0F766E] disabled:opacity-30 transition-colors"
            title="Move down"
          >
            <ChevronDown size={16} />
          </button>

          {/* Expand */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-[#4B5F5C] hover:text-[#0F766E] hover:bg-[#EEF4F3] rounded transition-colors"
          >
            {isExpanded ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-[#DC2626] hover:bg-[#FEF2F2] rounded transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Form Body */}
      {isExpanded && (
        <div className="p-5 space-y-4">
          {/* Type selector */}
          <div>
            <label className="block text-xs font-medium text-[#4B5F5C] mb-2">Media type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange('type', opt.value)}
                  className={`flex items-center gap-2 p-2.5 rounded-[8px] border transition-colors text-left ${
                    highlight.type === opt.value
                      ? 'border-[#102A28] bg-[#EEF4F3] text-[#102A28]'
                      : 'border-[#DDE7E5] bg-[#F7FAFA] text-[#4B5F5C] hover:text-[#0F766E]'
                  }`}
                >
                  <opt.icon size={15} className={highlight.type === opt.value ? 'text-[#102A28]' : opt.color} />
                  <span className="text-xs font-medium truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload image / URL field */}
          {highlight.type === 'image' ? (
            <div className="space-y-3">
              <ImageUpload
                label="Highlight image"
                compact={true}
                currentImage={highlight.url}
                onImageUploaded={(url) => onChange('url', url)}
                onImageRemoved={() => onChange('url', '')}
              />
              <div>
                <label className="block text-xs font-medium text-[#4B5F5C] mb-1">Or direct image URL</label>
                <div className="relative">
                  <Link size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9B98]" />
                  <input
                    type="text"
                    value={highlight.url || ''}
                    onChange={(e) => onChange('url', e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] pl-10 pr-3.5 h-10 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">
                {highlight.type === 'youtube' ? 'YouTube / Shorts URL' :
                 highlight.type === 'instagram' ? 'Instagram post / Reel URL' :
                 'Local video path (e.g. /my-video.mp4)'}
              </label>
              <div className="relative">
                <Link size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9B98]" />
                <input
                  type="text"
                  value={highlight.url || ''}
                  onChange={(e) => onChange('url', e.target.value)}
                  placeholder={
                    highlight.type === 'youtube' ? 'https://youtube.com/shorts/...' :
                    highlight.type === 'instagram' ? 'https://instagram.com/reel/...' :
                    '/my-video.mp4'
                  }
                  className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] pl-10 pr-3.5 h-10 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
                />
              </div>
            </div>
          )}

          {/* Aspect Ratio Selector */}
          <div>
            <label className="block text-xs font-medium text-[#4B5F5C] mb-2">Display size</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ASPECT_RATIO_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange('aspectRatio', opt.value)}
                  className={`p-2 rounded-[8px] border text-center text-xs font-medium transition-colors ${
                    (highlight.aspectRatio || '1:1') === opt.value
                      ? 'border-[#102A28] bg-[#EEF4F3] text-[#102A28]'
                      : 'border-[#DDE7E5] bg-[#F7FAFA] text-[#4B5F5C] hover:text-[#0F766E]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Title</label>
              <input
                type="text"
                value={highlight.title || ''}
                onChange={(e) => onChange('title', e.target.value)}
                placeholder="e.g. Hackathon Project Demo"
                className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Year</label>
              <select
                value={highlight.year || 'Year 1'}
                onChange={(e) => onChange('year', e.target.value)}
                className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
              >
                {YEAR_OPTIONS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Description</label>
            <textarea
              value={highlight.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Brief note about this memory..."
              rows={2}
              className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] p-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] resize-y leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const AdminBtechJourney = () => {
  const { data, updateData } = useData();
  const [highlights, setHighlights] = useState(data?.btechJourney?.highlights || []);
  const [sectionTitle, setSectionTitle] = useState(data?.btechJourney?.sectionTitle || '4 Years of Building & Growing');
  const [sectionSubtitle, setSectionSubtitle] = useState(data?.btechJourney?.sectionSubtitle || 'Every session, every event, every moment of hustle — captured and preserved.');
  const [isSaving, setIsSaving] = useState(false);

  const addHighlight = () => {
    setHighlights(prev => [...prev, { ...defaultHighlight, id: Date.now() }]);
  };

  const updateHighlight = (id, field, value) => {
    setHighlights(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const deleteHighlight = (id) => {
    if (!window.confirm('Delete this highlight?')) return;
    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setHighlights(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index) => {
    if (index === highlights.length - 1) return;
    setHighlights(prev => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateData('btechJourney', {
      sectionTitle,
      sectionSubtitle,
      highlights,
    });
    setIsSaving(false);
    alert('B.Tech Journey saved.');
  };

  return (
    <div className="space-y-6 text-[#102A28] max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#102A28]">B.Tech journey</h2>
          <p className="text-xs text-[#8A9B98]">Manage 4-year journey highlights — videos, reels, and photos</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addHighlight}
            className="btn-secondary"
          >
            <Plus size={16} />
            <span>Add highlight</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary"
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save changes'}</span>
          </button>
        </div>
      </div>

      {/* Section Text Config */}
      <div className="bg-white rounded-[12px] border border-[#DDE7E5] p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-[#102A28]">Section headings</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Section heading</label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] h-10 px-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Section subtitle</label>
            <textarea
              value={sectionSubtitle}
              onChange={(e) => setSectionSubtitle(e.target.value)}
              rows={2}
              className="w-full bg-[#F7FAFA] border border-[#DDE7E5] rounded-[8px] p-3 text-sm text-[#102A28] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] resize-y"
            />
          </div>
        </div>
      </div>

      {/* Highlights List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[#102A28]">
          Highlights ({highlights.length})
        </h3>

        {highlights.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[12px] border border-[#DDE7E5]">
            <GraduationCap size={36} className="text-[#8A9B98] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#102A28]">No highlights yet</p>
            <p className="text-xs text-[#8A9B98] mt-1">Add videos, reels, or memory photos.</p>
            <button
              type="button"
              onClick={addHighlight}
              className="btn-primary mt-4"
            >
              <Plus size={16} /> Add first highlight
            </button>
          </div>
        ) : (
          highlights.map((h, idx) => (
            <HighlightForm
              key={h.id}
              highlight={h}
              index={idx}
              totalCount={highlights.length}
              onChange={(field, value) => updateHighlight(h.id, field, value)}
              onDelete={() => deleteHighlight(h.id)}
              onMoveUp={() => moveUp(idx)}
              onMoveDown={() => moveDown(idx)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminBtechJourney;
