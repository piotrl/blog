import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  // Posts live in content/blog/<slug>/index.md, so entry ids are the old Gatsby slugs.
  loader: glob({ base: './content/blog', pattern: '**/index.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      // Set only for substantive rewrites, not copy edits.
      updated: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      author: z.array(z.string()).optional(),
      cover: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
