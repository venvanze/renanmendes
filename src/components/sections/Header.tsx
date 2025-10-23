import React from "react";
import { Menu, X } from "lucide-react";
import type { HeaderData } from "../../types/content";

interface HeaderProps {
  headerData: HeaderData;
}

const navToId = (label: string) => {
  const key = label.trim().toLowerCase();
  if (key.includes("início") || key.includes("inicio")) return "#inicio";
  if (key.includes("portfólio") || key.includes("portfolio")) return "#portfolio";
  if (key.includes("sobre")) return "#sobre";
  return "#";
};

export function Header({ headerData }: HeaderProps) {
  const [atPageEnd, setAtPageEnd] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const viewport = window.innerHeight;
      const fullHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const atEnd = scrollY + viewport >= fullHeight - 2;
      setAtPageEnd(atEnd);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('orientationchange', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('orientationchange', onScroll);
    };
  }, []);

  if (!headerData) return null;

  return (
    <header className="backdrop-blur-[42px] backdrop-filter bg-[rgba(46,46,46,0.48)] rounded-[24px] shadow-[0px_0px_30px_0px_rgba(0,0,0,0.25)] fixed top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 lg:top-12 lg:left-12 lg:right-12 z-50" role="banner">
      <div className="flex items-center justify-between px-6 lg:px-12 py-6">
        {/* Logo/name */}
        <div className="flex flex-col items-start">
          <span className="font-extrabold text-[#d6dde6] text-xl lg:text-[32px] leading-none tracking-[-1.28px]">
            {headerData.name}
          </span>
          <span className="font-medium text-[#d6dde6] text-xs lg:text-[14px] leading-[24px]">
            {headerData.subtitle}
          </span>
        </div>

        {/* Desktop Contact Button only (nav moved to Hero bottom) */}
        <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-8 ml-auto">
          <a
            href="#contato"
            className={`relative overflow-hidden rounded-full w-[175px] h-[51px] focus:outline-none transition-shadow ${
              atPageEnd
                ? 'ring-4 ring-[rgba(255,240,210,0.55)] shadow-[0_0_36px_rgba(255,240,210,0.80)]'
                : 'ring-0 shadow-none'
            }`}
            aria-label="Ir para contato"
          >
            <span className="relative flex items-center justify-center h-full font-[Plus_Jakarta_Sans] font-extrabold text-[18px] text-gray-800 transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-r from-white to-gray-50 shadow-lg hover:shadow-xl border border-white/20 rounded-full">
              {headerData.contactButton}
            </span>
          </a>
        </nav>

        {/* Mobile: only Contact button (nav moved to Hero bottom) */}
        <div className="lg:hidden flex items-center ml-auto">
          <a
            href="#contato"
            className={`relative overflow-hidden rounded-full h-10 px-4 flex items-center justify-center focus:outline-none bg-gradient-to-r from-white to-gray-50 border border-white/20 text-gray-800 transition-shadow ${
              atPageEnd
                ? 'ring-4 ring-[rgba(255,240,210,0.55)] shadow-[0_0_28px_rgba(255,240,210,0.80)]'
                : 'shadow-md ring-0'
            }`}
            aria-label="Ir para contato"
          >
            <span className="font-[Plus_Jakarta_Sans] font-extrabold text-sm leading-none">
              {headerData.contactButton}
            </span>
          </a>
          {/* hamburger removed */}
        </div>
      </div>

      {/* Mobile menu removed (nav now at Hero bottom) */}
      {/** Removed mobile floating contact button in favor of top-right placement */}
    </header>
  );
}
