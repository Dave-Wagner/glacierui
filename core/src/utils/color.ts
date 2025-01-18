// core/src/utils/color.ts
/**
 * @module utils/color
 * @description Comprehensive color manipulation utilities
 */

/**
 * @interface RGB
 * @description RGB color values
 */
interface RGB {
    r: number;
    g: number;
    b: number;
  }
  
  /**
   * @interface HSL
   * @description HSL color values
   */
  interface HSL {
    h: number;
    s: number;
    l: number;
  }
  
  /**
   * @interface WCAG
   * @description WCAG contrast requirements
   */
  interface WCAG {
    AA: {
      normal: number;
      large: number;
    };
    AAA: {
      normal: number;
      large: number;
    };
  }
  
  const WCAG_REQUIREMENTS: WCAG = {
    AA: {
      normal: 4.5,
      large: 3,
    },
    AAA: {
      normal: 7,
      large: 4.5,
    },
  };
  
  export class ColorUtils {
    /**
     * Lightens a color by a percentage
     * @param color - Hex color string
     * @param amount - Amount to lighten (0-100)
     */
    static lighten(color: string, amount: number): string {
      const hsl = this.hexToHSL(color);
      const lightness = Math.min(100, hsl.l + amount);
      return this.hslToHex({ ...hsl, l: lightness });
    }
  
    /**
     * Darkens a color by a percentage
     * @param color - Hex color string
     * @param amount - Amount to darken (0-100)
     */
    static darken(color: string, amount: number): string {
      const hsl = this.hexToHSL(color);
      const lightness = Math.max(0, hsl.l - amount);
      return this.hslToHex({ ...hsl, l: lightness });
    }
  
    /**
     * Adjusts the alpha channel of a color
     * @param color - Hex color string
     * @param alpha - Alpha value (0-1)
     */
    static alpha(color: string, alpha: number): string {
      const rgb = this.hexToRGB(color);
      const normalized = Math.min(1, Math.max(0, alpha));
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${normalized})`;
    }
  
    /**
     * Checks if a color passes WCAG contrast requirements
     * @param foreground - Foreground color
     * @param background - Background color
     * @param level - WCAG level to check
     * @param isLargeText - Whether the text is large
     */
    static meetsContrastRequirements(
      foreground: string,
      background: string,
      level: keyof WCAG = 'AA',
      isLargeText = false
    ): boolean {
      const ratio = this.getContrastRatio(foreground, background);
      const requirement = WCAG_REQUIREMENTS[level][isLargeText ? 'large' : 'normal'];
      return ratio >= requirement;
    }
  
    /**
     * Gets the contrast ratio between two colors
     * @param color1 - First color
     * @param color2 - Second color
     */
    static getContrastRatio(color1: string, color2: string): number {
      const l1 = this.getLuminance(this.hexToRGB(color1));
      const l2 = this.getLuminance(this.hexToRGB(color2));
      const lightest = Math.max(l1, l2);
      const darkest = Math.min(l1, l2);
      return (lightest + 0.05) / (darkest + 0.05);
    }
  
    /**
     * Generates an accessible color pair
     * @param baseColor - Base color to generate from
     * @param level - WCAG level to target
     */
    static generateAccessiblePair(baseColor: string, level: keyof WCAG = 'AA'): [string, string] {
      const baseLuminance = this.getLuminance(this.hexToRGB(baseColor));
      const requirement = WCAG_REQUIREMENTS[level].normal;
      
      // Determine if we need light or dark text
      if ((baseLuminance + 0.05) / (0.05) >= requirement) {
        return [baseColor, '#000000'];
      } else {
        return [baseColor, '#FFFFFF'];
      }
    }
  
    /**
     * Hex to RGB conversion
     * @private
     */
    private static hexToRGB(hex: string): RGB {
      const normalized = hex.charAt(0) === '#' ? hex.substring(1) : hex;
      const r = parseInt(normalized.substring(0, 2), 16);
      const g = parseInt(normalized.substring(2, 4), 16);
      const b = parseInt(normalized.substring(4, 6), 16);
      return { r, g, b };
    }
  
    /**
     * RGB to Hex conversion
     * @private
     */
    private static rgbToHex(rgb: RGB): string {
      return '#' + [rgb.r, rgb.g, rgb.b]
        .map(x => Math.max(0, Math.min(255, Math.round(x))))
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
    }
  
    /**
     * Hex to HSL conversion
     * @private
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
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
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
     * HSL to Hex conversion
     * @private
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
        const q = normalizedL < 0.5
          ? normalizedL * (1 + normalizedS)
          : normalizedL + normalizedS - normalizedL * normalizedS;
        const p = 2 * normalizedL - q;
  
        r = this.hueToRGB(p, q, normalizedH + 1/3);
        g = this.hueToRGB(p, q, normalizedH);
        b = this.hueToRGB(p, q, normalizedH - 1/3);
      }
  
      return this.rgbToHex({
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
      });
    }
  
    /**
     * Helper for HSL to RGB conversion
     * @private
     */
    private static hueToRGB(p: number, q: number, t: number): number {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
  
    /**
     * Calculate relative luminance
     * @private
     */
    private static getLuminance(rgb: RGB): number {
      const [rs, gs, bs] = [rgb.r, rgb.g, rgb.b].map(c => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }
  }