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
      "A voice recording of a farmer's question, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type AnswerFarmingQueriesWithVoiceInput = z.infer<typeof AnswerFarmingQueriesWithVoiceInputSchema>;

const AnswerFarmingQueriesWithVoiceOutputSchema = z.object({
  textQuery: z.string().describe('The transcribed text of the user query.'),
  textResponse: z.string().describe('The transcribed text of the AI response.'),
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

const answerFarmingQueriesWithVoiceFlow = ai.defineFlow(
  {
    name: 'answerFarmingQueriesWithVoiceFlow',
    inputSchema: AnswerFarmingQueriesWithVoiceInputSchema,
    outputSchema: AnswerFarmingQueriesWithVoiceOutputSchema,
  },
  async input => {
    // Transcribe the audio query
    const {text: transcribedQuery} = await ai.generate({
      prompt: [
        {
          media: {
            url: input.voiceQueryDataUri,
          }
        },
        {
          text: 'Transcribe this audio. It is a question about farming.'
        }
      ],
    });

    if (!transcribedQuery) {
        throw new Error('Could not transcribe audio query.');
    }

    //Get the LLM text response
    const {text: textResponse} = await ai.generate({
      system: `You are an expert AI assistant for farmers named SPROUT. You are friendly, helpful, and provide smooth, precise, and conversational answers. Your goal is to provide accurate, actionable information that is easy to understand. IMPORTANT: You must detect the language of the user's question and ALWAYS reply in that same language.`,
      prompt: `Answer the following question: ${transcribedQuery}`,
    });

     if (!textResponse) {
      throw new Error('Failed to generate text response.');
    }

    // Convert the text response to speech
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'}, // Hardcoded to male voice
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

    return {textQuery: transcribedQuery, textResponse, spokenResponseDataUri};
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
