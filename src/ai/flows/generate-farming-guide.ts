'use server';
/**
 * @fileOverview A Genkit flow for generating a step-by-step farming guide for a specific crop.
 *
 * - generateFarmingGuide - A function that takes a crop name and language and returns a detailed guide.
 * - GenerateFarmingGuideInput - The input type for the generateFarmingGuide function.
 * - FarmingGuide - The output type (the guide itself).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateFarmingGuideInputSchema = z.object({
    cropName: z.string().describe("The name of the crop for which to generate a guide."),
    language: z.string().describe("The language in which the guide should be written (e.g., 'en', 'hi').")
});
export type GenerateFarmingGuideInput = z.infer<typeof GenerateFarmingGuideInputSchema>;


export const FarmingGuideSchema = z.object({
    cropName: z.string(),
    introduction: z.string().describe("A brief introduction to growing this crop."),
    soilPreparation: z.array(z.string()).describe("Steps for preparing the soil."),
    sowing: z.array(z.string()).describe("Instructions for sowing seeds."),
    fertilizers: z.array(z.string()).describe("Guidance on fertilizer application."),
    irrigation: z.array(z.string()).describe("Instructions on watering the crop."),
    weedControl: z.array(z.string()).describe("Methods for controlling weeds."),
    harvesting: z.array(z.string()).describe("Guidance on when and how to harvest."),
});
export type FarmingGuide = z.infer<typeof FarmingGuideSchema>;


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
