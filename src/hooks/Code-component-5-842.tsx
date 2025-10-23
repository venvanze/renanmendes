import React from 'react';

// Content parser - In a real app, this would read from the .md file
// For now, we'll use the content directly
const parseContent = () => {
  return {
    header: {
      name: "Renan Mendes",
      subtitle: "Editor profissional de vídeo",
      navigation: ["Início", "Portfólio", "Sobre"],
      contactButton: "Contato"
    },
    hero: {
      title: ["Visão Criativa", "E precisão", "Em Cada Quadro"],
      backgroundVideo: "https://www.youtube.com/embed/vCbw3UjVaPE?autoplay=1&mute=1&controls=0&loop=1&playlist=vCbw3UjVaPE&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=0"
    },
    about: {
      text: "Sou um editor de vídeo apaixonado com mais de uma década de experiência em transformar filmagens brutas em histórias envolventes."
    },
    industries: {
      text: "Meu trabalho abrange várias indústrias, trazendo um toque único a cada projeto."
    },
    videoTypes: {
      types: ["Documentários", "Clipes Musicais", "Campanhas Políticas", "Vídeos Corporativos"]
    },
    highlights: {
      title: "Destaques",
      videos: [
        {
          id: "clipe-musical-1",
          title: "Clipe Musical",
          description: "Produção completa de clipe musical com direção criativa, captura em múltiplas locações e pós-produção avançada.",
          thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
          youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          publishDate: "15 Mar 2024",
          duration: "3:42",
          category: "Clipe Musical",
          tags: ["música", "produção", "criativo"]
        },
        {
          id: "documentario-1",
          title: "Documentário Curto",
          description: "Narrativa envolvente sobre sustentabilidade urbana, com entrevistas exclusivas e cinematografia profissional.",
          thumbnail: "https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg",
          youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
          publishDate: "8 Feb 2024",
          duration: "12:30",
          category: "Documentário",
          tags: ["documentário", "sustentabilidade", "urbano"]
        },
        {
          id: "campanha-1",
          title: "Campanha Publicitária",
          description: "Vídeo promocional para marca de tecnologia, focando em storytelling emocional e identidade visual moderna.",
          thumbnail: "https://img.youtube.com/vi/hFZFjoX2cGg/maxresdefault.jpg",
          youtubeUrl: "https://www.youtube.com/watch?v=hFZFjoX2cGg",
          publishDate: "22 Jan 2024",
          duration: "1:45",
          category: "Corporativo",
          tags: ["publicidade", "tecnologia", "corporativo"]
        },
        {
          id: "evento-1",
          title: "Evento Corporativo",
          description: "Cobertura completa de evento empresarial com múltiplas câmeras, entrevistas e highlights dos momentos principais.",
          thumbnail: "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg",
          youtubeUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
          publishDate: "5 Dec 2023",
          duration: "8:15",
          category: "Evento",
          tags: ["evento", "corporativo", "cobertura"]
        },
        {
          id: "institucional-1",
          title: "Vídeo Institucional",
          description: "Apresentação elegante dos valores e missão da empresa, com depoimentos da equipe e locações estratégicas.",
          thumbnail: "https://img.youtube.com/vi/ZXsQAXx_ao0/maxresdefault.jpg",
          youtubeUrl: "https://www.youtube.com/watch?v=ZXsQAXx_ao0",
          publishDate: "18 Nov 2023",
          duration: "4:22",
          category: "Institucional",
          tags: ["institucional", "empresa", "valores"]
        },
        {
          id: "serie-web-1",
          title: "Série Web",
          description: "Episódios narrativos com alta produção, focando em desenvolvimento de personagens e cinematografia inovadora.",
          thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
          youtubeUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
          publishDate: "2 Nov 2023",
          duration: "22:10",
          category: "Entretenimento",
          tags: ["série", "narrativa", "entretenimento"]
        },
        {
          id: "tutorial-1",
          title: "Tutorial Técnico",
          description: "Conteúdo educacional com animações explicativas e demonstrações práticas para público especializado.",
          thumbnail: "https://img.youtube.com/vi/me6LO92aTcM/maxresdefault.jpg",
          youtubeUrl: "https://www.youtube.com/watch?v=me6LO92aTcM",
          publishDate: "28 Oct 2023",
          duration: "15:33",
          category: "Educacional",
          tags: ["tutorial", "técnico", "educacional"]
        }
      ]
    },
    projects: {
      title: "Projetos",
      projects: [
        { title: "Performance Musical", date: "Mar 2024", image: "performance-musical" },
        { title: "Documentário Natural", date: "Feb 2024", image: "documentario-natural" },
        { title: "Produto Tecnológico", date: "Jan 2024", image: "produto-tech" },
        { title: "Drama Teatral", date: "Dec 2023", image: "drama-teatral" },
        { title: "Viagem Cultural", date: "Nov 2023", image: "viagem-cultural" },
        { title: "Reunião Corporativa", date: "Oct 2023", image: "reuniao-corporativa" },
        { title: "Casamento Especial", date: "Sep 2023", image: "casamento-especial" },
        { title: "Animação Criativa", date: "Aug 2023", image: "animacao-criativa" },
        { title: "Estúdio de Edição", date: "Jul 2023", image: "estudio-edicao" }
      ]
    },
    testimonials: {
      title: "Clientes satisfeitos",
      testimonials: [
        {
          name: "Lydia Marlowe",
          role: "Diretora",
          quote: "Um verdadeiro profissional, entregando edições de primeira linha.",
          avatar: "lydia-marlowe"
        },
        {
          name: "Arjun Patel",
          role: "Produtor",
          quote: "Traz criatividade e precisão a cada projeto.",
          avatar: "arjun-patel"
        },
        {
          name: "Sofia Lin",
          role: "Cliente",
          quote: "Uma alegria trabalhar com ele, recomendo muito!",
          avatar: "sofia-lin"
        },
        {
          name: "Carlos Gomez",
          role: "Cinematógrafo",
          quote: "Habilidades de edição excepcionais e atenção aos detalhes.",
          avatar: "carlos-gomez"
        },
        {
          name: "Emma White",
          role: "Gerente de Marketing",
          quote: "Sempre entrega no prazo e supera as expectativas.",
          avatar: "emma-white"
        },
        {
          name: "Noah Kim",
          role: "Diretor Criativo",
          quote: "Um verdadeiro artista na sala de edição.",
          avatar: "noah-kim"
        }
      ]
    },
    footer: {
      copyright: "2025 - Renan Mendes - Edição profissional de vídeo",
      contactButton: "Entre em Contato"
    }
  };
};

export const useContent = () => {
  const [content, setContent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    try {
      const parsedContent = parseContent();
      setContent(parsedContent);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return { content, loading, error };
};

// Utility functions for YouTube integration
export const getYouTubeId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const getYouTubeThumbnail = (videoId, quality = 'maxresdefault') => {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

export const getYouTubeEmbedUrl = (videoId, options = {}) => {
  const defaultOptions = {
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
  
  const mergedOptions = { ...defaultOptions, ...options };
  const params = Object.entries(mergedOptions)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
    
  return `https://www.youtube.com/embed/${videoId}?${params}`;
};