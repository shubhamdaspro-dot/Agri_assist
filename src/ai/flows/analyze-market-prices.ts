'use server';
/**
 * @fileOverview Analyzes market prices for a given crop.
 *
 * - analyzeMarketPrices - A function that returns market analysis for a crop.
 * - AnalyzeMarketPricesInput - The input type for the function.
 * - AnalyzeMarketPricesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeMarketPricesInputSchema = z.object({
  cropName: z.string().describe('The name of the crop to analyze.'),
  geographicRegion: z.string().describe('The user\'s geographic region to provide localized analysis.'),
});
export type AnalyzeMarketPricesInput = z.infer<typeof AnalyzeMarketPricesInputSchema>;

export const AnalyzeMarketPricesOutputSchema = z.object({
  cropName: z.string(),
  currentPrice: z.string().describe('A realistic, fictional current market price range for the crop in the specified region (e.g., "₹2,000 - ₹2,200 per quintal").'),
  priceTrend: z.enum(['Rising', 'Stable', 'Falling']).describe('The current price trend.'),
  sellingSuggestions: z
    .array(
      z.object({
        location: z.string().describe('A fictional but realistic name of a market, city, or vendor.'),
        rationale: z.string().describe('A brief explanation of why this location could offer better profits (e.g., higher demand, lower supply, specific events).'),
      })
    )
    .describe('A list of 2-3 suggested locations or vendors to sell the crop for higher profit.'),
});
export type AnalyzeMarketPricesOutput = z.infer<typeof AnalyzeMarketPricesOutputSchema>;

export async function analyzeMarketPrices(input: AnalyzeMarketPricesInput): Promise<AnalyzeMarketPricesOutput> {
    return analyzeMarketPricesFlow(input);
}


const prompt = ai.definePrompt({
  name: 'analyzeMarketPricesPrompt',
  input: {schema: AnalyzeMarketPricesInputSchema},
  output: {schema: AnalyzeMarketPricesOutputSchema},
  prompt: `You are an expert agricultural market analyst. Your task is to provide a fictional but realistic market price analysis for a specific crop in a given region.

Crop: {{{cropName}}}
Region: {{{geographicRegion}}}

Based on this, provide the following:
1.  **Current Price**: A realistic price range for the crop in the local currency (e.g., INR for India).
2.  **Price Trend**: State whether the price is 'Rising', 'Stable', or 'Falling'.
3.  **Selling Suggestions**: Recommend 2-3 fictional but plausible markets, cities, or types of vendors where the farmer might get a better price. For each suggestion, provide a short rationale. For example, "Sell at the 'Nagpur Orange Festival' for premium prices due to high tourist traffic" or "Consider 'Pune Central Market' where demand is currently outstripping supply."

Generate a unique and creative response for each request.
`,
});

const analyzeMarketPricesFlow = ai.defineFlow(
  {
    name: 'analyzeMarketPricesFlow',
    inputSchema: AnalyzeMarketPricesInputSchema,
    outputSchema: AnalyzeMarketPricesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
