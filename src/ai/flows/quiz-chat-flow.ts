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
  quizQuestionContext: z.string().describe('The full context of the quiz question, including the question itself and the multiple-choice options.'),
  question: z.string().describe("The student's question about the quiz question."),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The history of the conversation so far.'),
  language: z.string().optional().describe('The language to respond in. e.g., "Hindi", "Tamil", "English"'),
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
  prompt: `You are a friendly and encouraging quiz assistant. Your goal is to help a student understand a quiz question without giving them the direct answer.

You MUST NOT reveal the correct answer. Instead, provide hints, explanations, or ask leading questions to guide the student towards the correct answer on their own.

Your response should be based on the provided "QUIZ QUESTION CONTEXT".

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

Based on the quiz question context and conversation history, answer the student's question below. Remember, do not give away the answer!

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
    const {output} = await prompt(input);
    return output!;
  }
);
