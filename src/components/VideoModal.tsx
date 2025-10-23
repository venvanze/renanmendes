import React from "react";
import { X, Calendar, Clock, Tag } from "lucide-react";
import type { VideoData } from "../types/content";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: (Pick<VideoData, 'title' | 'description' | 'publishDate' | 'category' | 'duration' | 'videoUrl'>) | null;
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

  const getEmbedData = (rawUrl: string) => {
    try {
      const parsed = new URL(rawUrl);
      const host = parsed.hostname.toLowerCase();
      const pathname = parsed.pathname.replace(/\/+$/, '');

      if (host.includes('youtube.com') || host.includes('youtu.be')) {
        const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\?v=|&v=)([^#&?]*).*/;
        let id: string | null = null;
        const match = rawUrl.match(regExp);
        if (match && match[1].length === 11) {
          id = match[1];
        }
        if (!id && host.includes('youtu.be')) {
          const parts = pathname.split('/').filter(Boolean);
          id = parts[0] ?? null;
        }
        if (id) {
          return {
            platform: 'YouTube' as const,
            embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
          };
        }
      }

      if (host.includes('vimeo.com')) {
        const parts = pathname.split('/').filter(Boolean);
        const id = parts.pop();
        if (id) {
          return {
            platform: 'Vimeo' as const,
            embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
          };
        }
      }

      if (host.includes('instagram.com')) {
        const parts = pathname.split('/').filter(Boolean);
        const base = parts[0];
        const slug = parts.length > 1 ? parts[1] : parts[0];
        if (base && slug) {
          return {
            platform: 'Instagram' as const,
            embedUrl: `https://www.instagram.com/${base}/${slug}/embed/`,
          };
        }
      }

      return {
        platform: 'Link externo' as const,
        embedUrl: null,
      };
    } catch {
      return {
        platform: 'Link externo' as const,
        embedUrl: null,
      };
    }
  };

  const { embedUrl, platform } = getEmbedData(video.videoUrl);
  const fallbackButtonLabel = platform === 'Link externo' ? 'Abrir em nova aba' : `Abrir no ${platform}`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="video-modal-title">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      
      {/* Modal Content */}
      <div className="relative bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-7xl w-full mx-4 h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 hover:border-white/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
          aria-label="Fechar"
        >
          <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
        </button>

        {/* Content Layout: vertical flow (video on top, info below) */}
        <div className="flex h-full flex-col overflow-auto">
          {/* Video Section */}
          <div className="w-full flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${video.title} (${platform})`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                  <div className="text-center">
                    <div className="text-xl mb-2" id="video-modal-title">Vídeo não disponível</div>
                    <div className="text-sm opacity-70 mb-4">Este vídeo está hospedado em outra plataforma.</div>
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      {fallbackButtonLabel}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Section (stacked below video) */}
          <div className="w-full px-4 md:px-8 pb-8">
            <div className="max-w-4xl mx-auto">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <Tag className="w-4 h-4 text-white/70" />
                <span className="font-[Plus_Jakarta_Sans] font-medium text-white/90 text-sm">
                  {video.category}
                </span>
              </div>

              {/* Title */}
              <h2 id="video-modal-title" className="font-[Plus_Jakarta_Sans] font-bold text-white text-2xl leading-tight mb-4">
                {video.title}
              </h2>

              {/* Description */}
              <p className="font-[Plus_Jakarta_Sans] font-normal text-white/80 text-base leading-relaxed mb-6">
                {video.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
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
    </div>
  );
}
