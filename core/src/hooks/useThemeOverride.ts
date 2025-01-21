/**
 * @module hooks/useThemeOverride
 * @description Hook for component-level theme customization
 *
 * This hook builds upon useTheme to provide component-level theme overrides.
 * It allows components to customize their theme while maintaining consistency
 * with the global theme system.
 *
 * This hook is part of GlacierUI's theme customization system:
 * - useTheme: Provides the base theme
 * - useThemeOverride: Enables component-level customization
 * - useThemeTransition: Manages transitions between themes
 */

import { useMemo } from "react";
import { useTheme } from "./useTheme";
import { Theme } from "../themes/types";
import { ThemeOverride, mergeTheme } from "../utils/override";

/**
 * Hook for applying theme overrides at the component level
 *
 * @param override - Theme override object
 * @returns Merged theme combining global theme with overrides
 *
 * @example
 * ```tsx
 * // Basic color override
 * function CustomButton() {
 *   const theme = useThemeOverride({
 *     colors: {
 *       primary: '#FF0000'
 *     }
 *   });
 *
 *   return (
 *     <TouchableOpacity
 *       style={{ backgroundColor: theme.colors.primary }}
 *     >
 *       <Text>Custom Button</Text>
 *     </TouchableOpacity>
 *   );
 * }
 *
 * // Multiple overrides
 * function CustomSection() {
 *   const theme = useThemeOverride({
 *     colors: {
 *       background: '#F5F5F5',
 *       text: '#000000',
 *       primary: '#0066CC'
 *     },
 *     spacing: {
 *       md: 20
 *     }
 *   });
 *
 *   return (
 *     <View style={{
 *       backgroundColor: theme.colors.background,
 *       padding: theme.spacing.md
 *     }}>
 *       <Text style={{ color: theme.colors.text }}>
 *         Custom Section
 *       </Text>
 *     </View>
 *   );
 * }
 *
 * // Dynamic overrides
 * function DynamicThemeComponent({ accentColor }) {
 *   const theme = useThemeOverride(
 *     useMemo(() => ({
 *       colors: {
 *         accent: accentColor,
 *         accentContent: '#FFFFFF'
 *       }
 *     }), [accentColor])
 *   );
 *
 *   return (
 *     <View style={{ backgroundColor: theme.colors.accent }}>
 *       <Text style={{ color: theme.colors.accentContent }}>
 *         Dynamic Theme
 *       </Text>
 *     </View>
 *   );
 * }
 * ```
 *
 * @remarks
 * Theme overrides are merged with the global theme, allowing partial
 * customization while maintaining consistency. The hook automatically
 * updates when either the global theme or overrides change.
 *
 * For optimal performance, consider memoizing the override object if
 * it's created inline or depends on props/state.
 */
export function useThemeOverride(override: ThemeOverride): Theme {
  const { theme } = useTheme();

  return useMemo(() => mergeTheme(theme, override), [theme, override]);
}
