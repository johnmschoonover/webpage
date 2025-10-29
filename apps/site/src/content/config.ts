import { defineCollection, z } from 'astro:content';

const caseStudies = defineCollection({
  type: 'content',
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
  type: 'content',
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
