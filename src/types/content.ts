export interface HeaderData {
  name: string;
  subtitle: string;
  navigation: string[];
  contactButton: string;
}

export interface HeroData {
  title: string[];
}

export interface VideoData {
  id?: string;
  title: string;
  description: string;
  publishDate: string;
  category: string;
  duration: string;
  videoUrl: string;
  thumbnail?: string;
  backgroundImage?: string;
}

export interface HighlightsData {
  title: string;
  videos: VideoData[];
}

export interface AboutData {
  text: string;
}

export interface IndustriesData {
  text: string;
}

export interface VideoTypesData {
  types: string[];
}

export interface ProjectData {
  image: string;
  title: string;
  date: string;
}

export interface ProjectsData {
  projects: ProjectData[];
}

export interface TestimonialData {
  avatar: string;
  name: string;
  role: string;
  quote: string;
  profileImage?: string;
  lineImage?: string;
}

export interface TestimonialsData {
  title: string;
  testimonials: TestimonialData[];
}

export interface FooterData {
  copyright: string;
}

export interface AppContent {
  header: HeaderData;
  hero: HeroData;
  highlights: HighlightsData;
  about: AboutData;
  industries: IndustriesData;
  videoTypes: VideoTypesData;
  projects: ProjectsData;
  testimonials: TestimonialsData;
  footer: FooterData;
}
