/**
 * @module generators/colorDepth
 * @description Complete color depth and palette generation system
 * @version 0.2.0
 */

import { ColorDepth, SemanticColor } from '../types/color';
import { ColorConverter } from '../utils/colorConverter';

export class ColorDepthGenerator {
  static generateColorDepth(baseColor: string): ColorDepth {
    const rgb = ColorConverter.hexToRgb(baseColor);
    const hsl = ColorConverter.rgbToHsl(rgb);
    
    return {
      50: ColorConverter.hslToHex({ ...hsl, l: 98 }),
      100: ColorConverter.hslToHex({ ...hsl, l: 90 }),
      200: ColorConverter.hslToHex({ ...hsl, l: 80 }),
      300: ColorConverter.hslToHex({ ...hsl, l: 70 }),
      400: ColorConverter.hslToHex({ ...hsl, l: 60 }),
      500: baseColor,
      600: ColorConverter.hslToHex({ ...hsl, l: 40 }),
      700: ColorConverter.hslToHex({ ...hsl, l: 30 }),
      800: ColorConverter.hslToHex({ ...hsl, l: 20 }),
      900: ColorConverter.hslToHex({ ...hsl, l: 10 }),
    };
  }

  /**
   * Generates semantic color variations
   * @param baseColor - Base hex color
   * @returns Semantic color variations
   */
  static generateSemanticColor(baseColor: string): SemanticColor {
    const rgb = ColorConverter.hexToRgb(baseColor);
    const hsl = ColorConverter.rgbToHsl(rgb);
    
    return {
      base: baseColor,
      light: ColorConverter.hslToHex({ ...hsl, l: Math.min(hsl.l + 15, 100) }),
      dark: ColorConverter.hslToHex({ ...hsl, l: Math.max(hsl.l - 15, 0) }),
      bg: ColorConverter.hslToHex({ ...hsl, l: 95, s: Math.max(hsl.s - 30, 0) }),
      text: ColorConverter.getAccessibilityInfo(baseColor).contrastWithWhite > 4.5 
        ? '#FFFFFF' 
        : '#000000',
    };
  }
}