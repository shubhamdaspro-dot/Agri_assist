import { config } from 'dotenv';
config();

import '@/ai/flows/generate-crop-recommendations.ts';
import '@/ai/flows/answer-farming-queries-with-voice.ts';
import '@/ai/flows/suggest-product-recommendations.ts';