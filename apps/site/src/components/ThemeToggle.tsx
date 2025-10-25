import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@lib/utils';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theschoonover-theme';

const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Ignore storage access errors (e.g., Safari private browsing).
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyThemeClass = (theme: Theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme());

  useEffect(() => {
    applyThemeClass(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage access errors so the toggle still works.
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light');
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }

    // Safari < 14 fallback.
    mediaQuery.addListener(listener);
    return () => mediaQuery.removeListener(listener);
  }, []);

  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
      )}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={`Activate ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <Sun className={cn('h-4 w-4', theme === 'dark' && 'hidden')} aria-hidden />
      <Moon className={cn('h-4 w-4', theme === 'light' && 'hidden')} aria-hidden />
    </button>
  );
}
