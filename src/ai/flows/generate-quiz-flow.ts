
'use server';
/**
 * @fileOverview A flow to generate a quiz on a given subject.
 *
 * - generateQuiz - A function that creates a new quiz from a subject.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const GenerateQuizInputSchema = z.object({
  subject: z.string().describe('The subject for which to generate the quiz. e.g., "Mathematics", "Biology"'),
  numberOfQuestions: z.number().default(10).describe('The number of questions to generate for the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;


const QuizQuestionSchema = z.object({
    id: z.string().describe("A unique ID for the question, e.g., 'q1', 'q2'."),
    question: z.string().describe('The quiz question text.'),
    options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
    correctAnswer: z.string().describe('The correct answer from the options array.'),
    hint: z.string().optional().describe('A helpful hint for the student.'),
});

const QuizSchema = z.object({
  id: z.string().describe("A unique ID for the quiz, e.g., 'tournament-quiz-math'."),
  lessonId: z.string().describe("A lessonId this quiz is associated with, e.g., 'tournament-math'."),
  title: z.string().describe("The title of the quiz, e.g., 'Mathematics Tournament'."),
  questions: z.array(QuizQuestionSchema).describe('An array of quiz questions.'),
});

const GenerateQuizOutputSchema = z.object({
    quiz: QuizSchema,
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert educator and quiz creator. Your task is to generate a challenging and educational quiz based on a given subject.

Subject: {{{subject}}}
Number of Questions: {{{numberOfQuestions}}}

Instructions:
1.  Create {{{numberOfQuestions}}} multiple-choice questions about the given subject.
2.  The questions should be appropriate for a high school level.
3.  Each question must have exactly 4 options.
4.  One of the options must be the correct answer.
5.  Provide a short, helpful hint for each question.
6.  The response MUST be a JSON object that strictly follows the output schema. Ensure all fields are present for each question (id, question, options, correctAnswer, hint).
7.  The quiz ID should be 'tournament-quiz-{{{subject}}}'.
8.  The lesson ID should be 'tournament-{{{subject}}}'.
9.  The quiz title should be '{{{subject}}} Tournament'.
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
