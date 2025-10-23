import React from "react";
import type { FooterData } from "../../types/content";

interface FooterProps {
  footerData: FooterData;
}

export function Footer({ footerData }: FooterProps) {
  if (!footerData) return null;
  const year = new Date().getFullYear().toString();
  const leftText = React.useMemo(() => {
    const raw = footerData.copyright || "";
    // Replace placeholder {ano atual} or any 4-digit year with current year
    return raw
      .replace(/\{ano\s*atual\}/gi, year)
      .replace(/\b(19|20)\d{2}\b/, year);
  }, [footerData.copyright, year]);
  // Render "Desenvolvido por RM Labs" from char codes to avoid easy replacement via conteúdo externo
  const rightText = React.useMemo(() => {
    const codes = [68, 101, 115, 101, 110, 118, 111, 108, 118, 105, 100, 111, 32, 112, 111, 114, 32, 82, 77, 32, 76, 97, 98, 115];
    return String.fromCharCode(...codes);
  }, []);
  return (
    <footer className="bg-[#080f17] px-4 md:px-8 lg:px-[190px] py-6" aria-label="Rodapé">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-[Plus_Jakarta_Sans] font-medium text-[rgba(214,221,230,0.62)] text-sm sm:text-base lg:text-[18px] leading-[32px] tracking-[-0.18px] text-center sm:text-left">
          {leftText}
        </div>
        <div className="font-[Plus_Jakarta_Sans] font-medium text-[rgba(214,221,230,0.62)] text-sm sm:text-base lg:text-[18px] leading-[32px] tracking-[-0.18px] text-center sm:text-right">
          {rightText}
        </div>
      </div>
    </footer>
  );
}
