import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ExternalLink, ChevronLeft, ChevronRight, Camera, Film, Star, Sparkles, GraduationCap, Play, Image as ImageIcon, X, Maximize2 } from 'lucide-react';

/* ──────────────────────────────────────────────────
   URL HELPERS
────────────────────────────────────────────────── */
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch)
    return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${shortsMatch[1]}&controls=1&playsinline=1`;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch)
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=1&playsinline=1`;
  return null;
};

const getInstagramEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/);
  if (match) return `https://www.instagram.com/p/${match[1]}/embed/`;
  return null;
};

const getMediaType = (item) => {
  if (!item?.url) return 'image';
  if (item.type) return item.type;
  if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) return 'youtube';
  if (item.url.includes('instagram.com')) return 'instagram';
  if (item.url.match(/\.(mp4|webm|ogg|mov)$/i) || item.url.startsWith('/')) return 'local-video';
  return 'image';
};

/* --------------------------------------------------
   LOCAL VIDEO CARD (Persistent Mute & Auto Play)
-------------------------------------------------- */
const LocalVideoCard = ({ item, isActive, isMuted, onToggleMute, onOpenFull }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const inView = useInView(containerRef, { threshold: 0.4 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !(video instanceof HTMLVideoElement)) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    if (inView && isActive) {
      video.muted = isMuted;
      video.play().catch(() => {});
    } else {
      video.pause();
    }

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [inView, isActive, isMuted]);

  const handleMuteClick = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video instanceof HTMLVideoElement) {
      const next = !isMuted;
      video.muted = next;
    }
    if (onToggleMute) onToggleMute();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-pointer group select-none"
      onClick={onOpenFull}
      title="Click to watch full video"
    >
      <video
        ref={videoRef}
        src={item.url?.trim() ? item.url : null}
        loop
        playsInline
        muted={isMuted}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        style={{ display: 'block' }}
        title={item.caption || item.title ? `Uday Kiran Vempati – ${item.caption || item.title} – B.Tech Journey Video` : 'Uday Kiran Vempati – B.Tech Journey Video'}
        aria-label={item.caption || item.title ? `${item.caption || item.title} – B.Tech Journey of Uday Kiran Vempati` : 'B.Tech Journey video of Uday Kiran Vempati'}
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
            <Play size={26} className="text-white ml-1" />
          </div>
        </div>
      )}

      {/* Hover prompt to view full */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100">
        <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-bold flex items-center gap-2 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-all">
          <Maximize2 size={13} className="text-orange-400" />
          <span>Click for Full Video</span>
        </div>
      </div>

      {/* Mute/unmute button — saved preference */}
      <button
        onClick={handleMuteClick}
        className="absolute bottom-4 right-4 w-10 h-10 bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-orange-500 hover:border-orange-500 transition-all duration-200 z-20 shadow-lg"
        title={isMuted ? 'Unmute Audio (Saves Preference)' : 'Mute Audio (Saves Preference)'}
      >
        {isMuted ? <VolumeX size={17} className="text-white" /> : <Volume2 size={17} className="text-white" />}
      </button>
    </div>
  );
};

