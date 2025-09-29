'use server';
/**
 * @fileOverview Diagnoses a crop disease from a photo or name.
 *
 * - diagnoseCropDisease - A function that takes a photo or disease name and returns a diagnosis.
 * - DiagnoseCropDiseaseInput - The input type for the diagnoseCropDisease function.
 * - DiagnoseCropDiseaseOutput - The return type for the diagnoseCropDisease function.
 */

import {ai} from '@/ai/genkit';
import { DiagnoseCropDiseaseInputSchema, DiagnoseCropDiseaseOutputSchema, type DiagnoseCropDiseaseInput, type DiagnoseCropDiseaseOutput } from '@/lib/types';


export async function diagnoseCropDisease(input: DiagnoseCropDiseaseInput): Promise<DiagnoseCropDiseaseOutput> {
  if (!input.photoDataUri && !input.diseaseName) {
    throw new Error('Either a photo or a disease name must be provided.');
  }
  return diagnoseCropDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseCropDiseasePrompt',
  input: {schema: DiagnoseCropDiseaseInputSchema},
  output: {schema: DiagnoseCropDiseaseOutputSchema},
  prompt: `You are an expert plant pathologist. Your task is to diagnose a crop disease based on the provided information.

The user has provided either a photo of an affected plant or the name of a disease.

{{#if photoDataUri}}
Analyze the following image to identify the plant disease. 
Photo: {{media url=photoDataUri}}
{{/if}}

{{#if diseaseName}}
The user has specified the disease as: {{{diseaseName}}}.
{{/if}}

Based on the available information, provide the following:
1.  **Disease Identification**: Clearly state the name of the disease. If you are analyzing a photo and cannot confidently identify the disease, state that and set 'isDiseaseIdentified' to false.
2.  **Description**: Provide a detailed description of the disease, including its common symptoms, the plants it affects, and how it spreads.
3.  **Prevention**: List several actionable, step-by-step methods for preventing this disease in the future.
4.  **Treatment**: List several actionable, step-by-step methods for treating an existing infection. Include both organic and chemical treatment options if applicable.

If no disease can be identified from the photo, provide general advice for improving plant health and suggest taking a clearer picture.
`,
});

const diagnoseCropDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnoseCropDiseaseFlow',
    inputSchema: DiagnoseCropDiseaseInputSchema,
    outputSchema: DiagnoseCropDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      return {
        disease: 'Unknown',
        description: 'The AI could not confidently identify the disease from the provided information. Please try again with a clearer photo or a more specific disease name.',
        prevention: [],
        treatment: [],
        isDiseaseIdentified: false,
      };
    }
    return output;
  }
);
