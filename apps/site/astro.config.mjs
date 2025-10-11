import { defineConfig } from 'astro/config';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  site: 'https://theschoonover.net',
  integrations: [
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypeSlug], [rehypeAutolinkHeadings, { behavior: 'append' }]]
    }),
    tailwind({
      applyBaseStyles: false
    }),
    react()
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  },
  vite: {
    resolve: {
      alias: {
        '@components': resolve(dirname(fileURLToPath(import.meta.url)), 'src/components'),
        '@layouts': resolve(dirname(fileURLToPath(import.meta.url)), 'src/layouts'),
        '@lib': resolve(dirname(fileURLToPath(import.meta.url)), 'src/lib'),
        '@styles': resolve(dirname(fileURLToPath(import.meta.url)), 'src/styles')
      }
    }
  }
});
