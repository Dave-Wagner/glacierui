/**
 * @module types/color
 * @description Type definitions for the color system
 */

/**
 * @interface ColorDepth
 * @description Represents different shades of a color from lightest (50) to darkest (900)
 */
export interface ColorDepth {
    /** Lightest shade - typically used for backgrounds */
    50: string;
    /** Very light shade - commonly used for hover states on light backgrounds */
    100: string;
    /** Light shade - used for subtle backgrounds */
    200: string;
    /** Medium-light shade - used for borders and dividers */
    300: string;
    /** Medium shade - used for secondary text */
    400: string;
    /** Base shade - primary brand color */
    500: string;
    /** Medium-dark shade - used for hover states */
    600: string;
    /** Dark shade - used for active states */
    700: string;
    /** Very dark shade - used for text on light backgrounds */
    800: string;
    /** Darkest shade - used for high contrast text */
    900: string;
  }
  
  /**
   * @interface SemanticColor
   * @description Standard semantic color roles
   */
  export interface SemanticColor {
    /** Main color for primary actions */
    base: string;
    /** Lighter version for hover states */
    light: string;
    /** Darker version for active states */
    dark: string;
    /** Very light version for backgrounds */
    bg: string;
    /** Contrasting text color */
    text: string;
  }
  
  /**
   * @interface AccessibilityInfo
   * @description WCAG contrast and accessibility information
   */
  export interface AccessibilityInfo {
    /** Contrast ratio with white */
    contrastWithWhite: number;
    /** Contrast ratio with black */
    contrastWithBlack: number;
    /** Whether the color passes WCAG AA for normal text */
    passesAA: boolean;
    /** Whether the color passes WCAG AAA for normal text */
    passesAAA: boolean;
  }/**
 * @module types/color
 * @description Type definitions for the color system
 */

/**
 * @interface ColorDepth
 * @description Represents different shades of a color from lightest (50) to darkest (900)
 */
export interface ColorDepth {
    /** Lightest shade - typically used for backgrounds */
    50: string;
    /** Very light shade - commonly used for hover states on light backgrounds */
    100: string;
    /** Light shade - used for subtle backgrounds */
    200: string;
    /** Medium-light shade - used for borders and dividers */
    300: string;
    /** Medium shade - used for secondary text */
    400: string;
    /** Base shade - primary brand color */
    500: string;
    /** Medium-dark shade - used for hover states */
    600: string;
    /** Dark shade - used for active states */
    700: string;
    /** Very dark shade - used for text on light backgrounds */
    800: string;
    /** Darkest shade - used for high contrast text */
    900: string;
  }
  
  /**
   * @interface SemanticColor
   * @description Standard semantic color roles
   */
  export interface SemanticColor {
    /** Main color for primary actions */
    base: string;
    /** Lighter version for hover states */
    light: string;
    /** Darker version for active states */
    dark: string;
    /** Very light version for backgrounds */
    bg: string;
    /** Contrasting text color */
    text: string;
  }
  
  /**
   * @interface AccessibilityInfo
   * @description WCAG contrast and accessibility information
   */
  export interface AccessibilityInfo {
    /** Contrast ratio with white */
    contrastWithWhite: number;
    /** Contrast ratio with black */
    contrastWithBlack: number;
    /** Whether the color passes WCAG AA for normal text */
    passesAA: boolean;
    /** Whether the color passes WCAG AAA for normal text */
    passesAAA: boolean;
  }