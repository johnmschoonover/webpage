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
    order: z.number().default(0)
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
    updated: z.string().optional()
  })
});

const talks = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    event: z.string(),
    year: z.number(),
    location: z.string(),
    link: z.string().url().optional(),
    resources: z.array(z.object({
      label: z.string(),
      url: z.string().url()
    })).default([])
  })
});

export const collections = {
  'case-studies': caseStudies,
  posts,
  talks
};
