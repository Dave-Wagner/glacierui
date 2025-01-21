/**
 * @module constants/colorWords
 * @description Color word mappings and relationships for theme generation and color parsing
 */

/**
 * Represents a color category in the system
 */
export type ColorCategory = "primary" | "neutral" | "accent" | "semantic";

/**
 * Represents a named color with metadata and variants
 *
 * @property hex - The hexadecimal color value
 * @property category - The color's category in the system
 * @property variants - Optional array of color name variants
 */
export interface ColorWord {
  /** Hexadecimal color value */
  hex: string;
  /** Color category */
  category: ColorCategory;
  /** Alternative names for the color */
  variants?: string[];
}

/**
 * System color mapping with metadata and variants
 *
 * @example
 * ```typescript
 * // Get a color's hex value
 * const redHex = colorWords.red.hex; // '#FF0000'
 *
 * // Check a color's category
 * const isAccent = colorWords.purple.category === 'accent'; // true
 *
 * // Look up color variants
 * const blueVariants = colorWords.blue.variants; // ['azure', 'sapphire', 'navy']
 * ```
 */
export const colorWords: Record<string, ColorWord> = {
  // Primary Colors
  red: {
    hex: "#FF0000",
    category: "primary",
    variants: ["crimson", "scarlet", "ruby", "maroon", "burgundy"],
  },
  blue: {
    hex: "#0000FF",
    category: "primary",
    variants: ["azure", "sapphire", "navy", "cobalt", "indigo"],
  },
  green: {
    hex: "#00FF00",
    category: "primary",
    variants: ["emerald", "forest", "lime", "sage", "olive"],
  },

  // Neutral Colors
  gray: {
    hex: "#808080",
    category: "neutral",
    variants: ["silver", "slate", "charcoal", "ash", "graphite"],
  },
  white: {
    hex: "#FFFFFF",
    category: "neutral",
    variants: ["snow", "ivory", "pearl"],
  },
  black: {
    hex: "#000000",
    category: "neutral",
    variants: ["onyx", "ebony", "jet"],
  },

  // Accent Colors
  purple: {
    hex: "#800080",
    category: "accent",
    variants: ["violet", "lavender", "plum", "mauve", "amethyst"],
  },
  orange: {
    hex: "#FFA500",
    category: "accent",
    variants: ["coral", "peach", "amber", "tangerine", "rust"],
  },
  pink: {
    hex: "#FFC0CB",
    category: "accent",
    variants: ["rose", "magenta", "fuchsia", "salmon"],
  },
  yellow: {
    hex: "#FFFF00",
    category: "accent",
    variants: ["gold", "lemon", "mustard", "honey"],
  },
  brown: {
    hex: "#A52A2A",
    category: "neutral",
    variants: ["chocolate", "coffee", "sienna", "mahogany", "bronze"],
  },
  teal: {
    hex: "#008080",
    category: "accent",
    variants: ["turquoise", "aqua", "cyan", "seafoam"],
  },
};

/**
 * Finds a color's hexadecimal value from a word or its variants
 *
 * @param word - The color name or variant to look up
 * @returns The hexadecimal color value or null if not found
 *
 * @example
 * ```typescript
 * // Direct color lookup
 * const red = findColorByWord('red'); // '#FF0000'
 *
 * // Variant lookup
 * const navy = findColorByWord('navy'); // '#0000FF'
 *
 * // Case insensitive
 * const white = findColorByWord('WHITE'); // '#FFFFFF'
 *
 * // Unknown color
 * const unknown = findColorByWord('notacolor'); // null
 * ```
 */
export function findColorByWord(word: string): string | null {
  const normalizedWord = word.toLowerCase().trim();

  // Direct match
  if (colorWords[normalizedWord]) {
    return colorWords[normalizedWord].hex;
  }

  // Check variants
  for (const [color, data] of Object.entries(colorWords)) {
    if (data.variants?.includes(normalizedWord)) {
      return data.hex;
    }
  }

  return null;
}
