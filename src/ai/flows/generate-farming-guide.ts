'use server';
/**
 * @fileOverview A Genkit flow for generating a step-by-step farming guide for a specific crop.
 *
 * - generateFarmingGuide - A function that takes a crop name and language and returns a detailed guide.
 */

import {ai} from '@/ai/genkit';
import { GenerateFarmingGuideInputSchema, FarmingGuideSchema, type GenerateFarmingGuideInput, type FarmingGuide } from '@/lib/types';


export async function generateFarmingGuide(input: GenerateFarmingGuideInput): Promise<FarmingGuide> {
  return generateFarmingGuideFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateFarmingGuidePrompt',
  input: { schema: GenerateFarmingGuideInputSchema },
  output: { schema: FarmingGuideSchema },
  prompt: `Generate a detailed, step-by-step farming guide for {{{cropName}}}. The guide should be easy for a beginner farmer to understand. Provide practical, actionable steps for each stage of cultivation. The response must be in the {{{language}}} language.`,
});


const generateFarmingGuideFlow = ai.defineFlow(
  {
    name: 'generateFarmingGuideFlow',
    inputSchema: GenerateFarmingGuideInputSchema,
    outputSchema: FarmingGuideSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate a farming guide. The model did not return a valid response.");
    }
    return output;
  }
);
