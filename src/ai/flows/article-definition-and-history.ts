'use server';

/**
 * @fileOverview Retrieves the definition, history, and past cases of a legal article.
 *
 * - getArticleDefinitionAndHistory - A function that retrieves the definition and history of a legal article.
 * - ArticleDefinitionAndHistoryInput - The input type for the getArticleDefinitionAndHistory function.
 * - ArticleDefinitionAndHistoryOutput - The return type for the getArticleDefinitionAndHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArticleDefinitionAndHistoryInputSchema = z.object({
  articleName: z.string().describe('The name of the legal article.'),
});
export type ArticleDefinitionAndHistoryInput = z.infer<typeof ArticleDefinitionAndHistoryInputSchema>;

const ArticleDefinitionAndHistoryOutputSchema = z.object({
  definition: z.string().describe('A brief definition of the legal article.'),
  history: z.string().describe('A brief history of the legal article.'),
  pastCases: z.array(z.string()).describe('A few past cases where the article was used.'),
});
export type ArticleDefinitionAndHistoryOutput = z.infer<typeof ArticleDefinitionAndHistoryOutputSchema>;

export async function getArticleDefinitionAndHistory(
  input: ArticleDefinitionAndHistoryInput
): Promise<ArticleDefinitionAndHistoryOutput> {
  return articleDefinitionAndHistoryFlow(input);
}

const articleDefinitionAndHistoryPrompt = ai.definePrompt({
  name: 'articleDefinitionAndHistoryPrompt',
  input: {schema: ArticleDefinitionAndHistoryInputSchema},
  output: {schema: ArticleDefinitionAndHistoryOutputSchema},
  prompt: `You are an expert legal assistant. A user has requested information about the legal article "{{articleName}}". Provide a brief definition, a brief history of the article, and a few examples of past cases where the article was cited.`,
});

const articleDefinitionAndHistoryFlow = ai.defineFlow(
  {
    name: 'articleDefinitionAndHistoryFlow',
    inputSchema: ArticleDefinitionAndHistoryInputSchema,
    outputSchema: ArticleDefinitionAndHistoryOutputSchema,
  },
  async input => {
    const {output} = await articleDefinitionAndHistoryPrompt(input);
    return output!;
  }
);
