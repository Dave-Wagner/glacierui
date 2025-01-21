import React, { createContext, useContext, type ReactNode } from 'react';
import { Theme } from '../themes/types';
import { type ThemeOverride as ThemeOverrideType, mergeTheme } from '../utils/override';
import { useTheme } from '../hooks/useTheme';

/**
 * @interface ThemeOverrideContextValue
 * @description Internal context value for theme override system
 * @internal
 */
interface ThemeOverrideContextValue {
    theme: Theme;
}

/**
 * @internal
 */
const ThemeOverrideContext = createContext<ThemeOverrideContextValue | null>(null);

/**
 * @interface ThemeOverrideProps
 * @description Props for the ThemeOverride component
 */
interface ThemeOverrideProps {
    /** React child elements */
    children: ReactNode;
    /** Theme override object to be merged with the parent theme */
    theme: ThemeOverrideType;
}

/**
 * ThemeOverride Component
 * 
 * Allows for local theme overrides within a component subtree. This is useful for
 * creating themed sections or components that need to deviate from the global theme.
 * 
 * @example
 * ```tsx
 * // Override primary color for a specific section
 * <ThemeOverride theme={{ colors: { primary: '#FF0000' } }}>
 *   <MyComponent />
 * </ThemeOverride>
 * 
 * // Multiple overrides
 * <ThemeOverride theme={{
 *   colors: {
 *     primary: '#FF0000',
 *     primaryContent: '#FFFFFF',
 *     background: '#F0F0F0'
 *   }
 * }}>
 *   <div>This section has custom theming</div>
 * </ThemeOverride>
 * ```
 * 
 * @param props - Component props
 * @param props.children - Child elements to be rendered with the overridden theme
 * @param props.theme - Theme override object to be merged with the parent theme
 * 
 * @returns JSX.Element wrapped in a theme context
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
 * Hook for accessing theme overrides
 * 
 * Provides access to the nearest theme override in the component tree. If no override
 * is present, returns the global theme.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const theme = useOverriddenTheme();
 * 
 *   return (
 *     <div style={{ color: theme.colors.primary }}>
 *       This text uses the nearest theme's primary color
 *     </div>
 *   );
 * }
 * 
 * // Usage with TypeScript
 * function TypedComponent() {
 *   const theme = useOverriddenTheme();
 *   const { primary, secondary } = theme.colors;
 * 
 *   return (
 *     <div style={{ 
 *       color: primary,
 *       backgroundColor: secondary 
 *     }}>
 *       Typed theme access
 *     </div>
 *   );
 * }
 * ```
 * 
 * @returns The nearest overridden theme or the global theme if no override exists
 */
export function useOverriddenTheme(): Theme {
    const override = useContext(ThemeOverrideContext);
    const { theme } = useTheme();

    if (!override) {
        return theme;
    }

    return override.theme;
}