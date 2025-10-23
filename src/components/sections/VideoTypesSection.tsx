import React from "react";
import type { VideoTypesData } from "../../types/content";

interface VideoTypesSectionProps {
  videoTypesData: VideoTypesData;
}

export function VideoTypesSection({ videoTypesData }: VideoTypesSectionProps) {
  if (!videoTypesData) return null;
  return (
    <section aria-label="Tipos de vídeo" className="px-4 md:px-8 lg:px-[190px] py-8">
      <div className="backdrop-blur-[42px] backdrop-filter bg-[rgba(46,46,46,0.48)] rounded-[24px] shadow-[0px_0px_30px_0px_rgba(0,0,0,0.25)] p-4 lg:p-12">
        <ul className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 text-center">
          {videoTypesData.types.map((type, index) => (
            <li key={index} className="font-[Plus_Jakarta_Sans] font-medium text-[#d6dde6] text-sm sm:text-base lg:text-[18px] leading-[32px] tracking-[-0.18px]">
              {type}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

