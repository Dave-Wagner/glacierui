import { Theme } from './types';
import { nord } from './nord';
import { accessible } from './accessible';

export type ColorMode = 'light' | 'dark';

export type ThemePreference = ThemeName | 'system';
export type ThemeName = 'nord' | 'accessible';

// Include system theme in valid themes check
export const isValidTheme = (theme: string): theme is ThemePreference => {
  return theme === 'system' || Object.keys(themes).includes(theme);
};

export const themes: Record<ThemeName, Theme> = {
  nord,
  accessible
};

export const getTheme = (name: ThemeName = 'nord'): Theme => {
  return themes[name] || themes.nord;
};

export * from './types';