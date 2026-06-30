import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { getTheme, Theme, toggleTheme } from '../data/theme';

/** Sun/moon button that flips between light and dark themes. */
export default function ThemeToggle({
  className = '',
  onChange,
}: {
  className?: string;
  onChange?: (theme: Theme) => void;
}) {
  const [theme, setThemeState] = useState<Theme>(getTheme());

  const onClick = () => {
    const next = toggleTheme();
    setThemeState(next);
    onChange?.(next);
  };

  return (
    <button
      onClick={onClick}
      title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
      aria-label="Переключить тему"
      className={`rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 ${className}`}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
