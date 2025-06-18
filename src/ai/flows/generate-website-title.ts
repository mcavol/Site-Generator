
'use server';

/**
 * @fileOverview Generates a unique website title based on a given topic.
 *
 * - generateWebsiteTitle - A function that generates a unique website title.
 * - GenerateWebsiteTitleInput - The input type for the generateWebsiteTitle function.
 * - GenerateWebsiteTitleOutput - The return type for the generateWebsiteTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWebsiteTitleInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate a website title.'),
});
export type GenerateWebsiteTitleInput = z.infer<typeof GenerateWebsiteTitleInputSchema>;

const GenerateWebsiteTitleOutputSchema = z.object({
  title: z.string().describe('The generated website title.'),
});
export type GenerateWebsiteTitleOutput = z.infer<typeof GenerateWebsiteTitleOutputSchema>;

export async function generateWebsiteTitle(input: GenerateWebsiteTitleInput): Promise<GenerateWebsiteTitleOutput> {
  return generateWebsiteTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebsiteTitlePrompt',
  input: {schema: GenerateWebsiteTitleInputSchema},
  output: {schema: GenerateWebsiteTitleOutputSchema},
  prompt: `Generate a unique and engaging website title for the topic: {{{topic}}}.`
});

const generateWebsiteTitleFlow = ai.defineFlow(
  {
    name: 'generateWebsiteTitleFlow',
    inputSchema: GenerateWebsiteTitleInputSchema,
    outputSchema: GenerateWebsiteTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
