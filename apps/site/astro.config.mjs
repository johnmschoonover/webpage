import { defineConfig } from 'astro/config';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, '..', '..');

export default defineConfig({
  site: 'https://theschoonover.net',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    mdx({
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [[rehypeSlug], [rehypeAutolinkHeadings, { behavior: 'append' }], [rehypeKatex, { output: 'html' }]]
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
        '@components': resolve(currentDir, 'src/components'),
        '@layouts': resolve(currentDir, 'src/layouts'),
        '@lib': resolve(currentDir, 'src/lib'),
        '@styles': resolve(currentDir, 'src/styles'),
        '@content': resolve(repoRoot, 'content'),
        '@data': resolve(repoRoot, 'data')
      }
    },
    server: {
      fs: {
        allow: [repoRoot]
      }
    }
  }
});
