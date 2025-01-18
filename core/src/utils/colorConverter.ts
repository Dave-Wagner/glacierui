/**
 * @module utils/colorConverter
 * @description Color format conversion utilities
 */

import { AccessibilityInfo } from '../../types/color';

/**
 * @class ColorConverter
 * @description Handles color format conversions and accessibility calculations
 */
export class ColorConverter {
  /**
   * Converts a hex color to RGB format
   * @param hex - Hex color string (e.g., "#FF0000")
   * @returns RGB color object
   */
  static hexToRgb(hex: string): { r: number; g: number; b: number } {
    const normalized = hex.charAt(0) === '#' ? hex.substring(1) : hex;
    const r = parseInt(normalized.substring(0, 2), 16);
    const g = parseInt(normalized.substring(2, 4), 16);
    const b = parseInt(normalized.substring(4, 6), 16);
    
    return { r, g, b };
  }

  /**
   * Converts RGB values to a hex string
   * @param r - Red value (0-255)
   * @param g - Green value (0-255)
   * @param b - Blue value (0-255)
   * @returns Hex color string
   */
  static rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Calculates accessibility metrics for a color
   * @param hex - Hex color string
   * @returns Accessibility information including contrast ratios
   */
  static getAccessibilityInfo(hex: string): AccessibilityInfo {
    const rgb = this.hexToRgb(hex);
    const luminance = this.calculateLuminance(rgb);
    
    const contrastWithWhite = this.calculateContrast(luminance, 1);
    const contrastWithBlack = this.calculateContrast(luminance, 0);
    
    return {
      contrastWithWhite,
      contrastWithBlack,
      passesAA: Math.max(contrastWithWhite, contrastWithBlack) >= 4.5,
      passesAAA: Math.max(contrastWithWhite, contrastWithBlack) >= 7,
    };
  }

  /**
   * Calculates relative luminance of an RGB color
   * @private
   */
  private static calculateLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Calculates contrast ratio between two luminance values
   * @private
   */
  private static calculateContrast(l1: number, l2: number): number {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }
}