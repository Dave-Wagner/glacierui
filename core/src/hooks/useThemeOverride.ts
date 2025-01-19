import { useMemo } from 'react';
import { useTheme } from './useTheme';
import { Theme } from '../themes/types';
import { ThemeOverride, mergeTheme } from '../utils/override';

/**
 * Hook for applying theme overrides at the component level
 * @param override - Theme override object
 * @returns Merged theme
 */
export function useThemeOverride(override: ThemeOverride): Theme {
    const { theme } = useTheme();

    return useMemo(() =>
        mergeTheme(theme, override),
        [theme, override]
    );
}