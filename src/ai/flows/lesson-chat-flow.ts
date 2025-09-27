
'use server';
/**
 * @fileOverview A lesson assistant AI chatbot.
 *
 * - answerQuestion - A function that answers a student's question based on lesson content.
 * - LessonChatInput - The input type for the answerQuestion function.
 * - LessonChatOutput - The return type for the answerQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LessonChatInputSchema = z.object({
  lessonContent: z.string().describe('The full text content of the lesson the student is currently viewing.'),
  question: z.string().describe("The student's question about the lesson."),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The history of the conversation so far.'),
  language: z.string().optional().describe('The language to respond in. e.g., "Hindi", "Tamil", "English"'),
  imageDataUri: z.string().optional().describe("An optional image provided by the user for context, as a data URI."),
});
export type LessonChatInput = z.infer<typeof LessonChatInputSchema>;

const LessonChatOutputSchema = z.object({
    answer: z.string().describe("The AI's answer to the student's question."),
});
export type LessonChatOutput = z.infer<typeof LessonChatOutputSchema>;


export async function answerQuestion(input: LessonChatInput): Promise<LessonChatOutput> {
  return lessonChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'lessonChatPrompt',
  input: {schema: LessonChatInputSchema},
  output: {schema: LessonChatOutputSchema},
  prompt: `You are a friendly and encouraging educational assistant for the Vidyagram learning platform. Your goal is to help students understand the provided lesson material.

You must answer the student's question based ONLY on the context provided in the "LESSON CONTENT" and any provided image.
Do not use any external knowledge or information outside of the lesson content.
If the question is not related to the lesson content, politely decline to answer and guide the student back to the topic.
If an image is provided, use it as the primary context for your explanation.
Keep your answers concise and easy to understand for a student.
{{#if language}}
You MUST answer in the following language: {{{language}}}.
{{else}}
You MUST answer in English.
{{/if}}


Here is the conversation history so far:
{{#each conversationHistory}}
{{role}}: {{content}}
{{/each}}

LESSON CONTENT:
---
{{{lessonContent}}}
---

Based on the lesson content, conversation history, and the image below (if any), answer the student's question.

{{#if imageDataUri}}
IMAGE:
{{media url=imageDataUri}}
{{/if}}

STUDENT'S QUESTION:
"{{{question}}}"
`,
});

const lessonChatFlow = ai.defineFlow(
  {
    name: 'lessonChatFlow',
    inputSchema: LessonChatInputSchema,
    outputSchema: LessonChatOutputSchema,
  },
  async (input) => {
    try {
        const {output} = await prompt(input);
        if (!output) {
            throw new Error("AI failed to generate an answer.");
        }
        return output;
    } catch (e: any) {
        console.error("Error in lesson chat flow: ", e);
        if (e.message && e.message.includes('503')) {
            return { answer: "I'm sorry, but the AI service is temporarily unavailable. Please try again in a few moments." };
        }
        return { answer: "I'm sorry, I encountered an unexpected error. Please try asking your question again." };
    }
  }
);
