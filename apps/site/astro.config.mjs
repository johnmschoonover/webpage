import { defineConfig } from 'astro/config';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, '..', '..');

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
