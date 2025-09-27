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
import { AnalyzeMarketPricesInputSchema, AnalyzeMarketPricesOutputSchema, type AnalyzeMarketPricesInput, type AnalyzeMarketPricesOutput } from '@/lib/types';


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
