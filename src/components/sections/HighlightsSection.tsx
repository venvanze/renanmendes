import React from "react";
import "./HighlightsSection.css";
import { Play, Calendar, Clock } from "lucide-react";
import type { HighlightsData, VideoData } from "../../types/content";
import { getYouTubeId, getYouTubeThumbnail } from "../../hooks/useContent";
import { VideoModal } from "../VideoModal";
import imgFrame4 from "../../assets/e328d7002282dca398dfc4c4976cc1178abfe131.png";
import { imgMaskGroup } from "../../imports/svg-rr2zm";

interface HighlightsSectionProps {
  highlightsData: HighlightsData;
}

interface VideoCardProps {
  video: VideoData;
  onWatch: (video: VideoData) => void;
}

const MAX_VISIBLE_DESKTOP = 12;
const MAX_VISIBLE_MOBILE = 3;

function VideoCard({ video, onWatch }: VideoCardProps) {
  const youtubeId = getYouTubeId(video.videoUrl);
  const fallbackThumbnail = youtubeId ? getYouTubeThumbnail(youtubeId) : "";
  const imageSrc = video.thumbnail || fallbackThumbnail || imgFrame4;

  const handleOpen = React.useCallback(() => onWatch(video), [onWatch, video]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpen();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleOpen}
      className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/5 transition-colors duration-300 hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
      aria-label={`Abrir vídeo: ${video.title}`}
    >
      <div className="relative w-full aspect-video overflow-hidden bg-black/40">
        <img
          src={imageSrc}
          alt={`Thumbnail do vídeo ${video.title}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <h3 className="font-[Plus_Jakarta_Sans] text-base font-semibold leading-tight text-[#d6dde6]">
            {video.title}
          </h3>
          <p className="font-[Plus_Jakarta_Sans] text-sm text-white/70">{video.category}</p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="space-y-2 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden />
              <span>{video.duration || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden />
              <span className="leading-tight">{video.publishDate}</span>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 font-[Plus_Jakarta_Sans] text-sm font-semibold text-white transition-colors duration-200 hover:border-white/60 hover:bg-white/20"
            onClick={(event) => {
              event.stopPropagation();
              handleOpen();
            }}
            aria-label={`Assistir ${video.title}`}
          >
            <Play className="h-4 w-4" aria-hidden />
            Assistir
          </button>
        </div>
      </div>
    </article>
  );
}

export function HighlightsSection({ highlightsData }: HighlightsSectionProps) {
  if (!highlightsData) return null;

  const [modalVideo, setModalVideo] = React.useState<VideoData | null>(null);
  const [activeFilter, setActiveFilter] = React.useState(0);
  const [visibleCount, setVisibleCount] = React.useState(() => (
    typeof window !== 'undefined' && window.innerWidth < 640 ? MAX_VISIBLE_MOBILE : MAX_VISIBLE_DESKTOP
  ));

  const categories = React.useMemo(() => {
    const seen = new Set<string>();
    const order: string[] = [];
    highlightsData.videos.forEach((video) => {
      if (!seen.has(video.category)) {
        seen.add(video.category);
        order.push(video.category);
      }
    });
    return order;
  }, [highlightsData.videos]);

  const FILTERS = React.useMemo(() => {
    const filters: { label: string; match: (v: VideoData) => boolean }[] = [
      { label: "Todos", match: () => true },
    ];
    categories.forEach((category) => {
      filters.push({ label: category, match: (video) => video.category === category });
    });
    return filters;
  }, [categories]);

  React.useEffect(() => {
    if (activeFilter >= FILTERS.length) {
      setActiveFilter(0);
    }
  }, [FILTERS.length, activeFilter]);

  const filteredVideos = React.useMemo(
    () => highlightsData.videos.filter(FILTERS[activeFilter].match),
    [highlightsData.videos, FILTERS, activeFilter]
  );

  React.useEffect(() => {
    const updateVisible = () => {
      setVisibleCount((prev) => {
        const isMobile = window.innerWidth < 1024;
        const limit = isMobile ? MAX_VISIBLE_MOBILE : MAX_VISIBLE_DESKTOP;
        return Math.min(limit, filteredVideos.length);
      });
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, [filteredVideos.length]);

  const videosToRender = React.useMemo(
    () => filteredVideos.slice(0, visibleCount),
    [filteredVideos, visibleCount]
  );

  const [gridTemplate, setGridTemplate] = React.useState(() => {
    if (typeof window === 'undefined') return "repeat(1, minmax(0, 1fr))";
    return window.innerWidth < 1024 ? "repeat(1, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))";
  });

  React.useEffect(() => {
    const updateGridTemplate = () => {
      const vw = window.innerWidth;
      if (vw < 640) setGridTemplate("repeat(1, minmax(0, 1fr))");
      else if (vw < 1024) setGridTemplate("repeat(1, minmax(0, 1fr))");
      else setGridTemplate("repeat(4, minmax(0, 1fr))");
    };
    updateGridTemplate();
    window.addEventListener('resize', updateGridTemplate);
    return () => window.removeEventListener('resize', updateGridTemplate);
  }, []);

  const handleWatchClick = React.useCallback((video: VideoData) => {
    setModalVideo(video);
  }, []);

  const closeModal = React.useCallback(() => setModalVideo(null), []);

  const wrapperClass = "w-full px-4 md:px-8 lg:px-[190px]";

  return (
    <section id="portfolio" aria-label="Destaques do portfólio" className="scroll-offset relative">
      <div className={`${wrapperClass} pt-12 pb-6`}>
        <h2 className="font-[Plus_Jakarta_Sans] text-center text-xl font-bold leading-[52px] tracking-[-0.28px] text-[#d6dde6] sm:text-2xl lg:text-[28px]">
          Portfólio
        </h2>
      </div>

      <div className={`${wrapperClass} pb-8`}>
        <nav
          aria-label="Filtro de destaques (título da sessão)"
          className="no-scrollbar overflow-x-auto"
        >
          <ul className="flex items-center justify-center gap-6 whitespace-nowrap px-4">
            {FILTERS.map((filter, idx) => {
              const selected = idx === activeFilter;
              return (
                <li key={filter.label}>
                  <button
                    type="button"
                    onClick={() => setActiveFilter(idx)}
                    className={
                      selected
                        ? "filter-selected relative flex h-10 items-center justify-center overflow-hidden rounded-full px-4 font-[Plus_Jakarta_Sans] backdrop-blur-sm"
                        : "font-[Plus_Jakarta_Sans] text-[#d6dde6]"
                    }
                    style={{ fontSize: "16px", fontWeight: 400, lineHeight: "32px" }}
                    aria-current={selected ? "true" : undefined}
                  >
                    {filter.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className={`${wrapperClass} pb-40`} role="region" aria-label="Grade de vídeos">
        {videosToRender.length > 0 ? (
          <>
            <div
              className="mx-auto grid w-full max-w-[1320px] justify-items-stretch gap-6 xl:gap-8"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {videosToRender.map((video) => (
                <VideoCard key={video.id ?? `${video.title}-${video.videoUrl}`} video={video} onWatch={handleWatchClick} />
              ))}
            </div>
            {visibleCount < filteredVideos.length ? (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 font-[Plus_Jakarta_Sans] text-sm font-semibold text-white transition-colors duration-200 hover:border-white/60 hover:bg-white/20"
                onClick={() => {
                  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
                  const increment = isMobile ? MAX_VISIBLE_MOBILE : MAX_VISIBLE_DESKTOP;
                  setVisibleCount((prev) => Math.min(prev + increment, filteredVideos.length));
                }}
              >
                Carregar mais
              </button>
            </div>
            ) : null}
          </>
        ) : (
          <div className="py-10 text-center font-[Plus_Jakarta_Sans] text-[#d6dde6]">
            Nenhum vídeo nesta categoria ainda.
          </div>
        )}
      </div>

      <VideoModal isOpen={!!modalVideo} onClose={closeModal} video={modalVideo} />
    </section>
  );
}

export function ProgressBar({ variant = "default" }: { variant?: "default" | "flat" }) {
  const wrapper = variant === "flat" ? "w-full" : "w-full px-4 md:px-8 py-3";
  const height = variant === "flat" ? "h-[6px]" : "h-[11px]";
  const bar =
    variant === "flat"
      ? `bg-[#3b3b3b] ${height} w-full relative`
      : `bg-[#3b3b3b] ${height} w-full relative rounded-sm`;
  const knobSize = variant === "flat" ? "w-[14px] h-[14px]" : "w-[26px] h-[26px]";
  return (
    <div className={wrapper} aria-hidden>
      <div className={bar}>
        <div className={`absolute top-1/2 left-0 -translate-y-1/2 w-[55%] ${height}`}>
          <img className="h-full w-full object-cover" src={imgMaskGroup} alt="" />
        </div>
        <div
          className={`absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ${knobSize}`}
        />
      </div>
    </div>
  );
}
