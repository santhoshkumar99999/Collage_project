
'use server';
/**
 * @fileOverview A text translation AI flow that handles batch requests.
 *
 * - translateBatch - A function that translates a list of texts to a target language.
 * - TranslateBatchInput - The input type for the translateBatch function.
 * - TranslateBatchOutput - The return type for the translateBatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateBatchInputSchema = z.object({
  texts: z.array(z.string()).describe('The list of texts to be translated.'),
  targetLanguage: z.string().describe('The language to translate the texts into (e.g., "Hindi", "Tamil", "English").'),
});
export type TranslateBatchInput = z.infer<typeof TranslateBatchInputSchema>;

const TranslateBatchOutputSchema = z.object({
    translations: z.array(z.string()).describe('The list of translated texts, in the same order as the input.'),
});
export type TranslateBatchOutput = z.infer<typeof TranslateBatchOutputSchema>;

export async function translateBatch(input: TranslateBatchInput): Promise<TranslateBatchOutput> {
  return translateBatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateBatchPrompt',
  input: {schema: TranslateBatchInputSchema},
  output: {schema: TranslateBatchOutputSchema},
  prompt: `Translate each of the following texts into {{{targetLanguage}}}.
Return the translations as a JSON array of strings in the same order as the input.

TEXTS:
---
{{#each texts}}
- "{{{this}}}"
{{/each}}
---

Return only the JSON object with the "translations" key, without any additional comments or formatting.`,
});

const translateBatchFlow = ai.defineFlow(
  {
    name: 'translateBatchFlow',
    inputSchema: TranslateBatchInputSchema,
    outputSchema: TranslateBatchOutputSchema,
  },
  async (input) => {
    // If the target language is English, no need to translate.
    if (input.targetLanguage.toLowerCase() === 'english') {
      return { translations: input.texts };
    }
    if (input.texts.length === 0) {
        return { translations: [] };
    }

    const {output} = await prompt(input);
    
    // Basic validation in case the model doesn't return the right shape
    if (output && Array.isArray(output.translations) && output.translations.length === input.texts.length) {
       return output;
    }

    // Fallback for safety - return original texts if output is malformed
    return { translations: input.texts };
  }
);
