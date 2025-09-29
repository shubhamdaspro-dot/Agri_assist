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
  waterSource: z.string().optional().describe('The primary source of water for the farm (e.g., Rain Only, Canal / River, Borewell / Tubewell).'),
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
  prompt: `You are an expert agricultural advisor. Your task is to provide a detailed and structured crop recommendation based on the user's input. The response must be a valid JSON object that strictly conforms to the provided output schema.

User's Data:
- Geographic Region: {{{geographicRegion}}}
- Soil Type: {{{soilType}}}
- Weather Data: {{{weatherData}}}
{{#if waterSource}}
- Water Source: {{{waterSource}}}
{{/if}}

Based on this information, you must:
1.  Recommend the 3 most suitable crops.
2.  For each crop, provide a rationale, sowing season, harvesting season, and water requirement ('High', 'Medium', or 'Low').
3.  Suggest specific pesticides, fertilizers, and manures for these crops.
4.  Provide a general rationale explaining why this group of crops is suitable.
5.  List 2-3 fictional but realistic local stores with full, searchable addresses where the farmer can buy these products. The stores should be plausible for the given geographic region.

Your final output must be ONLY the JSON object, without any surrounding text or markdown.

Example of a perfect response format:
{
  "recommendedCrops": [
    {
      "name": "Cotton",
      "rationale": "Well-suited for the black clayey soil and hot climate of this region.",
      "sowingSeason": "May-June",
      "harvestingSeason": "October-December",
      "waterRequirement": "Medium"
    },
    {
      "name": "Soybean",
      "rationale": "Tolerant of the soil type and has good market demand.",
      "sowingSeason": "June-July",
      "harvestingSeason": "October-November",
      "waterRequirement": "Medium"
    },
    {
      "name": "Pigeon Pea (Tur)",
      "rationale": "A hardy crop that improves soil fertility and requires less water.",
      "sowingSeason": "June-July",
      "harvestingSeason": "December-January",
      "waterRequirement": "Low"
    }
  ],
  "recommendedProducts": {
    "pesticides": ["Acetamiprid", "Imidacloprid"],
    "fertilizers": ["Urea", "DAP", "MOP"],
    "manures": ["Farm Yard Manure", "Vermicompost"]
  },
  "rationale": "This selection of crops is ideal for the provided soil and weather conditions, balancing water usage and maximizing potential profitability based on regional strengths.",
  "nearestStores": [
    {
      "name": "Gupta Agro Chemicals",
      "address": "12, Main Market, Wardha, Maharashtra, 442001, India"
    },
    {
      "name": "Maharashtra Farmers Cooperative",
      "address": "Plot 45, MIDC Industrial Area, Nagpur Road, Wardha, Maharashtra, 442001, India"
    }
  ]
}
`,
});

const generateCropRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateCropRecommendationsFlow',
    inputSchema: GenerateCropRecommendationsInputSchema,
    outputSchema: GenerateCropRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI model returned an empty response. Please try again.");
    }
    return output;
  }
);
