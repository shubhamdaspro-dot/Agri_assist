'use server';
/**
 * @fileOverview Diagnoses a crop disease from a photo or name.
 *
 * - diagnoseCropDisease - A function that takes a photo or disease name and returns a diagnosis.
 * - DiagnoseCropDiseaseInput - The input type for the diagnoseCropDisease function.
 * - DiagnoseCropDiseaseOutput - The return type for the diagnoseCropDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseCropDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of an affected plant part, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  diseaseName: z.string().optional().describe('The name of the suspected crop disease.'),
});
export type DiagnoseCropDiseaseInput = z.infer<typeof DiagnoseCropDiseaseInputSchema>;

const DiagnoseCropDiseaseOutputSchema = z.object({
  disease: z.string().describe('The identified name of the disease.'),
  description: z.string().describe('A detailed description of the disease, including its symptoms.'),
  prevention: z.array(z.string()).describe('A list of actionable steps to prevent the disease.'),
  treatment: z.array(z.string()).describe('A list of actionable steps to treat the disease.'),
  isDiseaseIdentified: z.boolean().describe('Whether a disease was confidently identified.'),
});
export type DiagnoseCropDiseaseOutput = z.infer<typeof DiagnoseCropDiseaseOutputSchema>;

export async function diagnoseCropDisease(input: DiagnoseCropDiseaseInput): Promise<DiagnoseCropDiseaseOutput> {
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
     if (!input.photoDataUri && !input.diseaseName) {
      throw new Error('Either a photo or a disease name must be provided.');
    }
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
