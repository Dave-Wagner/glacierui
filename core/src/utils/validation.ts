// core/src/utils/validation.ts
import { Theme, ThemeColors } from "../themes/types";
import { ThemeOverride, ColorOverride } from "./override";
import { ColorUtils } from "../utils/colorUtils";

interface ValidationError {
  path: string[];
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates theme overrides and ensures color accessibility
 */
export class ThemeValidator {
  /**
   * Validates a complete theme override
   */
  static validateOverride(override: ThemeOverride): ValidationResult {
    const errors: ValidationError[] = [];

    // Validate structure
    errors.push(...this.validateStructure(override));

    // Validate colors if present
    if (override.colors) {
      errors.push(...this.validateColors(override.colors));
    }

    // Validate accessibility
    if (override.colors) {
      errors.push(...this.validateAccessibility(override.colors));
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates theme structure
   */
  private static validateStructure(override: ThemeOverride): ValidationError[] {
    const errors: ValidationError[] = [];
    const allowedKeys: (keyof Theme)[] = ["colors", "spacing", "typography"];

    Object.keys(override).forEach((key) => {
      if (!allowedKeys.includes(key as keyof Theme)) {
        errors.push({
          path: [key],
          message: `Invalid theme key: ${key}`,
        });
      }
    });

    return errors;
  }

  /**
   * Validates color values
   */
  private static validateColors(colors: ColorOverride): ValidationError[] {
    const errors: ValidationError[] = [];
    const allowedKeys: (keyof ThemeColors)[] = [
      "primary",
      "primaryContent",
      "secondary",
      "secondaryContent",
      "accent",
      "accentContent",
      "background",
      "backgroundAlt",
      "backgroundContent",
      "surface",
      "surfaceContent",
      "success",
      "successContent",
      "warning",
      "warningContent",
      "error",
      "errorContent",
      "info",
      "infoContent",
      "text",
      "textAlt",
      "textMuted",
    ];

    Object.entries(colors).forEach(([key, value]) => {
      if (!allowedKeys.includes(key as keyof ThemeColors)) {
        errors.push({
          path: ["colors", key],
          message: `Invalid color key: ${key}`,
        });
      }

      if (typeof value === "string" && !this.isValidColor(value)) {
        errors.push({
          path: ["colors", key],
          message: `Invalid color value: ${value}`,
        });
      }
    });

    return errors;
  }

  /**
   * Validates color accessibility
   */
  private static validateAccessibility(
    colors: ColorOverride
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check content colors against their backgrounds
    const pairs: [keyof ThemeColors, keyof ThemeColors][] = [
      ["primaryContent", "primary"],
      ["secondaryContent", "secondary"],
      ["accentContent", "accent"],
      ["text", "background"],
      ["textAlt", "backgroundAlt"],
      ["successContent", "success"],
      ["warningContent", "warning"],
      ["errorContent", "error"],
      ["infoContent", "info"],
    ];

    pairs.forEach(([content, background]) => {
      if (colors[content] && colors[background]) {
        const ratio = ColorUtils.getContrastRatio(
          colors[content] as string,
          colors[background] as string
        );

        if (ratio < 4.5) {
          // WCAG AA standard
          errors.push({
            path: ["colors", content],
            message: `Insufficient contrast (${ratio.toFixed(
              2
            )}) with ${background}`,
          });
        }
      }
    });

    return errors;
  }

  /**
   * Checks if a color value is valid
   */
  private static isValidColor(color: string): boolean {
    return (
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color) ||
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/.test(color)
    );
  }
}
