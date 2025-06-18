'use server';

/**
 * @fileOverview Generates unique content sections for a website based on topic and style.
 *
 * - generateContentSections - A function that generates content sections.
 * - GenerateContentSectionsInput - The input type for the generateContentSections function.
 * - GenerateContentSectionsOutput - The return type for the generateContentSections function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentSectionSchema = z.object({
  heading: z.string().describe('The heading of the content section.'),
  content: z.string().describe('The content of the section.'),
});

const GenerateContentSectionsInputSchema = z.object({
  topic: z.string().describe('The topic of the website.'),
  style: z.string().describe('The style of the website (e.g., educational, marketing).'),
  numSections: z.number().min(3).max(5).default(3).describe('The number of content sections to generate (between 3 and 5).'),
  maxTokens: z.number().default(800).describe('The maximum number of tokens for the content.'),
});
export type GenerateContentSectionsInput = z.infer<typeof GenerateContentSectionsInputSchema>;

const GenerateContentSectionsOutputSchema = z.array(ContentSectionSchema);
export type GenerateContentSectionsOutput = z.infer<typeof GenerateContentSectionsOutputSchema>;

export async function generateContentSections(input: GenerateContentSectionsInput): Promise<GenerateContentSectionsOutput> {
  return generateContentSectionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentSectionsPrompt',
  input: {
    schema: GenerateContentSectionsInputSchema,
  },
  output: {
    schema: GenerateContentSectionsOutputSchema,
  },
  prompt: `You are an expert content creator.

  Your task is to generate {{numSections}} unique content sections for a website on the topic of "{{topic}}". The website should be in a "{{style}}" style.

  Each content section should have a heading and content. The content should be engaging and informative. Vary the structure and tone of each section to maintain reader interest.  Make sure that the generated content sections are unique from each other.
  
  Here are some example section ideas:
  - Introduction
  - Use Cases
  - Technical Details
  - Tools or Libraries
  - Summary or CTA
  - Advantages and Disadvantages
  - History
  - Future Trends
  - Case Studies

  Ensure the total length of all sections does not exceed {{maxTokens}} tokens.
  
  Output the content sections as a JSON array of objects, where each object has a "heading" and "content" field.
  
  Example:
  [
    {
      "heading": "Introduction",
      "content": "..."
    },
    {
      "heading": "Use Cases",
      "content": "..."
    }
  ]
  `,
});

const generateContentSectionsFlow = ai.defineFlow(
  {
    name: 'generateContentSectionsFlow',
    inputSchema: GenerateContentSectionsInputSchema,
    outputSchema: GenerateContentSectionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
