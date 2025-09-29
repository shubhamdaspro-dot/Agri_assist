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
  waterSource: z.string().describe('The primary source of water for the farm (e.g., Rain Only, Canal / River, Borewell / Tubewell).'),
  geographicRegion: z.string().describe('Location-based data to understand regional farming practices.'),
  historicalYields: z.string().optional().describe('Historical crop yields in the area.'),
  marketDemand: z.string().optional().describe('Market demand data for different crops.'),
});
export type GenerateCropRecommendationsInput = z.infer<typeof GenerateCropRecommendationsInputSchema>;

const RecommendedCropSchema = z.object({
    name: z.string().describe('The name of a suitable crop to plant.'),
    rationale: z.string().describe('Explanation of why this crop is recommended.'),
    sowingSeason: z.string().describe("The ideal sowing season for the crop in this region (e.g., 'June-July')."),
    harvestingSeason: z.string().describe("The typical harvesting season for the crop (e.g., 'October-November')."),
    waterRequirement: z.enum(['High', 'Medium', 'Low']).describe("The crop's water requirement."),
});

const GenerateCropRecommendationsOutputSchema = z.object({
  recommendedCrops: z.array(RecommendedCropSchema).describe('A list of the 3 most suitable crops to plant with detailed cultivation information.'),
  recommendedProducts: z.object({
      pesticides: z.array(z.string()).describe('A list of specific pesticide names or types suitable for the recommended crops.'),
      fertilizers: z.array(z.string()).describe('A list of specific fertilizer names or types (e.g., "Urea", "DAP").'),
      manures: z.array(z.string()).describe('A list of recommended organic manures (e.g., "Cow Dung Manure", "Vermicompost").'),
  }).describe('A structured list of products needed to cultivate the recommended crops successfully.'),
  rationale: z.string().describe('A general rationale for why these types of crops are recommended for the given conditions.'),
  nearestStores: z.array(z.object({
    name: z.string().describe('The name of the store.'),
    address: z.string().describe('The full, searchable address of the store.'),
  })).describe('A list of 2-3 fictional but realistic local stores with full, searchable addresses where the recommended products can be purchased based on the geographic region.'),
});
export type GenerateCropRecommendationsOutput = z.infer<typeof GenerateCropRecommendationsOutputSchema>;

export async function generateCropRecommendations(input: GenerateCropRecommendationsInput): Promise<GenerateCropRecommendationsOutput> {
  return generateCropRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCropRecommendationsPrompt',
  input: {schema: GenerateCropRecommendationsInputSchema},
  output: {schema: GenerateCropRecommendationsOutputSchema},
  prompt: `You are an expert agricultural advisor. Analyze the following data and provide a clear, actionable recommendation. Generate a list of the 3 most suitable crops. For each crop, provide a specific rationale, the ideal sowing and harvesting seasons for the region, and its water requirement (High, Medium, or Low).

Also, provide a structured list of recommended products, including specific names/types of pesticides, fertilizers, and manures. Finally, provide a general rationale for the overall crop selection and a list of 2-3 fictional but realistic local stores with full, searchable addresses where these products can be purchased.
  
Your recommendations MUST be based on the provided Water Source and Soil Type.

Weather Data: {{{weatherData}}}
Soil Type: {{{soilType}}}
Water Source: {{{waterSource}}}
Geographic Region: {{{geographicRegion}}}
{{#if historicalYields}}Historical Yields (if available): {{{historicalYields}}}{{/if}}
{{#if marketDemand}}Market Demand (if available): {{{marketDemand}}}{{/if}}

Based on this information, provide your detailed recommendations.`,
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
