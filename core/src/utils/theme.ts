import { Platform } from 'react-native';

export type SystemTheme = 'light' | 'dark';

/**
 * Gets the current system color scheme preference
 * @returns The current system theme preference
 */
export const getSystemTheme = (): SystemTheme => {
    if (typeof window === 'undefined') return 'light';

    // Check for react-native
    if (Platform.OS !== 'web') {
        try {
            const { Appearance } = require('react-native');
            return Appearance.getColorScheme() || 'light';
        } catch {
            return 'light';
        }
    }

    // Web implementation
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
};