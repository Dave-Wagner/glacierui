/**
 * @module generators/colorDepth
 * @description Generates color palettes and semantic color variations
 */

import { ColorDepth, SemanticColor } from "../types/color";
import { ColorConverter } from "../utils/colorConverter";

/**
 * Generates color palettes and semantic variations from base colors
 */
export class ColorDepthGenerator {
  /**
   * Generates a complete color depth scale from a base color
   * Creates a range of shades from very light (50) to very dark (900)
   *
   * @param baseColor - The base color in hex format
   * @returns A complete color depth scale
   *
   * @example
   * ```typescript
   * // Generate a blue color palette
   * const bluePalette = ColorDepthGenerator.generateColorDepth('#0000FF');
   *
   * // Use specific shades
   * const lightBlue = bluePalette[100];  // Very light blue
   * const baseBlue = bluePalette[500];   // Original blue
   * const darkBlue = bluePalette[900];   // Very dark blue
   * ```
   */
  static generateColorDepth(baseColor: string): ColorDepth {
    const rgb = ColorConverter.hexToRgb(baseColor);
    const hsl = ColorConverter.rgbToHsl(rgb);

    return {
      50: ColorConverter.hslToHex({ ...hsl, l: 98 }), // Lightest - for backgrounds
      100: ColorConverter.hslToHex({ ...hsl, l: 90 }), // Very light - for hover states
      200: ColorConverter.hslToHex({ ...hsl, l: 80 }), // Light - for secondary backgrounds
      300: ColorConverter.hslToHex({ ...hsl, l: 70 }), // Medium light - for borders
      400: ColorConverter.hslToHex({ ...hsl, l: 60 }), // Lighter than base
      500: baseColor, // Base color
      600: ColorConverter.hslToHex({ ...hsl, l: 40 }), // Darker than base
      700: ColorConverter.hslToHex({ ...hsl, l: 30 }), // Dark - for hover states
      800: ColorConverter.hslToHex({ ...hsl, l: 20 }), // Very dark - for text
      900: ColorConverter.hslToHex({ ...hsl, l: 10 }), // Darkest - for emphasis
    };
  }

  /**
   * Generates semantic color variations for a base color
   * Creates light, dark, background, and text variations with accessibility in mind
   *
   * @param baseColor - The base color in hex format
   * @returns Semantic color variations
   *
   * @example
   * ```typescript
   * // Generate semantic variations for a primary color
   * const primary = ColorDepthGenerator.generateSemanticColor('#007AFF');
   *
   * // Use semantic variations
   * const lightVersion = primary.light;    // For hover states
   * const darkVersion = primary.dark;      // For active states
   * const bgVersion = primary.bg;          // For backgrounds
   * const textColor = primary.text;        // Accessible text color
   * ```
   */
  static generateSemanticColor(baseColor: string): SemanticColor {
    const rgb = ColorConverter.hexToRgb(baseColor);
    const hsl = ColorConverter.rgbToHsl(rgb);

    return {
      base: baseColor,
      light: ColorConverter.hslToHex({ ...hsl, l: Math.min(hsl.l + 15, 100) }),
      dark: ColorConverter.hslToHex({ ...hsl, l: Math.max(hsl.l - 15, 0) }),
      bg: ColorConverter.hslToHex({
        ...hsl,
        l: 95,
        s: Math.max(hsl.s - 30, 0),
      }),
      text:
        ColorConverter.getAccessibilityInfo(baseColor).contrastWithWhite > 4.5
          ? "#FFFFFF"
          : "#000000",
    };
  }
}
