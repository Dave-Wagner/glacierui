// core/src/utils/helpers.ts
import { ThemeOverride, ColorOverride } from "./override";
import { ColorUtils } from "../utils/colorUtils";
import { ThemeColors } from "../themes/types";

/**
 * Helper functions for common theme override scenarios
 */
export class ThemeHelpers {
  /**
   * Creates a color variant
   */
  static createVariant(
    color: string,
    type: "lighter" | "darker" | "muted" | "vivid"
  ): ColorOverride {
    switch (type) {
      case "lighter":
        return {
          primary: ColorUtils.lighten(color, 20),
          primaryContent: this.getContentColor(ColorUtils.lighten(color, 20)),
        };
      case "darker":
        return {
          primary: ColorUtils.darken(color, 20),
          primaryContent: this.getContentColor(ColorUtils.darken(color, 20)),
        };
      case "muted":
        return {
          primary: ColorUtils.adjustSaturation(color, -30),
          primaryContent: this.getContentColor(
            ColorUtils.adjustSaturation(color, -30)
          ),
        };
      case "vivid":
        return {
          primary: ColorUtils.adjustSaturation(color, 30),
          primaryContent: this.getContentColor(
            ColorUtils.adjustSaturation(color, 30)
          ),
        };
    }
  }

  /**
   * Creates a state-based override
   */
  static createStateOverride(
    baseColor: string,
    state: "hover" | "active" | "disabled"
  ): ThemeOverride {
    switch (state) {
      case "hover":
        return {
          colors: {
            primary: ColorUtils.lighten(baseColor, 10),
            primaryContent: this.getContentColor(
              ColorUtils.lighten(baseColor, 10)
            ),
            surface: ColorUtils.adjustAlpha(baseColor, 0.1),
          },
        };
      case "active":
        return {
          colors: {
            primary: ColorUtils.darken(baseColor, 10),
            primaryContent: this.getContentColor(
              ColorUtils.darken(baseColor, 10)
            ),
            surface: ColorUtils.adjustAlpha(baseColor, 0.2),
          },
        };
      case "disabled":
        return {
          colors: {
            primary: ColorUtils.adjustSaturation(baseColor, -50),
            primaryContent: this.getContentColor(
              ColorUtils.adjustSaturation(baseColor, -50)
            ),
            surface: ColorUtils.adjustAlpha(baseColor, 0.05),
          },
        };
    }
  }

  /**
   * Creates shadow-based overrides for elevation
   */
  static createElevation(level: 0 | 1 | 2 | 3 | 4): ThemeOverride {
    const elevationMap = {
      0: { alpha: 0, y: 0 },
      1: { alpha: 0.05, y: 2 },
      2: { alpha: 0.08, y: 4 },
      3: { alpha: 0.12, y: 8 },
      4: { alpha: 0.16, y: 16 },
    };

    const { alpha, y } = elevationMap[level];

    return {
      colors: {
        surface: ColorUtils.adjustAlpha("#000000", alpha),
      },
    };
  }

  /**
   * Creates responsive typography overrides
   */
  static createResponsiveTypography(
    breakpoint: "small" | "medium" | "large"
  ): ThemeOverride {
    const scaleMap = {
      small: 0.8,
      medium: 1,
      large: 1.2,
    };

    const scale = scaleMap[breakpoint];

    return {
      typography: {
        fontSize: {
          xs: 12 * scale,
          sm: 14 * scale,
          md: 16 * scale,
          lg: 20 * scale,
          xl: 24 * scale,
        },
        lineHeight: {
          xs: 16 * scale,
          sm: 20 * scale,
          md: 24 * scale,
          lg: 28 * scale,
          xl: 32 * scale,
        },
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
