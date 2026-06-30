/**
 * Light/dark theme handling. The actual class is applied to <html> as early as
 * possible by an inline script in index.html (to avoid a flash); this module is
 * the runtime API for reading and toggling it.
 */

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

export function getTheme(): Theme {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    return 'dark';
  }
  return 'light';
}

export function setTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore storage errors */
  }
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}
