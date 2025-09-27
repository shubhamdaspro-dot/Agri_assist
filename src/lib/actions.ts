'use server';

import { generateCropRecommendations, GenerateCropRecommendationsInput, GenerateCropRecommendationsOutput } from '@/ai/flows/generate-crop-recommendations';
import { analyzeSoilFromPhoto, AnalyzeSoilFromPhotoInput, AnalyzeSoilFromPhotoOutput } from '@/ai/flows/analyze-soil-from-photo';
import { ai } from '@/ai/genkit';
import wav from 'wav';
import { z } from 'zod';
import { fetchLatestNews } from '@/ai/flows/fetch-latest-news';
import type { FetchLatestNewsOutput } from './types';
import { answerFarmingQueriesWithVoice } from '@/ai/flows/answer-farming-queries-with-voice';
import { diagnoseCropDisease, DiagnoseCropDiseaseInput, DiagnoseCropDiseaseOutput } from '@/ai/flows/diagnose-crop-disease';
import { analyzeCropProfitability, AnalyzeCropProfitabilityInput, AnalyzeCropProfitabilityOutput } from '@/ai/flows/analyze-crop-profitability';
import { analyzeMarketPrices } from '@/ai/flows/analyze-market-prices';
import { AnalyzeMarketPricesInput, AnalyzeMarketPricesOutput } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore';

function handleServiceError(e: any): string {
    if (e.message && e.message.includes('503')) {
        return 'The AI service is temporarily unavailable. Please try again in a few moments.';
    }
    return e.message || 'An unknown error occurred.';
}

export async function getCropRecommendations(
  input: GenerateCropRecommendationsInput
): Promise<{ success: boolean; data: GenerateCropRecommendationsOutput | null; error?: string }> {
  try {
    const result = await generateCropRecommendations(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error(e);
    return { success: false, data: null, error: handleServiceError(e) };
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
    return { success: false, data: null, error: handleServiceError(e) };
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
    const {text: textResponse} = await ai.generate({
      system: `You are an expert AI assistant for farmers named AgriAssist. You are friendly, helpful, and provide smooth, precise, and conversational answers. Your goal is to provide accurate, actionable information that is easy to understand.`,
      prompt: `Answer the following question: ${query}`,
    });

    if (!textResponse) {
      throw new Error('Failed to generate text response.');
    }

    let spokenResponseDataUri: string | undefined;
    try {
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

        if (media?.url) {
            const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
            spokenResponseDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));
        } else {
            console.warn('TTS service did not return audio media.');
        }
    } catch(ttsError: any) {
        console.error("Text-to-speech generation failed, returning text only. Error:", ttsError.message);
        // Do not re-throw, we can still return the text response.
    }

    return { success: true, textResponse, spokenResponseDataUri };
  } catch (e: any)
   {
    console.error(e);
    return { success: false, error: handleServiceError(e) };
  }
}

export async function answerVoiceQuery(
    voiceQueryDataUri: string
): Promise<{ success: boolean; textQuery?: string; textResponse?: string; spokenResponseDataUri?: string; error?: string }> {
    try {
        const result = await answerFarmingQueriesWithVoice({ voiceQueryDataUri });
        return { success: true, ...result };
    } catch (e: any) {
        console.error(e);
        return { success: false, error: handleServiceError(e) };
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
    return { success: false, data: null, error: handleServiceError(e) };
  }
}

export async function getDiseaseDiagnosis(
  input: DiagnoseCropDiseaseInput
): Promise<{ success: boolean; data: DiagnoseCropDiseaseOutput | null; error?: string }> {
  try {
    const result = await diagnoseCropDisease(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error(e);
    return { success: false, data: null, error: handleServiceError(e) };
  }
}

export async function getProfitabilityAnalysis(
  input: AnalyzeCropProfitabilityInput
): Promise<{ success: boolean; data: AnalyzeCropProfitabilityOutput | null; error?: string }> {
  try {
    const result = await analyzeCropProfitability(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error(e);
    return { success: false, data: null, error: handleServiceError(e) };
  }
}

export async function getMarketAnalysis(
  input: AnalyzeMarketPricesInput
): Promise<{ success: boolean; data: AnalyzeMarketPricesOutput | null; error?: string }> {
  try {
    const result = await analyzeMarketPrices(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error(e);
    return { success: false, data: null, error: handleServiceError(e) };
  }
}


const UserProfileSchema = z.object({
  uid: z.string(),
  phoneNumber: z.string(),
});

export async function createUserProfile(input: z.infer<typeof UserProfileSchema>) {
  try {
    const userRef = doc(db, 'users', input.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        phoneNumber: input.phoneNumber,
        createdAt: serverTimestamp(),
      });
    }
    return { success: true };
  } catch (e: any) {
    console.error('Error creating user profile:', e);
    return { success: false, error: e.message };
  }
}

export async function saveFcmToken(uid: string, token: string) {
    try {
        const userRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            await updateDoc(userRef, {
                fcmTokens: arrayUnion(token)
            });
        } else {
             await setDoc(userRef, {
                fcmTokens: [token],
                createdAt: serverTimestamp()
            }, { merge: true });
        }
        return { success: true };
    } catch (e: any) {
        console.error('Error saving FCM token:', e);
        return { success: false, error: e.message };
    }
}
