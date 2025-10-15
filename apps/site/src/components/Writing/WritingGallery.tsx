import { useMemo, useState } from 'react';
import { cn } from '@lib/utils';

type PostSummary = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  displayDate: string;
  tags: string[];
};

type Props = {
  posts: PostSummary[];
};

type IndexedPost = {
  post: PostSummary;
  normalizedTitle: string;
  normalizedSummary: string;
  normalizedTags: string[];
  titleWords: string[];
  summaryWords: string[];
  tagWords: string[];
};

function normalizeForSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[\-_/]+/g, ' ')
    .toLowerCase();
}

function scorePost(indexed: IndexedPost, tokens: string[]) {
  if (tokens.length === 0) {
    return 1;
  }

  let score = 0;

  for (const token of tokens) {
    let tokenScore = 0;

    if (indexed.titleWords.some((word) => word === token)) {
      tokenScore += 6;
    } else if (indexed.titleWords.some((word) => word.startsWith(token))) {
      tokenScore += 4;
    } else if (indexed.normalizedTitle.includes(token)) {
      tokenScore += 2;
    }

    if (indexed.normalizedTags.some((tag) => tag === token)) {
      tokenScore += 5;
    } else if (indexed.normalizedTags.some((tag) => tag.startsWith(token))) {
      tokenScore += 3;
    } else if (indexed.tagWords.some((word) => word.includes(token))) {
      tokenScore += 1;
    }

    if (indexed.summaryWords.some((word) => word === token)) {
      tokenScore += 2;
    } else if (indexed.normalizedSummary.includes(token)) {
      tokenScore += 1;
    }

    if (tokenScore === 0) {
      return 0;
    }

    score += tokenScore;
  }

  return score;
}

function formatTag(tag: string) {
  return tag
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function WritingGallery({ posts }: Props) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const indexedPosts = useMemo<IndexedPost[]>(() => {
    return posts.map((post) => {
      const normalizedTitle = normalizeForSearch(post.title);
      const normalizedSummary = normalizeForSearch(post.summary);
      const normalizedTags = post.tags.map((tag) => normalizeForSearch(tag));

      const titleWords = normalizedTitle.split(/\s+/).filter(Boolean);
      const summaryWords = normalizedSummary.split(/\s+/).filter(Boolean);
      const tagWords = normalizedTags.flatMap((tag) => tag.split(/\s+/)).filter(Boolean);

      return {
        post,
        normalizedTitle,
        normalizedSummary,
        normalizedTags,
        titleWords,
        summaryWords,
        tagWords,
      };
    });
  }, [posts]);

  const allTags = useMemo(() => {
    const map = new Map<string, number>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        map.set(tag, (map.get(tag) ?? 0) + 1);
      });
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [posts]);

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeForSearch(query);
    const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

    const matches = indexedPosts
      .filter((indexed) => {
        if (activeTag && !indexed.post.tags.includes(activeTag)) {
          return false;
        }
        return true;
      })
      .map((indexed) => ({
        post: indexed.post,
        score: scorePost(indexed, tokens),
      }))
      .filter(({ score }) => score > 0);

    matches.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    });

    return matches.map(({ post }) => post);
  }, [indexedPosts, activeTag, query]);

  const featured = filtered[0];
  const remainder = filtered.slice(1);

  return (
    <section className="space-y-10">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2">
          <label htmlFor="writing-search" className="text-sm font-medium text-muted-foreground">
            Search posts
          </label>
          <input
            id="writing-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by title, summary, or tag"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
        </div>
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 md:justify-end">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={cn(
                'rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-wide transition hover:bg-muted',
                activeTag === null ? 'bg-foreground text-background shadow' : 'text-muted-foreground'
              )}
            >
              All topics
            </button>
            {allTags.map(([tag, count]) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag((current) => (current === tag ? null : tag))}
                className={cn(
                  'rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-wide transition hover:bg-muted',
                  activeTag === tag ? 'bg-foreground text-background shadow' : 'text-muted-foreground'
                )}
                aria-pressed={activeTag === tag}
              >
                {formatTag(tag)} <span className="text-[10px] text-muted-foreground">({count})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-10 text-center text-sm text-muted-foreground">
          No posts matched your filters. Clear the search or pick another tag to explore more writing.
        </p>
      ) : (
        <div className="space-y-8">
          {featured && (
            <a
              href={`/writing/${featured.slug}/`}
              className="block overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-background to-muted/40 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Featured</p>
              <h2 className="mt-4 font-display text-2xl font-semibold md:text-3xl">{featured.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">{featured.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border px-3 py-1">{featured.displayDate}</span>
                {featured.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-3 py-1">
                    {formatTag(tag)}
                  </span>
                ))}
              </div>
            </a>
          )}

          {remainder.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {remainder.map((post) => (
                <a
                  key={post.slug}
                  href={`/writing/${post.slug}/`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-background/80 p-6 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{post.displayDate}</p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-foreground group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{post.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-border px-2 py-1">
                        {formatTag(tag)}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
