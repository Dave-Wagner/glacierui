/**
 * @module themes/types
 * @description Common theme type definitions
 */

export type ThemeName = 'nord' | 'accessible' | 'system';
export interface ThemeColors {
    // Main colors
    primary: string;
    primaryContent: string;
    secondary: string;
    secondaryContent: string;
    accent: string;
    accentContent: string;
    neutral: string;
    neutralContent: string;
  
    // Background variations
    base100: string;    // Default background
    base200: string;    // Slightly darker
    base300: string;    // Even darker
    baseContent: string; // Default text on base colors
  
    // State colors
    info: string;
    infoContent: string;
    success: string;
    successContent: string;
    warning: string;
    warningContent: string;
    error: string;
    errorContent: string;
  }
  
  export interface Theme {
    name: string;
    colors: ThemeColors;
  }