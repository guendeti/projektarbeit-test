import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const lernen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lernen' }),
  schema: z.object({
    title: z.string(), slug: z.string(), lead: z.string(), diagram: z.string(),
    takeaway: z.string(), sources: z.array(z.string()),
    question: z.string(), answers: z.array(z.string()).length(3), correct: z.number().int().min(0).max(2), explanation: z.string(),
  }),
});
export const collections = { lernen };
