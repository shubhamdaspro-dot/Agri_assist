'use server';

import { generateCropRecommendations, GenerateCropRecommendationsInput, GenerateCropRecommendationsOutput } from '@/ai/flows/generate-crop-recommendations';
import { analyzeSoilFromPhoto, AnalyzeSoilFromPhotoInput, AnalyzeSoilFromPhotoOutput } from '@/ai/flows/analyze-soil-from-photo';
import { ai } from '@/ai/genkit';
import wav from 'wav';
import { z } from 'zod';
import { fetchLatestNews } from '@/ai/flows/fetch-latest-news';
import type { FetchLatestNewsOutput } from './types';

export async function getCropRecommendations(
  input: GenerateCropRecommendationsInput
): Promise<{ success: boolean; data: GenerateCropRecommendationsOutput | null; error?: string }> {
  try {
    const result = await generateCropRecommendations(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error(e);
    return { success: false, data: null, error: e.message || 'An unknown error occurred.' };
  }
}

export async function analyzeSoilFromPhotoAction(
  input: AnalyzeSoilFromPhotoInput
): Promise<{ success: boolean; data: AnalyzeSoilFromPhotoOutput | null; error?: string }> {
  try {
    const result = await analyzeSoilFromPhoto(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error(e);
    return { success: false, data: null, error: e.message || 'An unknown error occurred.' };
  }
}


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

    let bufs: any[] = [];
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

export async function answerTextQueryWithVoice(
  query: string
): Promise<{ success: boolean; textResponse?: string; spokenResponseDataUri?: string; error?: string }> {
  try {
    // 1. Get text response from LLM
    const { text: textResponse } = await ai.generate({
      prompt: `You are an expert AI assistant for farmers. You are friendly, helpful, and provide concise answers. Answer the following question: ${query}`,
    });

    if (!textResponse) {
      throw new Error('Failed to generate text response.');
    }

    // 2. Convert text response to speech
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: textResponse,
    });

    if (!media?.url) {
      throw new Error('Failed to generate audio response.');
    }

    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const spokenResponseDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return { success: true, textResponse, spokenResponseDataUri };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message || 'An unknown error occurred while processing your request.' };
  }
}

export async function getLatestNews(
  language: string
): Promise<{ success: boolean; data: FetchLatestNewsOutput | null; error?: string }> {
  try {
    const result = await fetchLatestNews(language);
    return { success: true, data: result };
  } catch (e: any) {
    console.error(e);
    return { success: false, data: null, error: e.message || 'An unknown error occurred.' };
  }
}
