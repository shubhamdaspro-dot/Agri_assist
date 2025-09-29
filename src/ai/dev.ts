import { config } from 'dotenv';
config();

import '@/ai/flows/generate-crop-recommendations.ts';
import '@/ai/flows/answer-farming-queries-with-voice.ts';
import '@/ai/flows/suggest-product-recommendations.ts';
import '@/ai/flows/fetch-latest-news.ts';
import '@/ai/flows/analyze-soil-from-photo.ts';
import '@/ai/flows/diagnose-crop-disease.ts';
import '@/ai/flows/analyze-crop-profitability.ts';
import '@/ai/flows/analyze-market-prices.ts';
import '@/ai/flows/generate-farming-guide.ts';
