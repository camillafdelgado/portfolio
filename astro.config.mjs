// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	// React runs the interactive case-study mockups (islands); MDX lets case
	// studies place those components inside their Markdown.
	integrations: [mdx(), react()],
});