/* --------------------------------------------------
   YOUTUBE CARD
-------------------------------------------------- */
const YouTubeCard = ({ item, onOpenFull }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3, once: true });
  const embedUrl = getYouTubeEmbedUrl(item.url);
  const show = inView;

  return (
    <div ref={ref} className="relative w-full h-full group select-none">
      {show && embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title={item.caption || item.title ? `Uday Kiran Vempati – ${item.caption || item.title} – B.Tech Journey` : `Uday Kiran Vempati – B.Tech Journey YouTube Video`}
        />
      ) : (
        <div
          onClick={onOpenFull}
          className="w-full h-full bg-black flex items-center justify-center cursor-pointer"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Play size={28} className="text-white ml-1" />
            </div>
            <span className="text-white text-xs font-bold uppercase tracking-widest">YouTube</span>
          </div>
        </div>
      )}

      {/* Full View Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onOpenFull) onOpenFull();
        }}
        className="absolute top-3 right-16 px-2.5 py-1 bg-black/75 hover:bg-red-600 backdrop-blur-md rounded-full flex items-center gap-1 border border-white/20 text-white text-[11px] font-bold transition-all duration-200 z-20 shadow-lg"
        title="Open Fullscreen Video"
      >
        <Maximize2 size={12} />
        <span className="hidden sm:inline">Full Video</span>
      </button>

      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 right-4 w-9 h-9 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-red-600 hover:border-red-600 transition-all duration-200 z-10"
          title="Open on YouTube"
        >
          <ExternalLink size={14} className="text-white" />
        </a>
      )}
    </div>
  );
};

/* --------------------------------------------------
   INSTAGRAM CARD
-------------------------------------------------- */
const InstagramCard = ({ item, onOpenFull }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3, once: true });
  const embedUrl = getInstagramEmbedUrl(item.url);
  const show = inView;

  return (
    <div ref={ref} className="relative w-full h-full group select-none">
      {show && embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          frameBorder="0"
          scrolling="no"
          allowTransparency
          title={item.caption || item.title ? `Uday Kiran Vempati – ${item.caption || item.title} – B.Tech Journey` : `Uday Kiran Vempati – B.Tech Journey Instagram Post`}
        />
      ) : (
        <div
          onClick={onOpenFull}
          className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center cursor-pointer"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Camera size={28} className="text-white" />
            </div>
            <span className="text-white text-xs font-bold uppercase tracking-widest">Instagram</span>
          </div>
        </div>
      )}

      {/* Full View Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onOpenFull) onOpenFull();
        }}
        className="absolute top-3 right-16 px-2.5 py-1 bg-black/75 hover:bg-pink-600 backdrop-blur-md rounded-full flex items-center gap-1 border border-white/20 text-white text-[11px] font-bold transition-all duration-200 z-20 shadow-lg"
        title="Open Fullscreen Post"
      >
        <Maximize2 size={12} />
        <span className="hidden sm:inline">Full Post</span>
      </button>

      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 right-4 w-9 h-9 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-pink-600 hover:border-pink-600 transition-all duration-200 z-10"
          title="Open on Instagram"
        >
          <ExternalLink size={14} className="text-white" />
        </a>
      )}
    </div>
  );
};

/* --------------------------------------------------
   IMAGE CARD
-------------------------------------------------- */
const ImageCard = ({ item, onOpenFull }) => (
  <div
    onClick={onOpenFull}
    className="relative w-full h-full overflow-hidden group cursor-pointer select-none"
    title="Click to view full image"
  >
    <img
      src={item.url?.trim() ? item.url : null}
      alt={item.caption || item.title
        ? `Uday Kiran Vempati – ${item.caption || item.title} – B.Tech Journey at KL University`
        : 'Uday Kiran Vempati – B.Tech Journey at KL University'
      }
      title={item.caption || item.title ? `${item.caption || item.title} – Uday Kiran Vempati` : 'Uday Kiran Vempati – B.Tech Journey'}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />

    {/* Hover Prompt */}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100">
      <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-bold flex items-center gap-2 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-all">
        <Maximize2 size={13} className="text-orange-400" />
        <span>Click for Full Image</span>
      </div>
    </div>
  </div>
);

/* --------------------------------------------------
   MEDIA RENDERER
-------------------------------------------------- */
const MediaRenderer = ({ item, isActive, isMuted, onToggleMute, onOpenFull }) => {
  const type = getMediaType(item);
  if (type === 'local-video') return <LocalVideoCard item={item} isActive={isActive} isMuted={isMuted} onToggleMute={onToggleMute} onOpenFull={onOpenFull} />;
  if (type === 'youtube')     return <YouTubeCard item={item} onOpenFull={onOpenFull} />;
  if (type === 'instagram')   return <InstagramCard item={item} onOpenFull={onOpenFull} />;
  return <ImageCard item={item} onOpenFull={onOpenFull} />;
};

/* --------------------------------------------------
   FLOATING PARTICLES
-------------------------------------------------- */
const FloatingParticles = () => {
  const particles = React.useMemo(() => {
    return [...Array(18)].map((_, i) => ({
      id: i,
      left: `${(i * 17) % 100}%`,
      top: `${(i * 23) % 100}%`,
      duration: 3 + (i % 4),
      delay: i % 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 bg-orange-500/30 rounded-full"
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -30, 0], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

/* ──────────────────────────────────────────────────
   SIDEBAR THUMBNAIL
────────────────────────────────────────────────── */
const SidebarItem = ({ item, index, isActive, onClick, onOpenFull }) => {
  const type = getMediaType(item);
  return (
    <motion.div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 border group select-none ${
        isActive
          ? 'bg-orange-500/10 border-orange-500/40'
          : 'bg-white/3 border-white/5 hover:border-white/20 hover:bg-white/5'
      }`}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      {/* Portrait thumbnail (9:16) */}
      <div
        className="w-14 rounded-xl overflow-hidden bg-black/50 flex-shrink-0 relative group/thumb"
        style={{ aspectRatio: '9/16' }}
        onClick={(e) => {
          if (onOpenFull) {
            e.stopPropagation();
            onOpenFull();
          }
        }}
        title="Click to view full image or video"
      >
        {type === 'image' ? (
          <img src={item.url?.trim() ? item.url : null} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${
            type === 'youtube' ? 'bg-red-900/60' :
            type === 'instagram' ? 'bg-purple-900/60' : 'bg-orange-900/60'
          }`}>
            {type === 'youtube'   ? <Play size={14} className="text-red-400" /> :
             type === 'instagram' ? <Camera size={14} className="text-purple-400" /> :
             <Film size={14} className="text-orange-400" />}
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
          <Maximize2 size={13} className="text-white" />
        </div>
        {isActive && (
          <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <Play size={9} className="text-white ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-1">
        <p className={`font-bold text-sm truncate leading-tight ${isActive ? 'text-orange-400' : 'text-white'}`}>
          {item.title || 'Untitled'}
        </p>
        {item.year && <p className="text-gray-500 text-[11px] font-bold mt-1">{item.year}</p>}
        <p className="text-gray-500 text-[11px] mt-1 line-clamp-2 leading-relaxed">{item.description || ''}</p>
      </div>

      {/* View Full Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onOpenFull) onOpenFull();
        }}
        className="p-2 text-gray-500 hover:text-white hover:bg-orange-500/20 rounded-xl transition-colors flex-shrink-0"
        title="View Fullscreen"
      >
        <Maximize2 size={14} />
      </button>
    </motion.div>
  );
};

/* ──────────────────────────────────────────────────
   FULLSCREEN LIGHTBOX MODAL (Full Image & Video)
────────────────────────────────────────────────── */
const BtechJourneyLightbox = ({
  isOpen,
  item,
  currentIndex,
  totalCount,
  onClose,
  onPrev,
  onNext,
}) => {
  // Prevent body scroll and handle keyboard events
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !item) return null;

  const type = getMediaType(item);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 select-none"
        onClick={onClose}
      >
        {/* Top Header Bar */}
        <div
          className="flex items-center justify-between w-full max-w-7xl mx-auto z-20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Item Meta */}
          <div className="flex items-center gap-3">
            <span className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-md ${
              type === 'youtube'     ? 'bg-red-600 text-white' :
              type === 'instagram'   ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' :
              type === 'local-video' ? 'bg-orange-500 text-white' :
              'bg-[#102A28] text-white'
            }`}>
              {type === 'youtube'     && <><Play size={12} className="fill-white" /> YouTube</>}
              {type === 'instagram'   && <><Camera size={12} /> Instagram</>}
              {type === 'local-video' && <><Film size={12} /> Video</>}
              {type === 'image'       && <><ImageIcon size={12} /> Photo</>}
            </span>

            {item.year && (
              <span className="text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30 px-2.5 py-1 rounded-full">
                {item.year}
              </span>
            )}

            <span className="text-gray-400 text-xs font-bold hidden sm:inline-block">
              {currentIndex + 1} of {totalCount}
            </span>
          </div>

          {/* Action Buttons: Keyboard shortcut info & Close */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs hidden md:inline-block mr-2">
              Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-300 font-mono text-[11px]">Esc</kbd> to close • <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-300 font-mono text-[11px]">←</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-300 font-mono text-[11px]">→</kbd> to browse
            </span>

            <button
              onClick={onClose}
              className="w-11 h-11 bg-white/10 hover:bg-orange-500 text-white rounded-full flex items-center justify-center border border-white/20 hover:border-orange-500 transition-all duration-200 shadow-xl"
              title="Close (Esc)"
              aria-label="Close fullscreen view"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Center Media Stage */}
        <div
          className="relative flex-1 w-full max-w-7xl mx-auto flex items-center justify-center my-2 sm:my-4 overflow-hidden"
          onClick={onClose}
        >
          {/* Navigation - Left */}
          {totalCount > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              disabled={currentIndex === 0}
              className="absolute left-1 sm:left-4 z-30 w-12 h-12 rounded-full bg-black/60 hover:bg-orange-500 text-white flex items-center justify-center border border-white/20 hover:border-orange-500 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-2xl backdrop-blur-md"
              title="Previous (Left Arrow)"
              aria-label="Previous Highlight"
            >
              <ChevronLeft size={26} />
            </button>
          )}

          {/* Navigation - Right */}
          {totalCount > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              disabled={currentIndex === totalCount - 1}
              className="absolute right-1 sm:right-4 z-30 w-12 h-12 rounded-full bg-black/60 hover:bg-orange-500 text-white flex items-center justify-center border border-white/20 hover:border-orange-500 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-2xl backdrop-blur-md"
              title="Next (Right Arrow)"
              aria-label="Next Highlight"
            >
              <ChevronRight size={26} />
            </button>
          )}

          {/* Media View */}
          <div
            className="relative max-w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {type === 'image' && item.url?.trim() && (
              <motion.img
                key={`lightbox-img-${item.url}-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                src={item.url}
                alt={item.title || 'B.Tech Journey Photo'}
                className="max-h-[75vh] sm:max-h-[80vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            )}

            {type === 'local-video' && item.url?.trim() && (
              <motion.div
                key={`lightbox-vid-${item.url}-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="max-h-[75vh] sm:max-h-[80vh] max-w-[92vw] flex items-center justify-center bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              >
                <video
                  src={item.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[75vh] sm:max-h-[80vh] max-w-[92vw] object-contain rounded-2xl outline-none"
                  title={item.title || 'B.Tech Journey Video'}
                />
              </motion.div>
            )}

            {type === 'youtube' && (getYouTubeEmbedUrl(item.url) || item.url?.trim()) && (
              <motion.div
                key={`lightbox-yt-${item.url}-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="w-[92vw] max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black"
              >
                <iframe
                  src={getYouTubeEmbedUrl(item.url)?.replace('&mute=1', '') || (item.url?.trim() ? item.url : null)}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={item.title || 'B.Tech Journey YouTube Video'}
                />
              </motion.div>
            )}

            {type === 'instagram' && (getInstagramEmbedUrl(item.url) || item.url?.trim()) && (
              <motion.div
                key={`lightbox-ig-${item.url}-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="w-[92vw] max-w-md h-[75vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black"
              >
                <iframe
                  src={getInstagramEmbedUrl(item.url) || (item.url?.trim() ? item.url : null)}
                  className="w-full h-full"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency
                  title={item.title || 'B.Tech Journey Instagram Post'}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Description & Link Bar */}
        <div
          className="w-full max-w-4xl mx-auto z-20 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h3 className="text-white font-bold text-sm sm:text-base truncate">
                {item.title || 'B.Tech Highlight'}
              </h3>
              {item.year && (
                <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                  {item.year}
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          {item.url && (type === 'youtube' || type === 'instagram') && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-orange-500 text-white rounded-full text-xs font-bold transition-colors flex-shrink-0"
            >
              <span>Open Link</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   MAIN COMPONENT
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const BtechJourney = () => {
  const { data } = useData();
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeYear, setActiveYear] = useState('All');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_video_muted');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      try {
        localStorage.setItem('portfolio_video_muted', JSON.stringify(next));
      } catch (e) {
        console.error('Error saving audio mute preference:', e);
      }
      return next;
    });
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const springProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const y = useTransform(springProgress, [0, 1], [50, -50]);
  const opacity = useTransform(springProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const highlights = data?.btechJourney?.highlights || [
    {
      id: 1,
      title: 'Firebase Session – RPA Club',
      description: 'An exciting Firebase workshop session conducted under the RPA Club at KL University.',
      url: '/firebase session under RPA CLUB.mp4',
      type: 'local-video',
      year: 'Year 2',
      isShort: false,
    },
    {
      id: 2,
      title: 'Focus Under Pressure',
      description: 'Documenting the journey of staying focused and delivering under academic pressure.',
      url: '/focus under.mp4',
      type: 'local-video',
      year: 'Year 2',
      isShort: false,
    },
  ];

  const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4'];
  const filteredHighlights = activeYear === 'All'
    ? highlights
    : highlights.filter(h => h.year === activeYear || !h.year);
  const displayHighlights = filteredHighlights.length > 0 ? filteredHighlights : highlights;

  const goTo = useCallback((idx) => {
    setActiveIndex(Math.max(0, Math.min(idx, displayHighlights.length - 1)));
  }, [displayHighlights.length]);

  const next = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const prev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const openLightbox = useCallback((idx) => {
    const targetIdx = typeof idx === 'number' ? idx : activeIndex;
    setLightboxIndex(targetIdx);
    setActiveIndex(targetIdx);
    setIsLightboxOpen(true);
  }, [activeIndex]);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const prevLightbox = useCallback(() => {
    setLightboxIndex((p) => {
      const nextIdx = Math.max(0, p - 1);
      setActiveIndex(nextIdx);
      return nextIdx;
    });
  }, []);

  const nextLightbox = useCallback(() => {
    setLightboxIndex((p) => {
      const nextIdx = Math.min(displayHighlights.length - 1, p + 1);
      setActiveIndex(nextIdx);
      return nextIdx;
    });
  }, [displayHighlights.length]);

  const handleSelectYear = useCallback((year) => {
    setActiveYear(year);
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    if (isLightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, displayHighlights.length, isLightboxOpen, prev, next]);

  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const activeItem = displayHighlights[activeIndex];
  const activeType = getMediaType(activeItem);

  return (
    <section id="btech-journey" ref={sectionRef} className="relative py-24 overflow-hidden bg-[#030303]">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          aria-hidden
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(circle at center, rgba(249,115,22,0.06) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(circle at center, rgba(168,85,247,0.04) 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,125,68,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,125,68,0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
        <FloatingParticles />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-orange-500" />
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-5 py-2">
              <GraduationCap size={14} className="text-orange-500" />
              <span className="text-[11px] font-black tracking-[0.3em] text-orange-500 uppercase">B.Tech Journey</span>
              <Sparkles size={14} className="text-orange-500" />
            </div>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-orange-500" />
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-6">
            4 Years of
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Building &amp; Growing
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full"
                initial={{ width: 0 }}
                animate={inView ? { width: '100%' } : { width: 0 }}
                transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
              />
            </span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Every session, every event, every moment of hustle — captured and preserved.
            This is my B.Tech story at <span className="text-orange-500 font-bold">KL University</span>.
          </p>
        </motion.div>

        {/* Year Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-12 flex-wrap"
        >
          {['All', ...years].map((year) => (
            <motion.button
              key={year}
              onClick={() => handleSelectYear(year)}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                activeYear === year
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {year}
            </motion.button>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">

          {/* Left: Instagram Reel-style player */}
          <div className="lg:col-span-6 flex flex-col items-center">

            {/* Nav */}
            <div className="flex items-center justify-between w-full max-w-xs mb-5">
              <motion.button
                onClick={prev}
                disabled={activeIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-orange-500 rounded-full border border-white/10 hover:border-orange-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm"
                whileHover={activeIndex !== 0 ? { scale: 1.05, x: -2 } : {}}
                whileTap={activeIndex !== 0 ? { scale: 0.95 } : {}}
              >
                <ChevronLeft size={15} /> Prev
              </motion.button>

              <div className="flex items-center gap-2">
                {displayHighlights.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? 'w-7 h-2.5 bg-orange-500 shadow-[0_0_8px_rgba(255,125,68,0.6)]'
                        : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/50'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>

              <motion.button
                onClick={next}
                disabled={activeIndex === displayHighlights.length - 1}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-orange-500 rounded-full border border-white/10 hover:border-orange-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-sm"
                whileHover={activeIndex !== displayHighlights.length - 1 ? { scale: 1.05, x: 2 } : {}}
                whileTap={activeIndex !== displayHighlights.length - 1 ? { scale: 0.95 } : {}}
              >
                Next <ChevronRight size={15} />
              </motion.button>
            </div>

            {/* Active Highlight Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`relative w-full ${
                  activeItem?.aspectRatio === '16:9' ? 'max-w-[480px]' :
                  activeItem?.aspectRatio === '1:1' ? 'max-w-[380px]' :
                  activeItem?.aspectRatio === 'auto' ? 'max-w-[400px]' : 'max-w-[340px]'
                }`}
              >
                {/* Glow */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-b from-orange-500/30 via-orange-400/10 to-orange-600/30 rounded-3xl blur-lg pointer-events-none"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Card Container with Dynamic Aspect Ratio */}
                <div
                  onClick={() => openLightbox(activeIndex)}
                  className="relative bg-black rounded-2xl overflow-hidden border border-orange-500/20 shadow-2xl cursor-pointer group"
                  style={{
                    aspectRatio: activeItem?.aspectRatio === '1:1' ? '1/1' :
                                 activeItem?.aspectRatio === '16:9' ? '16/9' :
                                 activeItem?.aspectRatio === 'auto' ? 'auto' :
                                 (activeItem?.isShort ? '9/16' : '1/1')
                  }}
                  title="Click to view full image/video"
                >
                  <MediaRenderer
                    item={activeItem}
                    isActive={!isLightboxOpen}
                    isMuted={isMuted}
                    onToggleMute={toggleMute}
                    onOpenFull={() => openLightbox(activeIndex)}
                  />

                  {/* Clean SVG Type badge */}
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-md ${
                      activeType === 'youtube'     ? 'bg-red-600/90 text-white' :
                      activeType === 'instagram'   ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' :
                      activeType === 'local-video' ? 'bg-orange-500/90 text-white' :
                      'bg-black/60 text-white border border-white/20'
                    }`}>
                      {activeType === 'youtube'     && <><Play size={11} className="fill-white" /> YouTube</>}
                      {activeType === 'instagram'   && <><Camera size={11} /> Instagram</>}
                      {activeType === 'local-video' && <><Film size={11} /> Video</>}
                      {activeType === 'image'       && <><ImageIcon size={11} /> Photo</>}
                    </span>
                  </div>

                  {/* Top Right: Expand / Full Button & Index badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(activeIndex);
                      }}
                      className="px-2.5 py-1 bg-black/75 hover:bg-orange-500 text-white rounded-full flex items-center gap-1 text-[11px] font-bold backdrop-blur-md border border-white/20 hover:border-orange-500 transition-all duration-200 shadow-md group-hover:border-orange-500"
                      title="Open Fullscreen (Full Image / Video)"
                      aria-label="Open Fullscreen"
                    >
                      <Maximize2 size={11} />
                      <span className="hidden sm:inline">View Full</span>
                    </button>
                    <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                      <span className="text-white text-[11px] font-black">{activeIndex + 1}/{displayHighlights.length}</span>
                    </div>
                  </div>

                  {/* Bottom title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black via-black/70 to-transparent p-4 pointer-events-none">
                    {activeItem?.year && (
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">{activeItem.year}</span>
                    )}
                    {activeItem?.title && (
                      <h3 className="text-white font-black text-sm leading-tight mt-0.5">{activeItem.title}</h3>
                    )}
                  </div>
                </div>

                {/* Caption below */}
                <div
                  onClick={() => openLightbox(activeIndex)}
                  className="mt-4 flex items-start gap-3 px-1 cursor-pointer group"
                  title="Click to view full image/video"
                >
                  <div className="w-10 h-10 bg-orange-500 group-hover:scale-105 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30 transition-transform">
                    {activeType === 'image' ? <ImageIcon size={18} className="text-white" /> : <Film size={18} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white group-hover:text-orange-400 font-black text-base transition-colors">{activeItem?.title || 'Untitled'}</h3>
                      {activeItem?.year && (
                        <span className="text-[11px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                          {activeItem.year}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mt-1">{activeItem?.description || ''}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Sidebar list */}
          <div className="lg:col-span-6 space-y-3 max-h-[680px] overflow-y-auto pr-1 custom-scrollbar">
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4">
              All Highlights ({displayHighlights.length})
            </p>
            {displayHighlights.map((item, idx) => (
              <SidebarItem
                key={item.id || idx}
                item={item}
                index={idx}
                isActive={idx === activeIndex}
                onClick={() => goTo(idx)}
                onOpenFull={() => openLightbox(idx)}
              />
            ))}
          </div>
        </div>

        {/* Academic Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <span className="text-[11px] font-black tracking-[0.3em] text-orange-500 uppercase">Academic Timeline</span>
            <h3 className="text-3xl font-black text-white mt-3">4 Years at KL University</h3>
          </div>

          <div className="relative flex items-center justify-between px-8 py-10 bg-white/3 rounded-3xl border border-white/5 overflow-hidden">
            <div className="absolute left-8 right-8 top-1/2 h-[1px] bg-gradient-to-r from-orange-500/20 via-orange-500/60 to-orange-500/20" />
            <motion.div
              className="absolute left-8 top-1/2 h-[2px] bg-gradient-to-r from-orange-500 to-orange-300"
              style={{ transformOrigin: 'left' }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 2, delay: 0.8, ease: 'easeOut' }}
            />
            {years.map((year) => (
              <motion.button
                key={year}
                onClick={() => { setActiveYear(year); setActiveIndex(0); }}
                className="relative flex flex-col items-center gap-2 cursor-pointer group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    activeYear === year || activeYear === 'All'
                      ? 'bg-orange-500 border-orange-500 shadow-[0_0_20px_rgba(255,125,68,0.8)]'
                      : 'bg-transparent border-white/30 group-hover:border-orange-500/50'
                  }`}
                  animate={activeYear === year ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className={`text-xs font-black uppercase tracking-widest ${
                  activeYear === year || activeYear === 'All' ? 'text-orange-500' : 'text-gray-500 group-hover:text-white'
                }`}>{year}</span>
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Videos', value: `${highlights.filter(h => getMediaType(h) === 'local-video' || getMediaType(h) === 'youtube').length}+`, icon: Film },
              { label: 'Photos', value: `${highlights.filter(h => getMediaType(h) === 'image').length}+`, icon: Camera },
              { label: 'Club Events', value: '10+', icon: Star },
              { label: 'Years', value: '4', icon: GraduationCap },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="bg-white/3 rounded-2xl p-5 border border-white/5 hover:border-orange-500/20 transition-colors group text-center"
              >
                <s.icon size={20} className="text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Fullscreen Lightbox Modal */}
      <BtechJourneyLightbox
        isOpen={isLightboxOpen}
        item={displayHighlights[lightboxIndex] || activeItem}
        currentIndex={lightboxIndex}
        totalCount={displayHighlights.length}
        onClose={closeLightbox}
        onPrev={prevLightbox}
        onNext={nextLightbox}
      />
    </section>
  );
};

export default BtechJourney;
