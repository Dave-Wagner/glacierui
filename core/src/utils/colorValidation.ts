/**
 * @module utils/colorValidation
 * @description Validation utilities for color words and hex values
 */

import { ColorWord, ColorCategory, colorWords } from "../constants/colorWords";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface ColorValidationError {
  type: "hex" | "category" | "variant" | "duplicate";
  message: string;
}

/**
 * Validates a hex color value
 *
 * @param hex - The hex color value to validate
 * @returns true if the hex value is valid
 */
export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Validates a complete color word entry
 *
 * @param color - The color word entry to validate
 * @returns Validation result with any errors
 */
export function validateColorWord(color: ColorWord): ValidationResult {
  const errors: string[] = [];

  // Validate hex
  if (!isValidHex(color.hex)) {
    errors.push(`Invalid hex value: ${color.hex}`);
  }

  // Validate category
  const validCategories: ColorCategory[] = [
    "primary",
    "neutral",
    "accent",
    "semantic",
  ];
  if (!validCategories.includes(color.category)) {
    errors.push(`Invalid category: ${color.category}`);
  }

  // Validate variants
  if (color.variants) {
    const duplicates = color.variants.filter(
      (variant, index) => color.variants!.indexOf(variant) !== index
    );
    if (duplicates.length > 0) {
      errors.push(`Duplicate variants found: ${duplicates.join(", ")}`);
    }

    // Check for variant collisions with other color names
    const existingColorNames = Object.keys(colorWords);
    const collisions = color.variants.filter((variant) =>
      existingColorNames.includes(variant.toLowerCase())
    );
    if (collisions.length > 0) {
      errors.push(
        `Variants collide with existing color names: ${collisions.join(", ")}`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a color word before adding it to the system
 *
 * @param name - The name of the color
 * @param color - The color word entry
 * @returns Validation result with any errors
 */
export function validateNewColor(
  name: string,
  color: ColorWord
): ValidationResult {
  const errors: string[] = [];

  // Check name format
  if (!/^[a-z]+$/.test(name)) {
    errors.push("Color name must contain only lowercase letters");
  }

  // Check if name already exists
  if (name in colorWords) {
    errors.push(`Color name "${name}" already exists`);
  }

  // Validate the color word itself
  const colorValidation = validateColorWord(color);
  errors.push(...colorValidation.errors);

  return {
    isValid: errors.length === 0,
    errors,
  };
}
