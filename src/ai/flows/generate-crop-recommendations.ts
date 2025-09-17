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

const RecommendedCropSchema = z.object({
    name: z.string().describe('The name of a suitable crop to plant.'),
    rationale: z.string().describe('Explanation of why this crop is recommended.'),
});

const GenerateCropRecommendationsOutputSchema = z.object({
  recommendedCrops: z.array(RecommendedCropSchema).describe('A list of the 2-3 most suitable crops to plant.'),
  recommendedProducts: z.string().describe('A general list of pesticides, manures, and fertilizers needed to cultivate the recommended crops successfully.'),
  rationale: z.string().describe('A general rationale for why these types of crops are recommended for the given conditions.'),
  nearestStores: z.array(z.object({
    name: z.string().describe('The name of the store.'),
    address: z.string().describe('The full, searchable address of the store.'),
  })).describe('A list of 2-3 fictional but realistic local stores with full, searchable addresses where the recommended products can be purchased.'),
});
export type GenerateCropRecommendationsOutput = z.infer<typeof GenerateCropRecommendationsOutputSchema>;

export async function generateCropRecommendations(input: GenerateCropRecommendationsInput): Promise<GenerateCropRecommendationsOutput> {
  return generateCropRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCropRecommendationsPrompt',
  input: {schema: GenerateCropRecommendationsInputSchema},
  output: {schema: GenerateCropRecommendationsOutputSchema},
  prompt: `You are an expert agricultural advisor. Analyze the following data and provide a clear, actionable recommendation. Generate a list of 2-3 suitable crops to plant, with a specific rationale for each. Also, provide a general list of products needed for these crops, a general rationale covering the crop types, and a list of 2-3 fictional but realistic local stores with full, searchable addresses where the products can be purchased based on the geographic region.\n\nWeather Data: {{{weatherData}}}\nSoil Type: {{{soilType}}}\nGeographic Region: {{{geographicRegion}}}\nHistorical Yields (if available): {{{historicalYields}}}\nMarket Demand (if available): {{{marketDemand}}}\n\nBased on this information, provide your recommendations.`,
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
