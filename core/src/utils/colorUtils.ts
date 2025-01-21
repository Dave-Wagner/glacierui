/**
 * @module utils/colorUtils
 * @description Utility functions for color manipulation
 */

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

export class ColorUtils {
  /**
   * Lightens a color by a percentage
   */
  static lighten(color: string, amount: number): string {
    const hsl = this.hexToHSL(color);
    const lightness = Math.min(100, hsl.l + amount);
    return this.hslToHex({ ...hsl, l: lightness });
  }

  /**
   * Darkens a color by a percentage
   */
  static darken(color: string, amount: number): string {
    const hsl = this.hexToHSL(color);
    const lightness = Math.max(0, hsl.l - amount);
    return this.hslToHex({ ...hsl, l: lightness });
  }

  /**
   * Adjusts color saturation
   */
  static adjustSaturation(color: string, amount: number): string {
    const hsl = this.hexToHSL(color);
    const saturation = Math.max(0, Math.min(100, hsl.s + amount));
    return this.hslToHex({ ...hsl, s: saturation });
  }

  /**
   * Adjusts color opacity
   */
  static adjustAlpha(color: string, alpha: number): string {
    const rgb = this.hexToRGB(color);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }

  /**
   * Gets the complementary color
   */
  static getComplementary(color: string): string {
    const hsl = this.hexToHSL(color);
    return this.hslToHex({
      h: (hsl.h + 180) % 360,
      s: hsl.s,
      l: hsl.l,
    });
  }

  /**
   * Blends two colors
   */
  static blend(color1: string, color2: string, ratio: number): string {
    const rgb1 = this.hexToRGB(color1);
    const rgb2 = this.hexToRGB(color2);

    return this.rgbToHex({
      r: Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio),
      g: Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio),
      b: Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio),
    });
  }

  /**
   * Ensures minimum contrast ratio between two colors
   */
  static ensureContrast(
    color: string,
    background: string,
    minRatio: number
  ): string {
    let current = color;
    let ratio = this.getContrastRatio(current, background);

    while (ratio < minRatio) {
      current = this.adjustContrast(current, background, ratio < minRatio);
      ratio = this.getContrastRatio(current, background);
    }

    return current;
  }

  /**
   * Gets contrast ratio between two colors
   */
  static getContrastRatio(color1: string, color2: string): number {
    const l1 = this.getLuminance(this.hexToRGB(color1));
    const l2 = this.getLuminance(this.hexToRGB(color2));
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Converts hex to RGB
   */
  private static hexToRGB(hex: string): RGB {
    const normalized = hex.charAt(0) === "#" ? hex.substring(1) : hex;

    return {
      r: parseInt(normalized.substring(0, 2), 16),
      g: parseInt(normalized.substring(2, 4), 16),
      b: parseInt(normalized.substring(4, 6), 16),
    };
  }

  /**
   * Converts RGB to hex
   */
  private static rgbToHex(rgb: RGB): string {
    return (
      "#" +
      [rgb.r, rgb.g, rgb.b]
        .map((x) => Math.max(0, Math.min(255, Math.round(x))))
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  /**
   * Converts hex to HSL
   */
  private static hexToHSL(hex: string): HSL {
    const rgb = this.hexToRGB(hex);
    let { r, g, b } = rgb;

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
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: h * 360,
      s: s * 100,
      l: l * 100,
    };
  }

  /**
   * Converts HSL to hex
   */
  private static hslToHex(hsl: HSL): string {
    const { h, s, l } = hsl;
    const normalizedH = h / 360;
    const normalizedS = s / 100;
    const normalizedL = l / 100;

    let r: number, g: number, b: number;

    if (normalizedS === 0) {
      r = g = b = normalizedL;
    } else {
      const q =
        normalizedL < 0.5
          ? normalizedL * (1 + normalizedS)
          : normalizedL + normalizedS - normalizedL * normalizedS;
      const p = 2 * normalizedL - q;

      r = this.hueToRGB(p, q, normalizedH + 1 / 3);
      g = this.hueToRGB(p, q, normalizedH);
      b = this.hueToRGB(p, q, normalizedH - 1 / 3);
    }

    return this.rgbToHex({
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    });
  }

  /**
   * Helper for HSL to RGB conversion
   */
  private static hueToRGB(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  /**
   * Gets relative luminance
   */
  private static getLuminance({ r, g, b }: RGB): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Adjusts color contrast
   */
  private static adjustContrast(
    color: string,
    background: string,
    increase: boolean
  ): string {
    const hsl = this.hexToHSL(color);
    const adjustment = increase ? 5 : -5;
    return this.hslToHex({
      ...hsl,
      l: Math.max(0, Math.min(100, hsl.l + adjustment)),
    });
  }
}
