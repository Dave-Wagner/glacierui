import { Theme, ColorDepth, SemanticColor } from '../types/color';
import { ColorDepthGenerator } from './colorDepth';
import { ColorConverter } from '../utils/colorConverter';
import { findColorByWord } from '../constants/colorWords';

interface ThemeOptions {
  baseColor: string;
  accentColor?: string;
  neutralColor?: string;
  isDark?: boolean;
}

export class ThemeGenerator {
  static generateTheme(options: ThemeOptions): Theme {
    const base = this.resolveColor(options.baseColor);
    const accent = this.resolveColor(options.accentColor || this.generateComplementary(base));
    const neutral = this.resolveColor(options.neutralColor || '#808080');
    
    const primaryDepth = ColorDepthGenerator.generateColorDepth(base);
    const accentDepth = ColorDepthGenerator.generateColorDepth(accent);
    const neutralDepth = ColorDepthGenerator.generateColorDepth(neutral);
    
    return {
      primary: primaryDepth,
      accent: accentDepth,
      neutral: neutralDepth,
      semantic: {
        success: ColorDepthGenerator.generateSemanticColor('#00C853'),
        warning: ColorDepthGenerator.generateSemanticColor('#FFD600'),
        error: ColorDepthGenerator.generateSemanticColor('#FF1744'),
        info: ColorDepthGenerator.generateSemanticColor('#2196F3'),
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

  private static resolveColor(input: string): string {
    if (input.startsWith('#')) {
      return input;
    }
    
    const wordColor = findColorByWord(input);
    if (!wordColor) {
      throw new Error(`Unable to resolve color: ${input}`);
    }
    
    return wordColor;
  }

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