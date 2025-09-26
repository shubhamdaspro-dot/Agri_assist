'use server';
/**
 * @fileOverview Analyzes the profitability of recommended crops.
 *
 * - analyzeCropProfitability - A function that takes recommended crops and returns a profitability analysis.
 * - AnalyzeCropProfitabilityInput - The input type for the function.
 * - AnalyzeCropProfitabilityOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendedCropSchema = z.object({
  name: z.string(),
  rationale: z.string(),
});

const AnalyzeCropProfitabilityInputSchema = z.object({
  recommendedCrops: z.array(RecommendedCropSchema),
  marketDemand: z.string().optional(),
  historicalYields: z.string().optional(),
  geographicRegion: z.string(),
});
export type AnalyzeCropProfitabilityInput = z.infer<typeof AnalyzeCropProfitabilityInputSchema>;

const ProfitabilityAnalysisSchema = z.object({
  cropName: z.string().describe('The name of the crop being analyzed.'),
  profitPotential: z.enum(['High', 'Medium', 'Low']).describe('The estimated profit potential (High, Medium, or Low).'),
  analysis: z.string().describe('A brief analysis explaining the profit potential, considering market trends, cultivation costs, and potential yield.'),
});

const AnalyzeCropProfitabilityOutputSchema = z.object({
  profitabilityAnalysis: z.array(ProfitabilityAnalysisSchema),
});
export type AnalyzeCropProfitabilityOutput = z.infer<typeof AnalyzeCropProfitabilityOutputSchema>;

export async function analyzeCropProfitability(
  input: AnalyzeCropProfitabilityInput
): Promise<AnalyzeCropProfitabilityOutput> {
  return analyzeCropProfitabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCropProfitabilityPrompt',
  input: {schema: AnalyzeCropProfitabilityInputSchema},
  output: {schema: AnalyzeCropProfitabilityOutputSchema},
  prompt: `You are an expert agricultural market analyst. Your task is to analyze the profitability of the following recommended crops based on the provided data.

Recommended Crops:
{{#each recommendedCrops}}
- {{name}}: {{rationale}}
{{/each}}

Contextual Data:
- Geographic Region: {{{geographicRegion}}}
- Market Demand: {{{marketDemand}}}
- Historical Yields: {{{historicalYields}}}

For each crop, provide a profitability analysis. Assess the profit potential as 'High', 'Medium', or 'Low'. Your analysis should be concise and justify the potential based on factors like market price trends, input costs, demand, and suitability for the region.
`,
});

const analyzeCropProfitabilityFlow = ai.defineFlow(
  {
    name: 'analyzeCropProfitabilityFlow',
    inputSchema: AnalyzeCropProfitabilityInputSchema,
    outputSchema: AnalyzeCropProfitabilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
