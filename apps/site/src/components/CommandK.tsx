import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search } from 'lucide-react';
import { cn } from '@lib/utils';

interface CommandAction {
  title: string;
  description: string;
  href: string;
  shortcut?: string;
  external?: boolean;
  rel?: string;
}

const actions: CommandAction[] = [
  { title: 'Home', description: 'Return to the landing page', href: '/' },
  { title: 'About', description: 'Learn about John', href: '/about' },
  { title: 'Experience', description: 'Review the resume and highlights', href: '/experience' },
  { title: 'Case Studies', description: 'Deep dives on platform programs', href: '/case-studies' },
  { title: 'Writing', description: 'Articles and essays', href: '/writing' },
  { title: 'Deliverables', description: 'Filed patents, in-flight IP, and key projects', href: '/deliverables' },
  { title: 'Contact', description: 'Securely reach out', href: '/contact' },
  {
    title: 'GitHub',
    description: 'Explore prototypes, lab notes, and automation repos',
    href: 'https://github.com/johnmschoonover',
    external: true,
    rel: 'me noopener noreferrer'
  }
];

export function CommandK() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((action) =>
      [action.title, action.description].some((value) => value.toLowerCase().includes(q))
    );
  }, [query]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center gap-2 rounded-full pointer-coarse:min-h-11 pointer-coarse:min-w-11 border border-border bg-background text-sm text-muted-foreground shadow-sm transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary xl:w-auto xl:px-4"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" aria-hidden />
        {/* Icon-only below xl, where the header has no room for the label; the palette is also the nav below lg. */}
        <span className="sr-only xl:not-sr-only">Search site</span>
        <kbd className="hidden rounded border border-border px-1 text-xs text-muted-foreground xl:inline">⌘K</kbd>
      </button>
      {/* Portal to <body>: the header's backdrop-blur would otherwise contain this fixed overlay. */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-12 backdrop-blur-sm sm:py-24"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl rounded-2xl border border-border bg-background shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search destinations..."
                className="h-10 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border border-border px-1 text-xs text-muted-foreground">Esc</kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-sm text-muted-foreground">No matches yet—try another phrase.</li>
              )}
              {filtered.map((action) => (
                <li key={action.href}>
                  <a
                    href={action.href}
                    target={action.external ? '_blank' : undefined}
                    rel={action.external ? action.rel ?? 'noopener noreferrer' : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'block rounded-xl px-4 py-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground',
                      query && 'text-foreground'
                    )}
                  >
                    <div className="font-medium">{action.title}</div>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
