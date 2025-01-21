/**
 * @module utils/colorWordUtils
 * @description Utility functions for working with color words
 */

import { ColorCategory, ColorWord, colorWords } from "../constants/colorWords";
import { validateColorWord } from "./colorValidation";

/**
 * Gets all colors of a specific category
 *
 * @param category - The category to filter by
 * @returns Array of color names in the category
 */
export function getColorsByCategory(category: ColorCategory): string[] {
  return Object.entries(colorWords)
    .filter(([_, color]) => color.category === category)
    .map(([name]) => name);
}

/**
 * Gets all variants of a color
 *
 * @param colorName - The base color name
 * @returns Array of variants or empty array if color not found
 */
export function getColorVariants(colorName: string): string[] {
  const color = colorWords[colorName.toLowerCase()];
  return color?.variants || [];
}

/**
 * Checks if a color name is a variant of another color
 *
 * @param variantName - The variant name to check
 * @returns The base color name or null if not found
 */
export function findBaseColor(variantName: string): string | null {
  const normalized = variantName.toLowerCase();

  for (const [colorName, color] of Object.entries(colorWords)) {
    if (color.variants?.includes(normalized)) {
      return colorName;
    }
  }

  return null;
}

/**
 * Finds related colors (same category)
 *
 * @param colorName - The color to find relations for
 * @returns Array of related color names
 */
export function findRelatedColors(colorName: string): string[] {
  const color = colorWords[colorName.toLowerCase()];
  if (!color) return [];

  return getColorsByCategory(color.category).filter(
    (name) => name !== colorName
  );
}
