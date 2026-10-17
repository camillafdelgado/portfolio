import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Case studies: one Markdown (or MDX, for interactive pieces) file per project
// in src/content/work/. The file name is the page URL (washington-211.mdx → /washington-211).
const work = defineCollection({
	loader: glob({ pattern: '*.{md,mdx}', base: './src/content/work' }),
	schema: z.object({
		title: z.string(),
		status: z.string(),
		// 'concept' is the original's narrower page (768px column, Back button,
		// kicker and intro above a hero image on a colored card).
		template: z.enum(['default', 'concept']).default('default'),
		kicker: z.array(z.string()).optional(), // e.g. ['Sweet & Sour', 'Concept']
		intro: z.string().optional(),
		hero: z.object({
			video: z.string().optional(),
			poster: z.string().optional(),
			image: z.string().optional(),
			background: z.string().optional(), // card color behind a hero image
			alt: z.string(),
		}),
		// The details row under the hero, e.g. { label: 'Timeline', items: ['Jan – Apr 2026'] }
		details: z.array(z.object({ label: z.string(), items: z.array(z.string()) })),
	}),
});

export const collections = { work };
