'use server';

/**
 * @fileOverview Retrieves information about legal topics, cases, and concepts.
 *
 * - getLegalInformation - A function that retrieves information about a legal topic.
 * - LegalQuestionInput - The input type for the getLegalInformation function.
 * - LegalQuestionOutput - The return type for the getLegalInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LegalQuestionInputSchema = z.object({
  question: z.string().describe("The user's question about a legal topic, case, or concept."),
});
export type LegalQuestionInput = z.infer<typeof LegalQuestionInputSchema>;

const LegalQuestionOutputSchema = z.object({
  topic: z.string().describe('The core legal topic identified in the user\'s question.'),
  summary: z.string().describe('A concise summary answering the user\'s question.'),
  relatedCases: z.array(z.string()).describe('A few past cases or examples related to the topic.'),
});
export type LegalQuestionOutput = z.infer<typeof LegalQuestionOutputSchema>;

export async function getLegalInformation(
  input: LegalQuestionInput
): Promise<LegalQuestionOutput> {
  return legalQuestionFlow(input);
}

const legalQuestionPrompt = ai.definePrompt({
  name: 'legalQuestionPrompt',
  input: {schema: LegalQuestionInputSchema},
  output: {schema: LegalQuestionOutputSchema},
  prompt: `You are lawIntel, an expert legal AI assistant with deep search capabilities. You are knowledgeable about a wide range of legal topics, including specific laws, landmark cases, legal history, and even unsolved mysteries.

A user has asked the following question: "{{question}}".

Perform a deep search on this topic. Based on the user's question, identify the core legal topic, provide a clear, comprehensive summary that answers their question, and list relevant examples, precedents, or past cases. Be thorough and detailed in your response.`,
});

const legalQuestionFlow = ai.defineFlow(
  {
    name: 'legalQuestionFlow',
    inputSchema: LegalQuestionInputSchema,
    outputSchema: LegalQuestionOutputSchema,
  },
  async input => {
    const {output} = await legalQuestionPrompt(input);
    return output!;
  }
);
