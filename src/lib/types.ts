import { z } from 'zod';

export const NewsArticleSchema = z.object({
  id: z.string().describe('A unique identifier for the news article'),
  headline: z.string().describe('The headline of the news article.'),
  summary: z.string().describe('A brief summary of the news article.'),
  fullStory: z.string().describe('The full story of the news article.'),
  date: z.string().describe('The date of publication of the news article in YYYY-MM-DD format.'),
  source: z.string().describe('The source of the news article.'),
});

export const FetchLatestNewsOutputSchema = z.object({
  articles: z.array(NewsArticleSchema),
});

export type NewsArticle = z.infer<typeof NewsArticleSchema>;
export type FetchLatestNewsOutput = z.infer<typeof FetchLatestNewsOutputSchema>;


export interface LoanScheme {
  id: string;
  title: string;
  description: string;
  eligibility: string[];
  documents: string[];
  process: string[];
  link?: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    imageHint: string;
    category: string;
}

export const AnalyzeMarketPricesInputSchema = z.object({
  cropName: z.string().describe('The name of the crop to analyze.'),
  geographicRegion: z.string().describe("The user's geographic region to provide localized analysis."),
});
export type AnalyzeMarketPricesInput = z.infer<typeof AnalyzeMarketPricesInputSchema>;

export const AnalyzeMarketPricesOutputSchema = z.object({
  cropName: z.string(),
  currentPrice: z.string().describe('A realistic, fictional current market price range for the crop in the specified region (e.g., "₹2,000 - ₹2,200 per quintal").'),
  priceTrend: z.enum(['Rising', 'Stable', 'Falling']).describe('The current price trend.'),
  sellingSuggestions: z
    .array(
      z.object({
        location: z.string().describe('A fictional but realistic name of a market, city, or vendor.'),
        rationale: z.string().describe('A brief explanation of why this location could offer better profits (e.g., higher demand, lower supply, specific events).'),
      })
    )
    .describe('A list of 2-3 suggested locations or vendors to sell the crop for higher profit.'),
});
export type AnalyzeMarketPricesOutput = z.infer<typeof AnalyzeMarketPricesOutputSchema>;


// New types for simplified recommendation flow
export const SimplifiedRecommendationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: z.any(), // Firestore serverTimestamp
  location: z.string(),
  soilType: z.string(),
  waterSource: z.string(),
  topRecommendation: z.object({
    cropName: z.string(),
    cropNameLocal: z.string(),
    imageUrl: z.string(),
    imageHint: z.string(),
    profit: z.enum(['High', 'Medium', 'Low']),
    waterNeeded: z.enum(['High', 'Medium', 'Low']),
    timeToHarvest: z.string(),
    rationale: z.string(),
  }),
  secondaryOptions: z.array(
    z.object({
      cropName: z.string(),
      cropNameLocal: z.string(),
    })
  ),
});
export type SimplifiedRecommendation = z.infer<typeof SimplifiedRecommendationSchema>;


// Farming Guide Types
export const GenerateFarmingGuideInputSchema = z.object({
    cropName: z.string().describe("The name of the crop for which to generate a guide."),
    language: z.string().describe("The language in which the guide should be written (e.g., 'en', 'hi').")
});
export type GenerateFarmingGuideInput = z.infer<typeof GenerateFarmingGuideInputSchema>;


export const FarmingGuideSchema = z.object({
    cropName: z.string(),
    introduction: z.string().describe("A brief introduction to growing this crop."),
    soilPreparation: z.array(z.string()).describe("Steps for preparing the soil."),
    sowing: z.array(z.string()).describe("Instructions for sowing seeds."),
    fertilizers: z.array(z.string()).describe("Guidance on fertilizer application."),
    irrigation: z.array(z.string()).describe("Instructions on watering the crop."),
    weedControl: z.array(z.string()).describe("Methods for controlling weeds."),
    harvesting: z.array(z.string()).describe("Guidance on when and how to harvest."),
});
export type FarmingGuide = z.infer<typeof FarmingGuideSchema>;
