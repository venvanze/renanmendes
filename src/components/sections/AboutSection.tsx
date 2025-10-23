import React from "react";
import type { AboutData, IndustriesData } from "../../types/content";
import { motion } from "motion/react"

interface AboutSectionProps {
  aboutData: AboutData;
  industriesData: IndustriesData;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, easing: "ease-out" } },
};

function renderSplitText(text: string, idPrefix = "split") {
  // Split preserving spaces
  const tokens = text.split(/(\s+)/);
  return (
    <motion.span
      aria-hidden="false"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="inline"
    >
      {tokens.map((tok, i) => {
        const isSpace = /^\s+$/.test(tok);
        const content = isSpace ? tok.replace(/\s/g, "\u00A0") : tok;
        return (
          <motion.span
            key={`${idPrefix}-${i}`}
            variants={itemVariants}
            className="inline-block"
            style={{ whiteSpace: "pre" }}
          >
            {content}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

export function AboutSection({ aboutData, industriesData }: AboutSectionProps) {
  if (!aboutData || !industriesData) return null;
  return (
    <section id="sobre" aria-label="Sobre" className="scroll-offset bg-[#080f17] px-4 md:px-8 lg:px-[190px] py-12 lg:py-36">
      <div className="space-y-6 lg:space-y-6">
        {/* Linha 1: Texto principal */}
        <div className="max-w-4xl">
          <p className="font-[Plus_Jakarta_Sans] font-bold text-[#d6dde6] text-lg sm:text-2xl lg:text-[46px] leading-relaxed lg:leading-[68px] tracking-tight lg:tracking-[-0.92px]">
            {renderSplitText(
              "Sou um editor de vídeo apaixonado com mais de uma década de experiência em transformar filmagens brutas em histórias envolventes.",
              "about-main"
            )}
          </p>
        </div>

  <div className="w-full rounded-lg overflow-hidden">
        <img
          className="w-full h-auto object-cover"
          src="src/assets/linhadotempo.png"
          alt="Print do trabalho"
        />
  </div>
        {/* Linha 3: Texto secundário (indústrias) */}
        <div className="max-w-4xl ml-auto">
          <p className="font-[Plus_Jakarta_Sans] font-extralight text-[#d6dde6] text-lg sm:text-2xl lg:text-[46px] leading-relaxed lg:leading-[68px] tracking-tight lg:tracking-[-0.92px] text-right">
            {renderSplitText(
              "Meu trabalho abrange várias indústrias, trazendo um toque único a cada projeto.",
              "about-industries"
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
