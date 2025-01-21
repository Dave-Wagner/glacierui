/**
 * @module hooks/useTheme
 * @description Core theme management hook and provider
 *
 * This module provides the foundation for GlacierUI's theming system. It manages:
 * - Theme state and updates
 * - System theme detection
 * - Theme persistence
 * - Theme transitions
 *
 * Other hooks build upon this core functionality:
 * - useThemeOverride: Allows component-level theme customization
 * - useThemeTransition: Manages smooth theme transitions
 */

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
} from "react";
import { Platform, Animated } from "react-native";
import {
  Theme,
  ThemeName,
  ThemePreference,
  themes,
  getTheme,
  isValidTheme,
} from "../themes";
import {
  TransitionConfig,
  defaultTransition,
  createNativeTransition,
  createWebTransitionStyle,
} from "../utils/transitions";
import { getSystemTheme, type SystemTheme } from "../utils/theme";

/**
 * Core theme context value
 *
 * @property theme - Current theme object
 * @property themeName - Current theme name or 'system'
 * @property setTheme - Function to update the current theme
 * @property isValidThemeName - Type guard for theme names
 * @property systemTheme - Current system theme preference
 * @property isTransitioning - Whether a theme transition is in progress
 */
interface ThemeContextValue {
  theme: Theme;
  themeName: ThemePreference;
  setTheme: (name: ThemePreference) => Promise<void>;
  isValidThemeName: (name: string) => name is ThemePreference;
  systemTheme: SystemTheme;
  isTransitioning: boolean;
}

/**
 * Default context value when no provider is present
 */
const defaultContextValue: ThemeContextValue = {
  theme: getTheme("nord"),
  themeName: "system",
  setTheme: async () => undefined,
  isValidThemeName: isValidTheme,
  systemTheme: "light",
  isTransitioning: false,
};

export const ThemeContext =
  createContext<ThemeContextValue>(defaultContextValue);
ThemeContext.displayName = "ThemeContext";

/**
 * Theme provider props
 */
interface ThemeProviderProps {
  /** Child components */
  children: ReactNode;
  /** Initial theme preference */
  defaultTheme?: ThemePreference;
  /** Storage key for theme persistence */
  storageKey?: string;
  /** Transition configuration */
  transition?: TransitionConfig;
}

const THEME_STORAGE_KEY = "@glacierui:theme";

/**
 * GlacierUI theme provider component
 *
 * Provides theme context and management for the entire application.
 *
 * @example
 * ```tsx
 * // Basic usage
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 *
 * // With custom configuration
 * function App() {
 *   return (
 *     <ThemeProvider
 *       defaultTheme="dark"
 *       storageKey="@myapp:theme"
 *       transition={{
 *         duration: 300,
 *         timing: 'ease-in-out'
 *       }}
 *     >
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = THEME_STORAGE_KEY,
  transition = defaultTransition,
}: ThemeProviderProps): JSX.Element {
  const [themeName, setThemeName] = useState<ThemePreference>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<SystemTheme>(getSystemTheme());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const animation = useRef(
    Platform.OS === "web" ? 1 : new Animated.Value(1)
  ).current;

  // Handle theme transition
  const handleThemeChange = useCallback(async () => {
    if (Platform.OS !== "web") {
      await createNativeTransition(animation as Animated.Value, transition);
    }
  }, [animation, transition]);

  const setTheme = useCallback(
    async (name: ThemePreference) => {
      try {
        setIsTransitioning(true);
        await handleThemeChange();

        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem(storageKey, name);
        } else {
          const AsyncStorage =
            require("@react-native-async-storage/async-storage").default;
          await AsyncStorage.setItem(storageKey, name);
        }

        setThemeName(name);
        setIsTransitioning(false);
      } catch (error) {
        console.warn("Failed to save theme:", error);
        setIsTransitioning(false);
      }
    },
    [storageKey, handleThemeChange]
  );

  // System theme detection effect
  useEffect(() => {
    const handleSystemThemeChange = () => {
      setSystemTheme(getSystemTheme());
    };

    if (Platform.OS === "web" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () =>
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
    } else {
      try {
        const { Appearance } = require("react-native");
        const subscription = Appearance.addChangeListener(
          handleSystemThemeChange
        );
        return () => subscription.remove();
      } catch {
        return undefined;
      }
    }
  }, []);

  // Load stored theme
  useEffect(() => {
    const loadStoredTheme = async () => {
      try {
        let stored: string | null = null;

        if (typeof window !== "undefined" && window.localStorage) {
          stored = localStorage.getItem(storageKey);
        } else {
          const AsyncStorage =
            require("@react-native-async-storage/async-storage").default;
          stored = await AsyncStorage.getItem(storageKey);
        }

        if (stored && isValidTheme(stored)) {
          setThemeName(stored);
        }
      } catch (error) {
        console.warn("Failed to load theme:", error);
      }
    };

    loadStoredTheme();
  }, [storageKey]);

  const activeTheme = useMemo(() => {
    if (themeName === "system") {
      const baseTheme = getTheme("nord");
      return {
        ...baseTheme,
        colorMode: systemTheme,
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
    isTransitioning,
  };

  const Wrapper = Platform.OS === "web" ? "div" : Animated.View;
  const wrapperStyle =
    Platform.OS === "web"
      ? { transition: createWebTransitionStyle(transition) }
      : { flex: 1, opacity: animation };

  return React.createElement(
    ThemeContext.Provider,
    { value },
    React.createElement(Wrapper, { style: wrapperStyle }, children)
  );
}

/**
 * Hook for accessing and managing themes
 *
 * This is the primary hook for interacting with GlacierUI's theme system.
 * It provides access to the current theme and methods to modify it.
 *
 * @returns Theme context value
 *
 * @example
 * ```tsx
 * // Basic usage
 * function MyComponent() {
 *   const { theme, setTheme } = useTheme();
 *
 *   return (
 *     <View style={{ backgroundColor: theme.colors.background }}>
 *       <Button onPress={() => setTheme('dark')}>
 *         Go Dark
 *       </Button>
 *     </View>
 *   );
 * }
 *
 * // System theme handling
 * function ThemeAwareComponent() {
 *   const { systemTheme, setTheme } = useTheme();
 *
 *   useEffect(() => {
 *     setTheme('system'); // Follow system preference
 *   }, []);
 *
 *   return (
 *     <Text>Current system theme: {systemTheme}</Text>
 *   );
 * }
 *
 * // Transition handling
 * function TransitionAwareComponent() {
 *   const { isTransitioning } = useTheme();
 *
 *   return isTransitioning ? <Loading /> : <Content />;
 * }
 * ```
 *
 * @remarks
 * This hook is used as a foundation by other hooks:
 * - useThemeOverride builds on this to provide component-level theming
 * - useThemeTransition uses the transition state for animations
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
