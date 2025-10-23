import React from "react";
import type { ProjectData, ProjectsData } from "../../types/content";

import imgSinger from "../../assets/26f0bff8ecb72d97702e276506f683642ec8477b.png";
import imgDocumentary from "../../assets/91dbb6323ebd6211d2b67738c2c533a93c8ee306.png";
import imgProduct from "../../assets/367c520f4309dafd95fc55c2fc8a46bf2752bcd6.png";
import imgDrama from "../../assets/8dd13b48783b54601b50e63df7d8fc35be602edb.png";
import imgTravel from "../../assets/ecc48a7d7cda0eb38a0d3a46993600acd54c4ba2.png";
import imgMeeting from "../../assets/129b4b05afdf91349d94c20f833ef9a59a7caa99.png";
import imgWedding from "../../assets/a646bddf50190f94ded532a35ac619fad73dcc4c.png";
import imgAnimation from "../../assets/14844666defc268aaa9cf423e75c8237ba2c36b3.png";
import imgStudio from "../../assets/bac2da892bf9aa30d9f32ad2aff74b7b6fcf71f1.png";

interface ProjectsSectionProps {
  projectsData: ProjectsData;
}

function ProjectCard({ image, title, date }: ProjectData) {
  return (
    <article className="flex flex-col gap-2 w-full">
      <div
        className="aspect-[4/3] bg-center bg-cover bg-no-repeat rounded-[24px] lg:rounded-[48px] overflow-hidden relative"
        style={{ backgroundImage: `url('${image}')` }}
        aria-label={title}
        role="img"
      >
        <div className="absolute inset-0 border-[1.5px] border-[rgba(214,221,230,0.2)] rounded-[24px] lg:rounded-[48px] pointer-events-none" aria-hidden />
      </div>
      <div className="flex flex-col">
        <h3 className="font-[Plus_Jakarta_Sans] font-extrabold text-[#d6dde6] text-sm sm:text-base lg:text-[18px] leading-[24px] truncate">
          {title}
        </h3>
        <span className="font-[Plus_Jakarta_Sans] font-medium text-[rgba(214,221,230,0.62)] text-xs sm:text-sm lg:text-[17px] leading-[24px] truncate">
          {date}
        </span>
      </div>
    </article>
  );
}

export function ProjectsSection({ projectsData }: ProjectsSectionProps) {
  if (!projectsData) return null;

  const imageMap: Record<string, string> = {
    "performance-musical": imgSinger,
    "documentario-natural": imgDocumentary,
    "produto-tech": imgProduct,
    "drama-teatral": imgDrama,
    "viagem-cultural": imgTravel,
    "reuniao-corporativa": imgMeeting,
    "casamento-especial": imgWedding,
    "animacao-criativa": imgAnimation,
    "estudio-edicao": imgStudio,
  };

  return (
    <section aria-label="Projetos" className="px-4 md:px-8 lg:px-[190px] py-12 lg:py-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-6">
        {projectsData.projects.map((project, i) => (
          <ProjectCard
            key={`${project.image}-${i}`}
            image={imageMap[project.image] || imageMap["performance-musical"]}
            title={project.title}
            date={project.date}
          />
        ))}
      </div>
    </section>
  );
}

