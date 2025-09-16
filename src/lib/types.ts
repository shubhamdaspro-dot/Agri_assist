import { z } from 'zod';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  imageHint: string;
  category: 'Seeds' | 'Fertilizers' | 'Pesticides' | 'Tools';
}

export interface CartItem extends Product {
  quantity: number;
}

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
}
