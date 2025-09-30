
'use server';
/**
 * @fileOverview Fetches the latest agricultural news.
 *
 * - fetchLatestNews - A function that returns the latest news articles.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { FetchLatestNewsOutput } from '@/lib/types';
import { FetchLatestNewsOutputSchema } from '@/lib/types';


const FetchLatestNewsInputSchema = z.object({
    language: z.string().describe('The language for the news articles (e.g., en, hi, bn, te, mr).'),
    currentDate: z.string().describe('The current date and time to make the news timely.'),
});

export async function fetchLatestNews(input: z.infer<typeof FetchLatestNewsInputSchema>): Promise<FetchLatestNewsOutput> {
  return fetchLatestNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fetchLatestNewsPrompt',
  input: {
    schema: FetchLatestNewsInputSchema,
  },
  output: {schema: FetchLatestNewsOutputSchema},
  prompt: `You are an expert agricultural news correspondent. Generate a list of 3 recent and relevant fictional news articles for farmers in India. The news should be in {{language}}.
  
  Provide realistic headlines, summaries, and full stories. Make sure the news is very recent, as of today's date and time: {{currentDate}}. Use this date for the articles. Ensure the 'id' for each article is unique (e.g., 'news_1', 'news_2', 'news_3'). Your response should be completely unique for each request based on the exact time provided in 'currentDate'. Do not repeat content.`,
});

const fetchLatestNewsFlow = ai.defineFlow(
  {
    name: 'fetchLatestNewsFlow',
    inputSchema: FetchLatestNewsInputSchema,
    outputSchema: FetchLatestNewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output || { articles: [] };
  }
);
