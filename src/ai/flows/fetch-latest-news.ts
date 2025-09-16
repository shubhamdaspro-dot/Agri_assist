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

export async function fetchLatestNews(language: string): Promise<FetchLatestNewsOutput> {
  return fetchLatestNewsFlow({ language });
}

const prompt = ai.definePrompt({
  name: 'fetchLatestNewsPrompt',
  input: {
    schema: z.object({
        language: z.string().describe('The language for the news articles (e.g., en, hi, bn, te, mr).'),
    }),
  },
  output: {schema: FetchLatestNewsOutputSchema},
  prompt: `You are an expert agricultural news correspondent. Generate a list of 3 recent and relevant fictional news articles for farmers in India. The news should be in {{language}}.
  
  Provide realistic headlines, summaries, and full stories. Include a plausible date and source for each article. Ensure the 'id' for each article is unique (e.g., 'news_1', 'news_2', 'news_3').`,
});

const fetchLatestNewsFlow = ai.defineFlow(
  {
    name: 'fetchLatestNewsFlow',
    inputSchema: z.object({
        language: z.string(),
    }),
    outputSchema: FetchLatestNewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
