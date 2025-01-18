/**
 * @module themes/nord
 * @description Nord theme implementation
 */

import { Theme } from './types';

export const nord: Theme = {
  name: 'nord',
  colors: {
    // Main colors
    primary: '#5E81AC',     // Nord Frost 10
    primaryContent: '#ECEFF4',
    secondary: '#81A1C1',   // Nord Frost 9
    secondaryContent: '#ECEFF4',
    accent: '#88C0D0',      // Nord Frost 8
    accentContent: '#2E3440',
    neutral: '#4C566A',     // Nord Polar Night 3
    neutralContent: '#ECEFF4',

    // Background variations
    base100: '#2E3440',     // Nord Polar Night 0
    base200: '#3B4252',     // Nord Polar Night 1
    base300: '#434C5E',     // Nord Polar Night 2
    baseContent: '#ECEFF4', // Nord Snow Storm 6

    // State colors
    info: '#81A1C1',        // Nord Frost 9
    infoContent: '#ECEFF4',
    success: '#A3BE8C',     // Nord Aurora Green
    successContent: '#2E3440',
    warning: '#EBCB8B',     // Nord Aurora Yellow
    warningContent: '#2E3440',
    error: '#BF616A',       // Nord Aurora Red
    errorContent: '#ECEFF4'
  }
};