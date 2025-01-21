/**
 * @module generators/themeGenerator
 * @description Generates complete themes from color options
 */

import { Theme, ColorDepth, SemanticColor } from "../types/color";
import { ColorDepthGenerator } from "./colorDepth";
import { ColorConverter } from "../utils/colorConverter";
import { findColorByWord } from "../constants/colorWords";

/**
 * Options for theme generation
 */
export interface ThemeOptions {
  /** Primary color (hex or color name) */
  baseColor: string;
  /** Accent color (hex, color name, or auto-generated) */
  accentColor?: string;
  /** Neutral color (hex or color name) */
  neutralColor?: string;
  /** Dark mode flag */
  isDark?: boolean;
}

/**
 * Generates complete themes from color options
 */
export class ThemeGenerator {
  /**
   * Generates a complete theme from color options
   *
   * @param options - Theme generation options
   * @returns Complete theme object
   *
   * @example
   * ```typescript
   * // Generate a theme with specific colors
   * const theme = ThemeGenerator.generateTheme({
   *   baseColor: '#007AFF',
   *   accentColor: '#FF9500',
   *   neutralColor: 'gray',
   *   isDark: false
   * });
   *
   * // Generate a theme with color names
   * const theme = ThemeGenerator.generateTheme({
   *   baseColor: 'blue',
   *   accentColor: 'orange',
   *   isDark: true
   * });
   *
   * // Generate a theme with automatic accent color
   * const theme = ThemeGenerator.generateTheme({
   *   baseColor: '#007AFF'
   * });
   * ```
   */
  static generateTheme(options: ThemeOptions): Theme {
    const base = this.resolveColor(options.baseColor);
    const accent = this.resolveColor(
      options.accentColor || this.generateComplementary(base)
    );
    const neutral = this.resolveColor(options.neutralColor || "#808080");

    const primaryDepth = ColorDepthGenerator.generateColorDepth(base);
    const accentDepth = ColorDepthGenerator.generateColorDepth(accent);
    const neutralDepth = ColorDepthGenerator.generateColorDepth(neutral);

    return {
      primary: primaryDepth,
      accent: accentDepth,
      neutral: neutralDepth,
      semantic: {
        success: ColorDepthGenerator.generateSemanticColor("#00C853"), // Green
        warning: ColorDepthGenerator.generateSemanticColor("#FFD600"), // Yellow
        error: ColorDepthGenerator.generateSemanticColor("#FF1744"), // Red
        info: ColorDepthGenerator.generateSemanticColor("#2196F3"), // Blue
      },
      background: {
        default: options.isDark ? neutralDepth[900] : neutralDepth[50],
        paper: options.isDark ? neutralDepth[800] : neutralDepth[100],
        elevated: options.isDark ? neutralDepth[700] : neutralDepth[200],
      },
      text: {
        primary: options.isDark ? neutralDepth[50] : neutralDepth[900],
        secondary: options.isDark ? neutralDepth[100] : neutralDepth[800],
        disabled: options.isDark ? neutralDepth[200] : neutralDepth[700],
        inverse: options.isDark ? neutralDepth[900] : neutralDepth[50],
      },
    };
  }

  /**
   * Resolves a color from hex value or color name
   * @private
   */
  private static resolveColor(input: string): string {
    if (input.startsWith("#")) {
      return input;
    }

    const wordColor = findColorByWord(input);
    if (!wordColor) {
      throw new Error(`Unable to resolve color: ${input}`);
    }

    return wordColor;
  }

  /**
   * Generates a complementary color
   * @private
   */
  private static generateComplementary(hex: string): string {
    const rgb = ColorConverter.hexToRgb(hex);
    const hsl = ColorConverter.rgbToHsl(rgb);
    return ColorConverter.hslToHex({
      h: (hsl.h + 180) % 360,
      s: hsl.s,
      l: hsl.l,
    });
  }
}
