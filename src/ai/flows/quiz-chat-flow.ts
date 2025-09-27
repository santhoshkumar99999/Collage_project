
'use server';
/**
 * @fileOverview A quiz assistant AI chatbot.
 *
 * - answerQuizQuestion - A function that answers a student's question about a quiz question.
 * - QuizChatInput - The input type for the answerQuizQuestion function.
 * - QuizChatOutput - The return type for the answerQuizQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizChatInputSchema = z.object({
  quizQuestionContext: z.string().describe('The full context of the quiz question, including the question itself, the multiple-choice options, and the correct answer.'),
  question: z.string().describe("The student's question about the quiz question."),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The history of the conversation so far.'),
  language: z.string().optional().describe('The language to respond in. e.g., "Hindi", "Tamil", "English"'),
  imageDataUri: z.string().optional().describe("An optional image provided by the user for context, as a data URI."),
});
export type QuizChatInput = z.infer<typeof QuizChatInputSchema>;

const QuizChatOutputSchema = z.object({
    answer: z.string().describe("The AI's answer to the student's question."),
});
export type QuizChatOutput = z.infer<typeof QuizChatOutputSchema>;


export async function answerQuizQuestion(input: QuizChatInput): Promise<QuizChatOutput> {
  return quizChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quizChatPrompt',
  input: {schema: QuizChatInputSchema},
  output: {schema: QuizChatOutputSchema},
  prompt: `You are a friendly and encouraging quiz assistant. Your goal is to help a student understand a quiz question.

Your response should be based on the provided "QUIZ QUESTION CONTEXT" and any provided image.

If the student asks for the answer directly, you should provide it along with a brief explanation.
If the student provides an incorrect answer, explain why it is incorrect and guide them to the correct answer.
If an image is provided, incorporate it into your explanation.
Be encouraging and supportive in your tone.

{{#if language}}
You MUST answer in the following language: {{{language}}}.
{{else}}
You MUST answer in English.
{{/if}}

Here is the conversation history so far:
{{#each conversationHistory}}
{{role}}: {{content}}
{{/each}}

QUIZ QUESTION CONTEXT:
---
{{{quizQuestionContext}}}
---

Based on the quiz question context, conversation history, and the image below (if any), answer the student's question.

{{#if imageDataUri}}
IMAGE:
{{media url=imageDataUri}}
{{/if}}

STUDENT'S QUESTION:
"{{{question}}}"
`,
});

const quizChatFlow = ai.defineFlow(
  {
    name: 'quizChatFlow',
    inputSchema: QuizChatInputSchema,
    outputSchema: QuizChatOutputSchema,
  },
  async (input) => {
    try {
        const {output} = await prompt(input);
        if (!output || !output.answer) {
            throw new Error("AI failed to generate an answer.");
        }
        return output;
    } catch (e: any) {
        console.error("Error in quiz chat flow: ", e);
        if (e.message && e.message.includes('503')) {
            return { answer: "I'm sorry, but the AI service is temporarily unavailable. Please try again in a few moments." };
        }
        return { answer: "I'm sorry, I encountered an unexpected error. Please try asking your question again." };
    }
  }
);
