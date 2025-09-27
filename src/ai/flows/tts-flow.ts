
'use server';
/**
 * @fileOverview A Text-to-Speech (TTS) flow.
 *
 * - textToSpeech - A function that converts text into speech audio.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as wav from 'wav';

const TextToSpeechInputSchema = z.object({
  prompt: z.string().describe('The text to convert to speech. For multi-speaker, format as "Speaker1: ... Speaker2: ..."'),
  speakers: z.number().default(1).describe('The number of distinct speakers in the prompt.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  media: z.string().describe('The base64 encoded WAV audio data URI.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return ttsFlow(input);
}

const ttsFlow = ai.defineFlow(
    {
      name: 'ttsFlow',
      inputSchema: TextToSpeechInputSchema,
      outputSchema: TextToSpeechOutputSchema,
    },
    async (input) => {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error(
          'GEMINI_API_KEY is not set. Please set it in your .env file.'
        );
      }
      
      const isMultiSpeaker = input.speakers > 1;

      const speechConfig = isMultiSpeaker ? {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: 'User',
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Algenib' } },
              },
              {
                speaker: 'AI',
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Achernar' } },
              },
            ],
          },
        } : {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
        };

        try {
            const { media } = await ai.generate({
                model: 'googleai/gemini-2.5-flash-preview-tts',
                config: {
                responseModalities: ['AUDIO'],
                speechConfig,
                },
                prompt: input.prompt,
            });

            if (!media) {
                throw new Error('no media returned');
            }
            const audioBuffer = Buffer.from(
                media.url.substring(media.url.indexOf(',') + 1),
                'base64'
            );
            return {
                media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
            };
        } catch(e: any) {
            if (e.message && e.message.includes('429 Too Many Requests')) {
                throw new Error('RATE_LIMIT_EXCEEDED');
            }
            if (e.message && e.message.includes('503 Service Unavailable')) {
                throw new Error('SERVICE_UNAVAILABLE');
            }
            // Re-throw original error if it's not a handled one
            throw e;
        }
    }
  );

  async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      let bufs = [] as any[];
      writer.on('error', reject);
      writer.on('data', function (d) {
        bufs.push(d);
      });
      writer.on('end', function () {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
  }

