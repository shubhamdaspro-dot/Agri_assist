'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating crop recommendations based on weather, soil, and regional data.
 *
 * - generateCropRecommendations - A function that takes weather, soil, and regional data as input and returns crop recommendations.
 * - GenerateCropRecommendationsInput - The input type for the generateCropRecommendations function.
 * - GenerateCropRecommendationsOutput - The return type for the generateCropRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCropRecommendationsInputSchema = z.object({
  weatherData: z.string().describe('Real-time and forecasted weather data (temperature, rainfall, humidity).'),
  soilType: z.string().describe('Soil type based on geographic location.'),
  geographicRegion: z.string().describe('Location-based data to understand regional farming practices.'),
  historicalYields: z.string().optional().describe('Historical crop yields in the area.'),
  marketDemand: z.string().optional().describe('Market demand data for different crops.'),
});
export type GenerateCropRecommendationsInput = z.infer<typeof GenerateCropRecommendationsInputSchema>;

const GenerateCropRecommendationsOutputSchema = z.object({
  recommendedCrop: z.string().describe('The most suitable crop to plant.'),
  recommendedProducts: z.string().describe('Specific pesticides, manures, and fertilizers needed to cultivate the recommended crop successfully.'),
  rationale: z.string().describe('Explanation of why the crop was recommended'),
  nearestStores: z.string().describe('A suggestion of where to buy the recommended products, like "local agricultural co-operatives or large retailers in nearby towns".'),
});
export type GenerateCropRecommendationsOutput = z.infer<typeof GenerateCropRecommendationsOutputSchema>;

export async function generateCropRecommendations(input: GenerateCropRecommendationsInput): Promise<GenerateCropRecommendationsOutput> {
  return generateCropRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCropRecommendationsPrompt',
  input: {schema: GenerateCropRecommendationsInputSchema},
  output: {schema: GenerateCropRecommendationsOutputSchema},
  prompt: `You are an expert agricultural advisor. Analyze the following data and provide a clear, actionable recommendation for the most suitable crop to plant, the specific products needed, your rationale, and a general suggestion for where to buy the products.\n\nWeather Data: {{{weatherData}}}\nSoil Type: {{{soilType}}}\nGeographic Region: {{{geographicRegion}}}\nHistorical Yields (if available): {{{historicalYields}}}\nMarket Demand (if available): {{{marketDemand}}}\n\nBased on this information, recommend a crop, the products needed (pesticides, fertilizers, etc.), your rationale, and a generic pointer to where such products can be purchased locally (e.g., "local agricultural supply stores or farmer co-operatives").`, 
});

const generateCropRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateCropRecommendationsFlow',
    inputSchema: GenerateCropRecommendationsInputSchema,
    outputSchema: GenerateCropRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
