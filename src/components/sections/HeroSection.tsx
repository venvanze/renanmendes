import React from "react";
import type { HeroData, HeaderData } from "../../types/content";
import { SiteNav } from "../navigation/SiteNav";

interface HeroSectionProps {
  heroData: HeroData;
  headerData: HeaderData;
  headerOffset?: number;
}

export function HeroSection({ heroData, headerData, headerOffset = 0 }: HeroSectionProps) {
  if (!heroData || !headerData) return null;

  // Threshold-based sticky: bottom-attached -> fixed at top
  const bottomNavRef = React.useRef<HTMLDivElement | null>(null);
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const [stuck, setStuck] = React.useState(false);
  const [bottomInset, setBottomInset] = React.useState<number>(120);
  const [isDesktop, setIsDesktop] = React.useState<boolean>(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return true;
    return window.matchMedia('(min-width: 48rem)').matches;
  });
  React.useEffect(() => {
    const onScroll = () => {
      const navEl = bottomNavRef.current;
      const secEl = sectionRef.current;
      if (!navEl || !secEl) return;
      const secRect = secEl.getBoundingClientRect();
      const navH = navEl.getBoundingClientRect().height || 0;
      const navTopWhenAbsolute = secRect.bottom - navH;
      // Hysteresis to avoid flicker/duplication at threshold
      setStuck(prev => {
        if (!prev && navTopWhenAbsolute <= 24) return true; // stick
        if (prev && navTopWhenAbsolute >= 28) return false; // unstick only after leaving a bit
        return prev;
      });
      // Fine-tune mobile bottom inset based on real nav height
      try {
        const mobileBottom = (navH || 0) + 48; // nav height + extra breathing
        setBottomInset(isDesktop ? 48 : (stuck ? 48 : mobileBottom));
      } catch {}
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('orientationchange', onScroll);
    const mq = window.matchMedia('(min-width: 48rem)');
    const onMQ = (e: MediaQueryListEvent | MediaQueryList) => {
      const m = 'matches' in e ? e.matches : (e as MediaQueryList).matches;
      setIsDesktop(m);
    };
    onMQ(mq);
    // Safari fallback supports addListener/removeListener
    // @ts-ignore
    mq.addEventListener ? mq.addEventListener('change', onMQ) : mq.addListener(onMQ);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('orientationchange', onScroll);
      // @ts-ignore
      mq.removeEventListener ? mq.removeEventListener('change', onMQ) : mq.removeListener(onMQ);
    };
  }, []);

  return (
    <section ref={sectionRef} id="inicio" aria-label="Seção inicial" className="scroll-offset min-h-[500px] lg:min-h-[702px] flex flex-col lg:flex-row items-center justify-between px-4 md:px-8 lg:px-[190px] py-0 relative">
      {/* Background video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden" aria-hidden>
        <iframe
          id="hero-video"
          title="YouTube video player"
          className="absolute top-1/2 left-1/2 w-[300%] h-[300%] transform -translate-x-1/2 -translate-y-1/2"
          src={(function(){
            try {
              const videoId = 'vCbw3UjVaPE';
              const isDevTunnel = typeof window !== 'undefined' && window.location.hostname.endsWith('.devtunnels.ms');
              const base = new URL(`https://${isDevTunnel ? 'www.youtube.com' : 'www.youtube-nocookie.com'}/embed/${videoId}`);
              base.searchParams.set('autoplay','1');
              base.searchParams.set('mute','1');
              base.searchParams.set('controls','0');
              base.searchParams.set('playsinline','1');
              base.searchParams.set('enablejsapi','1');
              base.searchParams.set('loop','1');
              base.searchParams.set('playlist', videoId);
              base.searchParams.set('rel','0');
              if (typeof window !== 'undefined' && window.location?.origin) {
                base.searchParams.set('origin', window.location.origin);
              }
              return base.toString();
            } catch {
              return 'https://www.youtube.com/embed/vCbw3UjVaPE?autoplay=1&mute=1&controls=0&playsinline=1&enablejsapi=1&loop=1&playlist=vCbw3UjVaPE&rel=0';
            }
          })()}
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{ pointerEvents: "none" }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content overlay */}
      <div
        className="absolute inset-x-0 z-10 px-4 md:px-8 lg:px-[190px]"
        style={{ top: headerOffset, bottom: isDesktop ? 48 : bottomInset }}
      >
        <div className="h-full w-full flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8">
          {/* Left: name split into two lines; subtitle removed */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <h2
              className="font-[Plus_Jakarta_Sans] font-extrabold text-[#d6dde6] leading-tight tracking-tight"
              style={{ fontSize: isDesktop ? '5rem' : '4rem' }}
            >
              <span className="block">Renan</span>
              <span className="block">Mendes</span>
            </h2>
          </div>

          {/* Right: hero title, aligned right (fixed text) */}
          <div className="w-full lg:w-1/2 flex flex-col items-end text-right -mx-[22px]">
            <h1
              className="w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[404.967px] h-auto font-[Plus_Jakarta_Sans] font-extralight text-[#d6dde6] leading-tight tracking-tight"
              style={{ fontSize: isDesktop ? 'calc(3.33em * 0.9)' : 'calc(3.33em * 0.72)' }}
            >
              {["Edição", "Profissional", "de Vídeos"].map((line, index) => (
                <span key={index} className="block">{line}</span>
              ))}
            </h1>
          </div>
        </div>
        {/* Extra bottom breathing space handled via bottom inset on mobile */}
      </div>

      {/* Force autoplay via YouTube IFrame API for stubborn embeds */}
      {React.useEffect(() => {
        const win = window as any;
        const tryPlay = () => {
          try {
            const el = document.getElementById('hero-video') as HTMLIFrameElement | null;
            if (!el) return;
            if (win.YT && win.YT.Player) {
              const player = new win.YT.Player('hero-video', {
                events: {
                  onReady: (e: any) => {
                    try { e.target.mute?.(); } catch {}
                    try { e.target.playVideo?.(); } catch {}
                  },
                  onStateChange: (e: any) => {
                    try {
                      const ENDED = win.YT && win.YT.PlayerState ? win.YT.PlayerState.ENDED : 0;
                      if (e.data === ENDED) {
                        // Ensure loop by seeking to start and playing again
                        e.target.seekTo?.(0, true);
                        e.target.playVideo?.();
                      }
                    } catch {}
                  }
                }
              });
              return;
            }
            el.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
            el.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
          } catch {}
        };
        if (!(win.YT && win.YT.Player)) {
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          document.head.appendChild(tag);
          const prev = win.onYouTubeIframeAPIReady;
          win.onYouTubeIframeAPIReady = () => { try { prev && prev(); } catch {} tryPlay(); };
          const t = window.setTimeout(tryPlay, 1200);
          return () => window.clearTimeout(t);
        } else {
          tryPlay();
        }
        return;
      }, [] as any), null}

      {/* Single nav wrapper with thresholded stick; only left/right animate */}
      <div
        ref={bottomNavRef}
        className="z-50 transition-[left,right] duration-300 ease-out"
        style={{
          position: stuck ? 'fixed' : 'absolute',
          top: stuck ? (isDesktop ? '24px' : '12px') : undefined,
          bottom: stuck ? undefined : 0,
          left: stuck ? (isDesktop ? '48px' : '12px') : 0,
          right: stuck ? (isDesktop ? '48px' : '12px') : 0
        }}
      >
        <SiteNav headerData={headerData} compact={stuck} />
      </div>

      {/* Unified nav handles its own sticky transform */}

      {/* Progress bar removed as requested */}
    </section>
  );
}
