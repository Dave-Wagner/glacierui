import React, { 
  useState, 
  useEffect, 
  createContext, 
  useContext, 
  useCallback,
  useMemo,
  type ReactNode
} from 'react';
import { Theme, ThemeName, ThemePreference, isValidTheme, getTheme } from '../themes';

interface ThemeContextValue {
  theme: Theme;
  themeName: ThemePreference;
  setTheme: (name: ThemePreference) => void;
  isValidThemeName: (name: string) => name is ThemePreference;
  systemTheme: 'light' | 'dark';
}

const defaultContextValue: ThemeContextValue = {
  theme: getTheme('nord'),
  themeName: 'system',
  setTheme: () => undefined,
  isValidThemeName: isValidTheme,
  systemTheme: 'light'
};

export const ThemeContext = createContext<ThemeContextValue>(defaultContextValue);
ThemeContext.displayName = 'ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemePreference;
  storageKey?: string;
}

const THEME_STORAGE_KEY = '@glacierui:theme';

/**
 * Gets the system color scheme preference
 * @returns 'light' | 'dark'
 */
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  
  // Check for react-native
  if (typeof window.matchMedia === 'undefined') {
    try {
      const { Appearance } = require('react-native');
      return Appearance.getColorScheme() || 'light';
    } catch {
      return 'light';
    }
  }

  // Web implementation
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = THEME_STORAGE_KEY
}: ThemeProviderProps): JSX.Element {
  const [themeName, setThemeName] = useState<ThemePreference>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme());

  // Handle system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleSystemThemeChange = () => {
      const newSystemTheme = getSystemTheme();
      setSystemTheme(newSystemTheme);
    };

    // React Native
    try {
      const { Appearance } = require('react-native');
      const subscription = Appearance.addChangeListener(handleSystemThemeChange);
      return () => subscription.remove();
    } catch {
      // Web implementation
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
      }
    }
  }, []);

  // Load stored theme preference
  useEffect(() => {
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

  const setTheme = useCallback(async (name: ThemePreference) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(storageKey, name);
      } else {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem(storageKey, name);
      }
      setThemeName(name);
    } catch (error) {
      console.warn('Failed to save theme:', error);
    }
  }, [storageKey]);

  // Determine the actual theme based on system preference and user choice
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
    systemTheme
  };

  return React.createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}