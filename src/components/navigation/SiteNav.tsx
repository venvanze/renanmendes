import React from "react";
import { Menu, X } from "lucide-react";
import type { HeaderData } from "../../types/content";
import "./SiteNav.css";
import { motion } from "motion/react";

interface SiteNavProps {
  headerData: HeaderData;
  compact?: boolean; // fixed at top (descolado)
}

const navToId = (label: string) => {
  const key = label.trim().toLowerCase();
  if (key.includes("início") || key.includes("inicio")) return "#inicio";
  if (key.includes("portfólio") || key.includes("portfolio")) return "#portfolio";
  if (key.includes("sobre")) return "#sobre";
  if (key.includes("clientes")) return "#clientes";
  return "#";
};
export function SiteNav({ headerData, compact = false }: SiteNavProps) {
  if (!headerData) return null;

  const leftRef = React.useRef<HTMLHeadingElement | null>(null);
  const rightRef = React.useRef<HTMLHeadingElement | null>(null);
  const [rightFontPx, setRightFontPx] = React.useState<number | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [containerH, setContainerH] = React.useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState<boolean>(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return true;
    return window.matchMedia('(min-width: 48rem)').matches;
  });
  React.useEffect(() => {
    if (!('matchMedia' in window)) return;
    const mq = window.matchMedia('(min-width: 48rem)');
    const onMQ = (e: MediaQueryListEvent | MediaQueryList) => {
      const m = 'matches' in e ? e.matches : (e as MediaQueryList).matches;
      setIsDesktop(m);
    };
    onMQ(mq);
    // @ts-ignore Safari
    mq.addEventListener ? mq.addEventListener('change', onMQ) : mq.addListener(onMQ);
    return () => {
      // @ts-ignore
      mq.removeEventListener ? mq.removeEventListener('change', onMQ) : mq.removeListener(onMQ);
    };
  }, []);

  const navItems = React.useMemo(() => {
    return headerData.navigation.filter((label) => isDesktop || !label.toLowerCase().includes('sobre'));
  }, [headerData.navigation, isDesktop]);
  // Underline animation state
  const [activeIdx, setActiveIdx] = React.useState<number>(0);
  const primaryListRef = React.useRef<HTMLUListElement | null>(null);
  const compactListRef = React.useRef<HTMLUListElement | null>(null);
  const [uLeft, setULeft] = React.useState(0);
  const [uWidth, setUWidth] = React.useState(0);
  const DURATION = 800;

  const measure = (ul: HTMLUListElement | null, idx: number) => {
    if (!ul) return { left: 0, width: 0 };
    const lis = Array.from(ul.querySelectorAll('li')) as HTMLLIElement[];
    const li = lis[idx];
    if (!li) return { left: 0, width: 0 };
    const b = ul.getBoundingClientRect();
    const r = li.getBoundingClientRect();
    return { left: r.left - b.left, width: r.width };
  };

  const animateTo = (ul: HTMLUListElement | null, fromIdx: number, toIdx: number) => {
    const a = measure(ul, fromIdx);
    const b = measure(ul, toIdx);
    // phase 1: expand
    const left = Math.min(a.left, b.left);
    const right = Math.max(a.left + a.width, b.left + b.width);
    setULeft(left);
    setUWidth(right - left);
    window.setTimeout(() => { setULeft(b.left); setUWidth(b.width); }, DURATION / 2);
  };

  const animateScrollTo = (targetY: number, duration = 800) => {
    const startY = window.scrollY || window.pageYOffset;
    const delta = targetY - startY;
    const start = performance.now();
    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + delta * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const handleNavClick = (idx: number, label: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const hash = navToId(label);
    const target = document.querySelector(hash) as HTMLElement | null;
    if (target) {
      const rect = target.getBoundingClientRect();
      const top = (window.scrollY || window.pageYOffset) + rect.top - 120;
      animateScrollTo(top, 900);
    }
    history.pushState(null, '', hash);
  };

  // No underline animation: nothing to measure
  React.useEffect(() => {}, [compact]);

  React.useEffect(() => {
    const adjust = () => {
      const L = leftRef.current;
      const R = rightRef.current;
      if (!L || !R) return;
      // Reset font to measure natural height
      R.style.fontSize = "";
      const lh = L.getBoundingClientRect().height;
      const rh = R.getBoundingClientRect().height;
      const base = parseFloat(window.getComputedStyle(R).fontSize || "16");
      if (lh > 0 && rh > 0 && base > 0) {
        const next = Math.max(12, Math.min(200, base * (lh / rh)));
        setRightFontPx(next);
      }
    };
    adjust();
    window.addEventListener("resize", adjust);
    window.addEventListener("orientationchange", adjust);
    return () => {
      window.removeEventListener("resize", adjust);
      window.removeEventListener("orientationchange", adjust);
    };
  }, []);

  // Animate height when compact toggles (lateral texts appear)
  React.useLayoutEffect(() => {
    const measure = () => {
      const el = contentRef.current;
      if (!el) return;
      setContainerH(el.offsetHeight);
    };
    // measure now and on next frame to ensure layout settled
    measure();
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, [compact, rightFontPx]);

  React.useEffect(() => {
    if (!compact) setMobileOpen(false);
  }, [compact]);

  return (
    <div
      className="relative w-full bg-[rgba(46,46,46,0.48)] backdrop-filter"
      style={{
        backdropFilter: 'blur(42px)',
        WebkitBackdropFilter: 'blur(42px)',
        borderRadius: compact ? '24px' : '0px',
        boxShadow: compact ? '0 0 30px 0 rgba(0,0,0,0.25)' : 'none',
        transform: 'translateY(0) scale(1)',
        willChange: 'transform, box-shadow, border-radius',
        transition: 'box-shadow 400ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 400ms cubic-bezier(0.22, 1, 0.36, 1)'
      }}
    >
      <div className={`py-4 px-6`}>
        <div
          className="overflow-hidden"
          style={{ height: containerH != null ? `${containerH}px` : undefined, transition: 'height 400ms cubic-bezier(0.22, 1, 0.36, 1)' }}
        >
          <div ref={contentRef} className={`w-full flex flex-nowrap items-center ${compact ? 'justify-between' : 'justify-center'} gap-8 whitespace-nowrap`}>
          {compact && (
            <div className="only-mobile w-full items-center justify-between">
              <div className="flex flex-col items-start text-left">
                <span className="font-[Plus_Jakarta_Sans] font-extrabold text-[#d6dde6] text-[22px] leading-tight whitespace-nowrap">Renan Mendes</span>
                <span className="mt-1 font-[Plus_Jakarta_Sans] font-light text-[#d6dde6] text-[14px] leading-[18px] whitespace-nowrap overflow-hidden text-ellipsis">{headerData.subtitle}</span>
              </div>
              <button
                type="button"
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(o => !o)}
                className="p-2 rounded-full hover:bg-white/10 border border-white/20 text-[#d6dde6]"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          )}
          {/* Esquerda: Renan / Mendes (duas linhas), aparece somente quando compacto (stuck) */}
          {compact && (
            <div className="hidden md:flex h-full w-[360px] shrink-0 items-center justify-start text-left">
              <h2
                ref={leftRef}
                  className="font-[Plus_Jakarta_Sans] font-extrabold text-[#d6dde6] leading-tight tracking-tight text-[32px]"
              >
                <span className="block">Renan</span>
                <span className="block">Mendes</span>
              </h2>
            </div>
          )}

          {/* Centro: navegação centralizada com espaçamento de 24px (gap-6) */}
          <div className={`${compact ? 'only-desktop' : 'flex'} h-full w-[560px] shrink-0 items-center justify-center gap-6 overflow-hidden`}>
            {compact ? (
              <>
                {/* Desktop inline menu when compact */}
                <div className="only-desktop items-center gap-6">
                  <nav aria-label="Navegação principal" className="relative flex items-center">
                    <ul ref={compactListRef} className="relative flex items-center justify-center text-center gap-6 flex-nowrap whitespace-nowrap">
                      {navItems.map((item, index) => (
                        <li key={index}>
                          <a
                            href={navToId(item)}
                            className="font-[Plus_Jakarta_Sans] text-[#d6dde6] leading-[32px]"
                            style={{ fontSize: '16px', fontWeight: 400 }}
                            onClick={handleNavClick(index, item)}
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                      <span
                        className="pointer-events-none absolute bottom-0 h-[2px] rounded-full bg-white"
                        style={{ left: uLeft, width: uWidth, transition: `left ${DURATION/2}ms cubic-bezier(0.22,1,0.36,1), width ${DURATION/2}ms cubic-bezier(0.22,1,0.36,1)` }}
                      />
                    </ul>
                  </nav>
                  <a
                    href="#contato"
                    className="relative overflow-hidden rounded-full h-10 px-4 flex items-center justify-center bg-gradient-to-r from-white to-gray-50 border border-white/20 text-gray-800 font-[Plus_Jakarta_Sans] focus:outline-none focus:ring-2 focus:ring-white/60 whitespace-nowrap"
                    style={{ fontSize: '16px', fontWeight: 400 }}
                    aria-label="Ir para contato"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onHoverStart={() => console.log('hover started!')}
                    >
                      {headerData.contactButton}
                    </motion.button>
                  </a>
                </div>
              </>
            ) : (
              <>
                <nav aria-label="Navegação principal" className="relative flex items-center">
                  <ul ref={primaryListRef} className="relative flex items-center justify-center text-center gap-6 flex-nowrap whitespace-nowrap">
                    {navItems.map((item, index) => (
                      <li key={index}>
                        <a
                          href={navToId(item)}
                          className="font-[Plus_Jakarta_Sans] text-[#d6dde6] leading-[32px]"
                          style={{ fontSize: '16px', fontWeight: 400 }}
                          onClick={handleNavClick(index, item)}
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                    <span
                      className="pointer-events-none absolute bottom-0 h-[2px] rounded-full bg-white"
                      style={{ left: uLeft, width: uWidth, transition: `left ${DURATION/2}ms cubic-bezier(0.22,1,0.36,1), width ${DURATION/2}ms cubic-bezier(0.22,1,0.36,1)` }}
                    />
                  </ul>
                </nav>
                <a
                  href="#contato"
                  className="relative overflow-hidden rounded-full h-10 px-4 flex items-center justify-center bg-gradient-to-r from-white to-gray-50 border border-white/20 text-gray-800 font-[Plus_Jakarta_Sans] focus:outline-none focus:ring-2 focus:ring-white/60 whitespace-nowrap"
                  style={{ fontSize: '16px', fontWeight: 400 }}
                  aria-label="Ir para contato"
                >
                  {headerData.contactButton}
                </a>
              </>
            )}
          </div>

          {/* Direita: Edição / Profissional / de Vídeos (três linhas), aparece somente quando compacto */}
          {compact && (
            <div className="only-desktop h-full w-[360px] shrink-0 items-center justify-end text-right">
              <h1
                ref={rightRef}
                className="font-[Plus_Jakarta_Sans] font-extrabold text-[#d6dde6] leading-tight tracking-tight text-[24px]"
                style={rightFontPx ? { fontSize: `${rightFontPx}px` } : undefined}
              >
                <span className="block">Edição</span>
                <span className="block">Profissional</span>
                <span className="block">de Vídeos</span>
              </h1>
            </div>
          )}
          </div>
        </div>

        {/* Mobile dropdown panel when compact */}
        {compact && mobileOpen && (
          <div className="only-mobile absolute left-0 right-0 top-full mt-2 bg-[rgba(46,46,46,0.95)] backdrop-blur-[24px] border border-white/20 rounded-2xl p-4 shadow-xl">
            <nav aria-label="Menu móvel">
              <ul className="flex flex-col items-stretch gap-2">
                {navItems.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={navToId(item)}
                      className="block px-4 py-3 text-center font-[Plus_Jakarta_Sans] font-medium text-[#d6dde6] text-[16px] rounded-lg hover:bg-white/10"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <a
              href="#contato"
              className="mt-3 w-full inline-flex items-center justify-center h-10 rounded-full bg-gradient-to-r from-white to-gray-50 text-gray-800 font-[Plus_Jakarta_Sans] font-extrabold text-sm border border-white/20"
              onClick={() => setMobileOpen(false)}
            >
              {headerData.contactButton}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
