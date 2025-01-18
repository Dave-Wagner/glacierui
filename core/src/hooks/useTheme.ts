// core/hooks/useTheme.ts
import React, { 
    useState, 
    useEffect, 
    createContext, 
    useContext, 
    useCallback,
    type ReactNode
  } from 'react';
  import { Theme, ThemeName, themes, getTheme } from '../themes';
  
  interface ThemeContextValue {
    theme: Theme;
    themeName: ThemeName;
    setTheme: (name: ThemeName) => void;
    isValidThemeName: (name: string) => name is ThemeName;
  }
  
  /**
   * @function isValidThemeName
   * @description Type guard for theme name validation
   * @param {string} name - theme name to validate
   * @returns {name is ThemeName} whether the theme name is valid
   */
  const isValidThemeName = (name: string): name is ThemeName => {
    return name in themes;
  };
  
  const defaultContextValue: ThemeContextValue = {
    theme: getTheme('nord'),
    themeName: 'nord',
    setTheme: () => undefined,
    isValidThemeName
  };
  
  export const ThemeContext = createContext<ThemeContextValue>(defaultContextValue);
  ThemeContext.displayName = 'ThemeContext';
  
  interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: ThemeName;
    storageKey?: string;
  }
  
/**
 * @function ThemeProvider
 * @description Provides a theme context to its children, allowing them to access the current theme and change it.
 * @param {ThemeProviderProps} props - The properties object.
 * @param {ReactNode} props.children - The child components that will have access to the theme context.
 * @param {ThemeName} [props.defaultTheme='nord'] - The default theme to use if no theme is stored.
 * @param {string} [props.storageKey='@glacier-ui:theme'] - The key used to store the theme in local or async storage.
 * @returns {JSX.Element} A React element that provides the theme context to its children.
 */
  export function ThemeProvider({
    children,
    defaultTheme = 'nord',
    storageKey = '@glacier-ui:theme'
  }: ThemeProviderProps): JSX.Element {
    const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);
  
    useEffect(() => {
    /**
     * Loads the theme from storage and sets it to the state if it's a valid theme name.
     * @private
     */
      const loadTheme = async () => {
        try {
          let stored: string | null = null;
          
          if (typeof window !== 'undefined' && window.localStorage) {
            stored = localStorage.getItem(storageKey);
          } else {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            stored = await AsyncStorage.getItem(storageKey);
          }
          
          if (stored && isValidThemeName(stored)) {
            setThemeName(stored);
          }
        } catch (error) {
          console.warn('Failed to load theme:', error);
        }
      };
  
      loadTheme();
    }, [storageKey]);
  
    const setTheme = useCallback(async (name: ThemeName) => {
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
  
    const value: ThemeContextValue = {
      theme: getTheme(themeName),
      themeName,
      setTheme,
      isValidThemeName
    };
  
    return React.createElement(ThemeContext.Provider, { value }, children);
  }
  
  /**
   * Hook to access the theme context.
   * @returns The theme context value, including the current theme and functions to update it.
   * @throws If used outside of a ThemeProvider.
   */
  export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);
    
    if (!context) {
      throw new Error('useTheme must be used within a ThemeProvider');
    }
    
    return context;
  }