import React, { createContext, useContext, type ReactNode } from 'react';
import { Theme } from '../themes/types';
import { ThemeOverride, mergeTheme } from '../utils/override';
import { useTheme } from '../hooks/useTheme';

interface ThemeOverrideContextValue {
    theme: Theme;
}

const ThemeOverrideContext = createContext<ThemeOverrideContextValue | null>(null);

interface ThemeOverrideProps {
    children: ReactNode;
    theme: ThemeOverride;
}

/**
 * Component for applying theme overrides to a subtree
 */
export function ThemeOverride({ children, theme: override }: ThemeOverrideProps) {
    const { theme: baseTheme } = useTheme();
    const mergedTheme = mergeTheme(baseTheme, override);

    return (
        <ThemeOverrideContext.Provider value={{ theme: mergedTheme }}>
            {children}
        </ThemeOverrideContext.Provider>
    );
}

/**
 * Hook for accessing the nearest theme override
 */
export function useOverriddenTheme(): Theme {
    const override = useContext(ThemeOverrideContext);
    const { theme } = useTheme();

    if (!override) {
        return theme;
    }

    return override.theme;
}