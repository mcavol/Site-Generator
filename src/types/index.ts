export interface ContentSection {
  heading: string;
  content: string;
}

export interface GeneratedSite {
  id: string;
  topic: string;
  style: string;
  title: string;
  metaDescription: string;
  contentSections: ContentSection[];
  htmlContent: string; // Store the rendered HTML
  timestamp: string;
}

export interface GenerationLog {
  id: string;
  topic: string;
  style: string;
  sectionsCount: number;
  timestamp: string;
  status: 'success' | 'failure';
  siteId?: string; 
  error?: string;
}

export interface SiteGenerationFormData {
  topic: string;
  style: string;
  numSections: number;
}
