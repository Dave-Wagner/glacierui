/**
 * @module utils/colorConverter
 * @description Color format conversion utilities
 */

import { AccessibilityInfo } from '../types/color';

/**
 * @interface RGB
 * @description RGB color representation
 */
interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * @interface HSL
 * @description HSL color representation
 */
interface HSL {
  h: number;
  s: number;
  l: number;
}

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
  static hexToRgb(hex: string): RGB {
    const normalized = hex.charAt(0) === '#' ? hex.substring(1) : hex;
    const r = parseInt(normalized.substring(0, 2), 16);
    const g = parseInt(normalized.substring(2, 4), 16);
    const b = parseInt(normalized.substring(4, 6), 16);
    
    return { r, g, b };
  }

  /**
   * Converts RGB values to HSL format
   * @param rgb - RGB color object
   * @returns HSL color object
   */
  static rgbToHsl({ r, g, b }: RGB): HSL {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { 
      h: h * 360, 
      s: s * 100, 
      l: l * 100 
    };
  }

  /**
   * Converts HSL values to hex format
   * @param hsl - HSL color object
   * @returns Hex color string
   */
  static hslToHex({ h, s, l }: HSL): string {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return this.rgbToHex(
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    );
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
      .map(x => Math.max(0, Math.min(255, Math.round(x))))
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
   * @description Formula taken from W3C Web Content Accessibility Guidelines 2.1
   * @param {RGB} rgb - RGB color object
   * @returns {number} Relative luminance of the color
   */
  private static calculateLuminance({ r, g, b }: RGB): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Calculates contrast ratio between two luminance values
   * @private
   * @description Formula taken from W3C Web Content Accessibility Guidelines 2.1
   * @param {number} l1 - Luminance of the first color
   * @param {number} l2 - Luminance of the second color
   * @returns {number} Contrast ratio between the two colors
   */
  private static calculateContrast(l1: number, l2: number): number {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }
}