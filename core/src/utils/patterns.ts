// core/src/utils/patterns.ts
import { ThemeOverride, ColorOverride } from "./override";
import { ColorUtils } from "./colorUtils";
import { ThemeColors } from "../themes/types";

interface ColorSchemeOptions {
  baseColor: string;
  contrastRatio?: number;
  saturation?: number;
  lightness?: number;
}

/**
 * Generates theme patterns and color schemes
 */
export class ThemePatterns {
  /**
   * Creates a monochromatic color scheme
   */
  static createMonochromatic(options: ColorSchemeOptions): ThemeOverride {
    const {
      baseColor,
      contrastRatio = 4.5,
      saturation = 0,
      lightness = 0,
    } = options;

    const primary = baseColor;
    const secondary = ColorUtils.adjustSaturation(baseColor, saturation - 20);
    const accent = ColorUtils.adjustSaturation(baseColor, saturation + 20);

    return {
      colors: {
        primary,
        primaryContent: this.getContentColor(primary),
        secondary,
        secondaryContent: this.getContentColor(secondary),
        accent,
        accentContent: this.getContentColor(accent),
        background: ColorUtils.adjustSaturation(
          ColorUtils.lighten(baseColor, lightness + 95),
          -80
        ),
        backgroundContent: ColorUtils.darken(baseColor, 80),
        text: ColorUtils.darken(baseColor, 80),
        textAlt: ColorUtils.darken(baseColor, 60),
        textMuted: ColorUtils.darken(baseColor, 40),
      },
    };
  }

  /**
   * Creates a complementary color scheme
   */
  static createComplementary(options: ColorSchemeOptions): ThemeOverride {
    const { baseColor, contrastRatio = 4.5 } = options;
    const complement = ColorUtils.getComplementary(baseColor);
    const accent = ColorUtils.blend(baseColor, complement, 0.3);

    return {
      colors: {
        primary: baseColor,
        primaryContent: this.getContentColor(baseColor),
        secondary: complement,
        secondaryContent: this.getContentColor(complement),
        accent,
        accentContent: this.getContentColor(accent),
        background: ColorUtils.adjustSaturation(
          ColorUtils.lighten(baseColor, 95),
          -80
        ),
        backgroundContent: ColorUtils.darken(baseColor, 80),
        text: ColorUtils.darken(baseColor, 80),
        textAlt: ColorUtils.darken(baseColor, 60),
        textMuted: ColorUtils.darken(baseColor, 40),
      },
    };
  }

  /**
   * Creates an accessibility-focused theme
   */
  static createAccessible(baseTheme: ThemeOverride): ThemeOverride {
    if (!baseTheme.colors) return { colors: {} };

    const contentKeys = [
      "primaryContent",
      "secondaryContent",
      "accentContent",
      "backgroundContent",
    ] as const;

    const backgroundKeys = [
      "primary",
      "secondary",
      "accent",
      "background",
    ] as const;

    const colors = contentKeys.reduce<ColorOverride>((acc, contentKey) => {
      const value = baseTheme.colors?.[contentKey];
      const backgroundKey = backgroundKeys[contentKeys.indexOf(contentKey)];
      const backgroundColor = baseTheme.colors?.[backgroundKey];

      if (
        value &&
        backgroundColor &&
        typeof value === "string" &&
        typeof backgroundColor === "string"
      ) {
        acc[contentKey] = ColorUtils.ensureContrast(
          value,
          backgroundColor,
          4.5
        );
      }

      return acc;
    }, {});

    return { colors };
  }

  /**
   * Creates a high contrast version of a theme
   */
  static createHighContrast(baseTheme: ThemeOverride): ThemeOverride {
    return {
      colors: {
        ...baseTheme.colors,
        primaryContent: "#FFFFFF",
        secondaryContent: "#FFFFFF",
        accentContent: "#FFFFFF",
        background: "#FFFFFF",
        backgroundContent: "#000000",
        text: "#000000",
        textAlt: "#1A1A1A",
        textMuted: "#4A4A4A",
      },
    };
  }

  /**
   * Gets appropriate content color based on background
   * @private
   */
  private static getContentColor(backgroundColor: string): string {
    const whiteContrast = ColorUtils.getContrastRatio(
      backgroundColor,
      "#FFFFFF"
    );
    const blackContrast = ColorUtils.getContrastRatio(
      backgroundColor,
      "#000000"
    );

    return whiteContrast > blackContrast ? "#FFFFFF" : "#000000";
  }
}
