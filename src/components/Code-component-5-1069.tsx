import React from "react";
import { X, Calendar, Clock, Tag } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: {
    title: string;
    description: string;
    publishDate: string;
    category: string;
    duration: string;
    youtubeUrl: string;
  } | null;
}

export function VideoModal({ isOpen, onClose, video }: VideoModalProps) {
  // Close modal on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  // Extract YouTube video ID for embed
  const getYouTubeEmbedId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeEmbedId(video.youtubeUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : '';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-7xl w-full mx-4 h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 hover:border-white/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        >
          <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
        </button>

        {/* Content Layout */}
        <div className="flex h-full">
          {/* Video Section */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                  <div className="text-center">
                    <div className="text-xl mb-2">Vídeo não disponível</div>
                    <div className="text-sm opacity-70">URL do YouTube inválida</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Panel */}
          <div className="w-96 bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-xl border-l border-white/10 p-8 flex flex-col">
            {/* Header */}
            <div className="space-y-6 flex-1">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <Tag className="w-4 h-4 text-white/70" />
                <span className="font-[Plus_Jakarta_Sans] font-medium text-white/90 text-sm">
                  {video.category}
                </span>
              </div>

              {/* Title */}
              <div>
                <h2 className="font-[Plus_Jakarta_Sans] font-bold text-white text-2xl leading-tight mb-4">
                  {video.title}
                </h2>
              </div>

              {/* Description */}
              <div>
                <p className="font-[Plus_Jakarta_Sans] font-normal text-white/80 text-base leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-white/60" />
                <span className="font-[Plus_Jakarta_Sans] font-medium text-white/80 text-base">
                  {video.publishDate}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-white/60" />
                <span className="font-[Plus_Jakarta_Sans] font-medium text-white/80 text-base">
                  {video.duration}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}