import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    timeframe: z.string(),
    tags: z.array(z.string()),
    impact: z.array(z.string()).min(1),
    heroStat: z.string().optional(),
    order: z.number().default(0),
    internal: z.boolean().optional()
  })
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    canonical: z.string().optional(),
    updated: z.string().optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false)
  })
});

export const collections = {
  'case-studies': caseStudies,
  posts
};
