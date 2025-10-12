(() => {
  const STORAGE_KEY = 'theschoonover-theme';
  try {
    const root = document.documentElement;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored === 'light' || stored === 'dark' ? stored : prefersDark ? 'dark' : 'light';
    root.classList.toggle('dark', theme === 'dark');
    root.dataset.theme = theme;
  } catch (error) {
    // Swallow errors: theme detection should not block rendering.
  }
})();
