import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET(context) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return rss({
    title: 'John Schoonover',
    description: 'Building reliable, data-driven security platforms that scale.',
    site: context.site,
    items: posts
      .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: new Date(post.data.date),
        description: post.data.summary,
        link: `/writing/${post.slug}/`,
      })),
    customData: `<language>en-us</language>`,
  });
}
