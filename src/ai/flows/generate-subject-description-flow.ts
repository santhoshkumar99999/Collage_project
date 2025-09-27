
'use ' + 'server';
/**
 * @fileOverview A flow to generate a short description for a given subject.
 *
 * - generateSubjectDescription - A function that creates a subject description.
 * - GenerateSubjectDescriptionInput - The input type for the function.
 * - GenerateSubjectDescriptionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSubjectDescriptionInputSchema = z.object({
  subjectName: z.string().describe('The name of the subject for which to generate a description.'),
});
export type GenerateSubjectDescriptionInput = z.infer<typeof GenerateSubjectDescriptionInputSchema>;

const GenerateSubjectDescriptionOutputSchema = z.object({
    description: z.string().describe('A short, engaging, one-sentence description for the subject, suitable for a student curriculum. It should be enticing and make the student want to learn.'),
});
export type GenerateSubjectDescriptionOutput = z.infer<typeof GenerateSubjectDescriptionOutputSchema>;

export async function generateSubjectDescription(input: GenerateSubjectDescriptionInput): Promise<GenerateSubjectDescriptionOutput> {
  return generateSubjectDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSubjectDescriptionPrompt',
  input: {schema: GenerateSubjectDescriptionInputSchema},
  output: {schema: GenerateSubjectDescriptionOutputSchema},
  prompt: `You are an expert curriculum designer. Generate a single, concise, and engaging one-sentence description for the following subject: {{{subjectName}}}.

The description should be exciting and make a student eager to learn about the topic. Do not use more than one sentence.
`,
});

const generateSubjectDescriptionFlow = ai.defineFlow(
  {
    name: 'generateSubjectDescriptionFlow',
    inputSchema: GenerateSubjectDescriptionInputSchema,
    outputSchema: GenerateSubjectDescriptionOutputSchema,
  },
  async (input) => {
    try {
        const {output} = await prompt(input);
        if (!output || !output.description) {
            throw new Error("AI failed to generate a description.");
        }
        return output;
    } catch (e: any) {
        console.error(`Error generating description for subject "${input.subjectName}":`, e);
        if (e.message && e.message.includes('503')) {
            throw new Error('The AI service is temporarily unavailable. Please write a description manually.');
        }
        throw new Error('Could not generate a description. Please write one manually.');
    }
  }
);
