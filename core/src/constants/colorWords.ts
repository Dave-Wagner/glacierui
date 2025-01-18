/**
 * @module constants/colorWords
 * @description Color word mappings and relationships
 * @version 0.2.0
 */

/**
 * @interface ColorWord
 * @description Represents a named color with metadata
 */
interface ColorWord {
    hex: string;
    category: 'primary' | 'neutral' | 'accent' | 'semantic';
    variants?: string[];
  }
  
  /**
   * @constant colorWords
   * @description Mapping of color names to their hex values and metadata
   */
  export const colorWords: Record<string, ColorWord> = {
    // Primary Colors
    red: {
      hex: '#FF0000',
      category: 'primary',
      variants: ['crimson', 'scarlet', 'ruby'],
    },
    blue: {
      hex: '#0000FF',
      category: 'primary',
      variants: ['azure', 'sapphire', 'navy'],
    },
    green: {
      hex: '#00FF00',
      category: 'primary',
      variants: ['emerald', 'forest', 'lime'],
    },
    
    // Neutral Colors
    gray: {
      hex: '#808080',
      category: 'neutral',
      variants: ['silver', 'slate', 'charcoal'],
    },
    white: {
      hex: '#FFFFFF',
      category: 'neutral',
    },
    black: {
      hex: '#000000',
      category: 'neutral',
    },
    
    // Accent Colors
    purple: {
      hex: '#800080',
      category: 'accent',
      variants: ['violet', 'lavender', 'plum'],
    },
    orange: {
      hex: '#FFA500',
      category: 'accent',
      variants: ['coral', 'peach', 'amber'],
    },
    // Add more colors as needed...
  };
  
  /**
   * @function findColorByWord
   * @description Finds a color hex value from a word or its variants
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