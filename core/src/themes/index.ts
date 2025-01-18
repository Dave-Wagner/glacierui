/**
 * @module themes
 * @description Theme registry and exports
 */

import { Theme } from './types';
import { nord } from './nord';
import { accessible } from './accessible';

export type ThemeName = 'nord' | 'accessible';

export const themes: Record<ThemeName, Theme> = {
  nord,
  accessible
};

export const getTheme = (name: ThemeName = 'nord'): Theme => {
  return themes[name] || themes.nord;
};

export * from './types';

/**
 * @function isValidTheme
 * @description Type guard for theme validation
 */
export function isValidTheme(theme: unknown): theme is Theme {
  if (!theme || typeof theme !== 'object') return false;
  
  const t = theme as Theme;
  return (
    typeof t.name === 'string' &&
    t.colors !== undefined &&
    typeof t.colors === 'object' &&
    typeof t.colors.primary === 'string' &&
    typeof t.colors.base100 === 'string'
  );
}