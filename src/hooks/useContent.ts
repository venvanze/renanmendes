import React from 'react';
import type { AppContent } from "../types/content";

const CONTENT_URL = '/content.json';

// Simple runtime validation (lightweight, no external libs)
function isStringArray(a: unknown): a is string[] {
  return Array.isArray(a) && a.every((v) => typeof v === 'string');
}

// Deep validators for each section
function isHeaderData(v: any): v is AppContent['header'] {
  return (
    v &&
    typeof v.name === 'string' &&
    typeof v.subtitle === 'string' &&
    Array.isArray(v.navigation) && v.navigation.every((s: any) => typeof s === 'string') &&
    typeof v.contactButton === 'string'
  );
}

function isHeroData(v: any): v is AppContent['hero'] {
  return v && isStringArray(v.title);
}

function isVideoData(v: any): boolean {
  return (
    v &&
    (v.id === undefined || typeof v.id === 'string') &&
    typeof v.title === 'string' &&
    typeof v.description === 'string' &&
    typeof v.publishDate === 'string' &&
    typeof v.category === 'string' &&
    typeof v.duration === 'string' &&
    typeof v.videoUrl === 'string' &&
    (v.thumbnail === undefined || typeof v.thumbnail === 'string') &&
    (v.backgroundImage === undefined || typeof v.backgroundImage === 'string') &&
    (v.tags === undefined || (Array.isArray(v.tags) && v.tags.every((t: any) => typeof t === 'string')))
  );
}

function isHighlightsData(v: any): v is AppContent['highlights'] {
  return v && typeof v.title === 'string' && Array.isArray(v.videos) && v.videos.every(isVideoData);
}

function isAboutData(v: any): v is AppContent['about'] {
  return v && typeof v.text === 'string';
}

function isIndustriesData(v: any): v is AppContent['industries'] {
  return v && typeof v.text === 'string';
}

function isVideoTypesData(v: any): v is AppContent['videoTypes'] {
  return v && Array.isArray(v.types) && v.types.every((s: any) => typeof s === 'string');
}

function isProject(v: any): boolean {
  return v && typeof v.title === 'string' && typeof v.date === 'string' && typeof v.image === 'string';
}

function isProjectsData(v: any): v is AppContent['projects'] {
  return v && Array.isArray(v.projects) && v.projects.every(isProject);
}

function isTestimonial(v: any): boolean {
  return (
    v &&
    typeof v.avatar === 'string' &&
    typeof v.name === 'string' &&
    typeof v.role === 'string' &&
    typeof v.quote === 'string' &&
    (v.profileImage === undefined || typeof v.profileImage === 'string') &&
    (v.lineImage === undefined || typeof v.lineImage === 'string')
  );
}

function isTestimonialsData(v: any): v is AppContent['testimonials'] {
  return v && typeof v.title === 'string' && Array.isArray(v.testimonials) && v.testimonials.every(isTestimonial);
}

function isFooterData(v: any): v is AppContent['footer'] {
  return v && typeof v.copyright === 'string';
}

function isAppContent(json: any): json is AppContent {
  return (
    json &&
    isHeaderData(json.header) &&
    isHeroData(json.hero) &&
    isHighlightsData(json.highlights) &&
    isAboutData(json.about) &&
    isIndustriesData(json.industries) &&
    isVideoTypesData(json.videoTypes) &&
    isProjectsData(json.projects) &&
    isTestimonialsData(json.testimonials) &&
    isFooterData(json.footer)
  );
}

let cache: AppContent | null = null;
let cacheTime = 0;

async function fetchContent(force = false): Promise<AppContent> {
  const now = Date.now();
  if (!force && cache && now - cacheTime < 10_000) return cache;
  const res = await fetch(CONTENT_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!isAppContent(json)) throw new Error('Conteúdo inválido');
  cache = json;
  cacheTime = now;
  return json;
}

export const useContent = () => {
  const [content, setContent] = React.useState<AppContent | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async (force = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchContent(force);
      setContent(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Falha ao carregar conteúdo';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const refreshContent = React.useCallback(() => {
    load(true);
  }, [load]);

  return { content, loading, error, refreshContent };
};

// Utility functions for YouTube integration
export const getYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const getYouTubeThumbnail = (videoId: string, quality: string = 'hqdefault'): string => {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

export const getYouTubeEmbedUrl = (videoId: string, options: Record<string, number> = {}) => {
  const defaultOptions: Record<string, number> = {
    autoplay: 0,
    mute: 0,
    controls: 1,
    loop: 0,
    showinfo: 1,
    rel: 1,
    iv_load_policy: 1,
    modestbranding: 0,
    disablekb: 0,
    fs: 1,
    cc_load_policy: 0,
    playsinline: 0,
    enablejsapi: 0
  };
  
  const mergedOptions: Record<string, number> = { ...defaultOptions, ...options };
  const params = Object.entries(mergedOptions)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
    
  return `https://www.youtube.com/embed/${videoId}?${params}`;
};
