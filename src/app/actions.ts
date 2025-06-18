// @ts-nocheck
// Disabling TypeScript check for this file due to Genkit AI flow integration not having perfect out-of-the-box type inference with Server Actions yet.
// This is a temporary workaround. Production code should have full type safety.
'use server';

import { generateWebsiteTitle, type GenerateWebsiteTitleInput } from '@/ai/flows/generate-website-title';
import { generateMetaDescription, type GenerateMetaDescriptionInput } from '@/ai/flows/generate-meta-description';
import { generateContentSections, type GenerateContentSectionsInput } from '@/ai/flows/generate-content-sections';
import type { ContentSection, GeneratedSite, SiteGenerationFormData } from '@/types';
import { renderSiteToHtml } from '@/lib/html-renderer';

export interface GenerateSiteResult {
  success: boolean;
  siteData?: GeneratedSite;
  error?: string;
}

export async function generateSiteAction(formData: SiteGenerationFormData): Promise<GenerateSiteResult> {
  try {
    const { topic, style, numSections } = formData;

    if (!topic || !style || !numSections) {
      throw new Error('Missing required fields: topic, style, or number of sections.');
    }
    if (numSections < 3 || numSections > 5) {
      throw new Error('Number of sections must be between 3 and 5.');
    }

    const titleInput: GenerateWebsiteTitleInput = { topic };
    const titleOutput = await generateWebsiteTitle(titleInput);
    const siteTitle = titleOutput.title;

    const metaDescriptionInput: GenerateMetaDescriptionInput = { topic };
    const metaDescriptionOutput = await generateMetaDescription(metaDescriptionInput);
    const siteMetaDescription = metaDescriptionOutput.metaDescription;

    const contentSectionsInput: GenerateContentSectionsInput = {
      topic,
      style,
      numSections: Number(numSections),
      maxTokens: 800, // This could be configurable if needed
    };
    const siteContentSections: ContentSection[] = await generateContentSections(contentSectionsInput);

    if (!siteTitle || !siteMetaDescription || !siteContentSections || siteContentSections.length === 0) {
      throw new Error('AI failed to generate one or more site components.');
    }
    
    const siteId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const partialSiteData = {
      title: siteTitle,
      metaDescription: siteMetaDescription,
      contentSections: siteContentSections,
    };

    const htmlContent = renderSiteToHtml(partialSiteData);

    const generatedSite: GeneratedSite = {
      id: siteId,
      topic,
      style,
      title: siteTitle,
      metaDescription: siteMetaDescription,
      contentSections: siteContentSections,
      htmlContent,
      timestamp,
    };

    return { success: true, siteData: generatedSite };
  } catch (error) {
    console.error('Error generating site:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during site generation.';
    return { success: false, error: errorMessage };
  }
}
