// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	// React runs the interactive case-study mockups (islands); MDX lets case
	// studies place those components inside their Markdown.
	integrations: [mdx(), react()],
	// Case-study text is copied verbatim from the original pages, curly quotes
	// included, so don't let Markdown re-curl the straight ones.
	markdown: { smartypants: false },
	// The site's CSS is a few KB, so inline it rather than block first paint on
	// separate stylesheet requests.
	build: { inlineStylesheets: 'always' },
});
