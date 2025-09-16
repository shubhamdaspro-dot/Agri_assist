'use server';
/**
 * @fileOverview Analyzes a soil photo to determine its type.
 *
 * - analyzeSoilFromPhoto - A function that takes a photo and returns the soil type.
 * - AnalyzeSoilFromPhotoInput - The input type for the analyzeSoilFromPhoto function.
 * - AnalyzeSoilFromPhotoOutput - The return type for the analyzeSoilFromPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSoilFromPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of soil, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeSoilFromPhotoInput = z.infer<typeof AnalyzeSoilFromPhotoInputSchema>;

const AnalyzeSoilFromPhotoOutputSchema = z.object({
  soilType: z.string().describe('The identified type of the soil (e.g., Sandy, Clay, Loam, Silt).'),
  analysis: z.string().describe('A brief analysis of the soil characteristics based on the photo.'),
});
export type AnalyzeSoilFromPhotoOutput = z.infer<typeof AnalyzeSoilFromPhotoOutputSchema>;

export async function analyzeSoilFromPhoto(input: AnalyzeSoilFromPhotoInput): Promise<AnalyzeSoilFromPhotoOutput> {
  return analyzeSoilFromPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSoilFromPhotoPrompt',
  input: {schema: AnalyzeSoilFromPhotoInputSchema},
  output: {schema: AnalyzeSoilFromPhotoOutputSchema},
  prompt: `You are an expert soil scientist. Analyze the following image of soil and identify its type (e.g., Sandy, Clay, Loam, Silt). Provide a brief analysis of its visible characteristics like color, texture, and structure.

Use the following as the primary source of information about the soil.

Photo: {{media url=photoDataUri}}`,
});

const analyzeSoilFromPhotoFlow = ai.defineFlow(
  {
    name: 'analyzeSoilFromPhotoFlow',
    inputSchema: AnalyzeSoilFromPhotoInputSchema,
    outputSchema: AnalyzeSoilFromPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
