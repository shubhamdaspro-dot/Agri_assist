'use server';
/**
 * @fileOverview An AI agent that answers farming-related questions using voice input and output.
 *
 * - answerFarmingQueriesWithVoice - A function that handles the question answering process with voice.
 * - AnswerFarmingQueriesWithVoiceInput - The input type for the answerFarmingQueriesWithVoice function.
 * - AnswerFarmingQueriesWithVoiceOutput - The return type for the answerFarmingQueriesWithVoice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const AnswerFarmingQueriesWithVoiceInputSchema = z.object({
  voiceQueryDataUri: z
    .string()
    .describe(
      "A voice recording of a farmer's question, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  spokenLanguage: z.string().describe('The language of the voice query.'),
});
export type AnswerFarmingQueriesWithVoiceInput = z.infer<typeof AnswerFarmingQueriesWithVoiceInputSchema>;

const AnswerFarmingQueriesWithVoiceOutputSchema = z.object({
  spokenResponseDataUri: z
    .string()
    .describe(
      'The AI response as a voice recording, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type AnswerFarmingQueriesWithVoiceOutput = z.infer<typeof AnswerFarmingQueriesWithVoiceOutputSchema>;

export async function answerFarmingQueriesWithVoice(
  input: AnswerFarmingQueriesWithVoiceInput
): Promise<AnswerFarmingQueriesWithVoiceOutput> {
  return answerFarmingQueriesWithVoiceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerFarmingQueriesWithVoicePrompt',
  input: {schema: AnswerFarmingQueriesWithVoiceInputSchema},
  prompt: `You are an expert AI assistant for farmers. You will answer the question in the same language as the spoken language.

  Question: {{{voiceQueryDataUri}}}`,
});

const answerFarmingQueriesWithVoiceFlow = ai.defineFlow(
  {
    name: 'answerFarmingQueriesWithVoiceFlow',
    inputSchema: AnswerFarmingQueriesWithVoiceInputSchema,
    outputSchema: AnswerFarmingQueriesWithVoiceOutputSchema,
  },
  async input => {
    // Transcribe the audio query
    const {text: transcribedQuery} = await ai.generate({
      prompt: input.voiceQueryDataUri,
    });

    //Get the LLM text response
    const {text: textResponse} = await ai.generate({
      prompt: `You are an expert AI assistant for farmers. Answer the following question in the same language as the farmer. Question: ${transcribedQuery}`,
    });

    // Convert the text response to speech
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: textResponse,
    });

    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const spokenResponseDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {spokenResponseDataUri};
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
