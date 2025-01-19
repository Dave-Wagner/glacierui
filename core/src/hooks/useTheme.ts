import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useRef,
  useMemo,
  type ReactNode
} from 'react';
import { Platform, Animated } from 'react-native';
import { Theme, ThemeName, ThemePreference, themes, getTheme, isValidTheme } from '../themes';
import {
  TransitionConfig,
  defaultTransition,
  createNativeTransition,
  createWebTransitionStyle
} from '../utils/transitions';
import { getSystemTheme, type SystemTheme } from '../utils/theme';

interface ThemeContextValue {
  theme: Theme;
  themeName: ThemePreference;
  setTheme: (name: ThemePreference) => Promise<void>;
  isValidThemeName: (name: string) => name is ThemePreference;
  systemTheme: SystemTheme;
  isTransitioning: boolean;
}

const defaultContextValue: ThemeContextValue = {
  theme: getTheme('nord'),
  themeName: 'system',
  setTheme: async () => undefined,
  isValidThemeName: isValidTheme,
  systemTheme: 'light',
  isTransitioning: false
};

export const ThemeContext = createContext<ThemeContextValue>(defaultContextValue);
ThemeContext.displayName = 'ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemePreference;
  storageKey?: string;
  transition?: TransitionConfig;
}

const THEME_STORAGE_KEY = '@glacierui:theme';

/**
 * Provides theme context and manages theme transitions for the application.
 *
 * The `ThemeProvider` component wraps the application and provides theme-related
 * context values, including the current theme, theme name, and functions to set
 * the theme. It also handles system theme changes, loading stored themes, and
 * applying theme transitions.
 *
 * @param children - The child components to be rendered within the theme provider.
 * @param defaultTheme - The default theme preference, which can be 'system', a theme name, or undefined.
 * @param storageKey - The storage key used to persist the theme preference.
 * @param transition - The configuration for theme transition animations.
 *
 * @returns A JSX element that wraps the provided children with theme context.
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = THEME_STORAGE_KEY,
  transition = defaultTransition
}: ThemeProviderProps): JSX.Element {
  const [themeName, setThemeName] = useState<ThemePreference>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<SystemTheme>(getSystemTheme());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const animation = useRef(
    Platform.OS === 'web' ? 1 : new Animated.Value(1)
  ).current;

  // Handle theme transition
  const handleThemeChange = useCallback(async () => {
    if (Platform.OS !== 'web') {
      await createNativeTransition(animation as Animated.Value, transition);
    }
  }, [animation, transition]);

  const setTheme = useCallback(async (name: ThemePreference) => {
    try {
      setIsTransitioning(true);
      await handleThemeChange();

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(storageKey, name);
      } else {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem(storageKey, name);
      }

      setThemeName(name);
      setIsTransitioning(false);
    } catch (error) {
      console.warn('Failed to save theme:', error);
      setIsTransitioning(false);
    }
  }, [storageKey, handleThemeChange]);

  // System theme detection effect
  useEffect(() => {
    /**
     * Handles system theme changes by updating the context value
     * and re-rendering the application with the new theme.
     */
    const handleSystemThemeChange = () => {
      setSystemTheme(getSystemTheme());
    };

    if (Platform.OS === 'web' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    } else {
      try {
        const { Appearance } = require('react-native');
        const subscription = Appearance.addChangeListener(handleSystemThemeChange);
        return () => subscription.remove();
      } catch {
        return undefined;
      }
    }
  }, []);

  // Load stored theme
  useEffect(() => {
    /**
     * Loads the stored theme preference from local storage
     * and updates the context value if found.
     */
    const loadStoredTheme = async () => {
      try {
        let stored: string | null = null;

        if (typeof window !== 'undefined' && window.localStorage) {
          stored = localStorage.getItem(storageKey);
        } else {
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          stored = await AsyncStorage.getItem(storageKey);
        }

        if (stored && isValidTheme(stored)) {
          setThemeName(stored);
        }
      } catch (error) {
        console.warn('Failed to load theme:', error);
      }
    };

    loadStoredTheme();
  }, [storageKey]);

  const activeTheme = useMemo(() => {
    if (themeName === 'system') {
      const baseTheme = getTheme('nord');
      return {
        ...baseTheme,
        colorMode: systemTheme
      };
    }
    return getTheme(themeName);
  }, [themeName, systemTheme]);

  const value: ThemeContextValue = {
    theme: activeTheme,
    themeName,
    setTheme,
    isValidThemeName: isValidTheme,
    systemTheme,
    isTransitioning
  };

  const Wrapper = Platform.OS === 'web' ? 'div' : Animated.View;
  const wrapperStyle = Platform.OS === 'web'
    ? { transition: createWebTransitionStyle(transition) }
    : { flex: 1, opacity: animation };

  return React.createElement(
    ThemeContext.Provider,
    { value },
    React.createElement(
      Wrapper,
      { style: wrapperStyle },
      children
    )
  );
}

/**
 * Custom hook to access the current theme context.
 *
 * This hook provides access to the theme context, which includes
 * the current theme, theme name, and methods for setting the theme.
 * It ensures that the hook is used within a `ThemeProvider` by
 * throwing an error if the context is unavailable.
 *
 * @returns The current theme context value.
 * @throws Error if used outside of a `ThemeProvider`.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}