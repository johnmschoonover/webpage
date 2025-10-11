import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@lib/utils';

interface CommandAction {
  title: string;
  description: string;
  href: string;
  shortcut?: string;
}

const actions: CommandAction[] = [
  { title: 'Home', description: 'Return to the landing page', href: '/' },
  { title: 'About', description: 'Learn about John', href: '/about' },
  { title: 'Experience', description: 'View the CV and highlights', href: '/experience' },
  { title: 'Case Studies', description: 'Deep dives on platform programs', href: '/case-studies' },
  { title: 'Writing', description: 'Articles and essays', href: '/writing' },
  { title: 'Talks & Media', description: 'Conference appearances and recordings', href: '/talks' },
  { title: 'Patents & IP', description: 'Filed and in-flight intellectual property', href: '/patents' },
  { title: 'Contact', description: 'Securely reach out', href: '/contact' }
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
        className="hidden items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:inline-flex"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" aria-hidden />
        Search site
        <kbd className="rounded border border-border px-1 text-xs text-muted-foreground">⌘K</kbd>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 py-24 backdrop-blur-sm"
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
        </div>
      )}
    </>
  );
}
