/**
 * @module themes/accessible
 * @description High contrast accessible theme
 */

import { Theme } from './types';

export const accessible: Theme = {
  name: 'accessible',
  colors: {
    // Main colors with high contrast ratios (WCAG AAA)
    primary: '#0052CC',
    primaryContent: '#FFFFFF',
    secondary: '#006644',
    secondaryContent: '#FFFFFF',
    accent: '#5F2AB0',
    accentContent: '#FFFFFF',
    neutral: '#424242',
    neutralContent: '#FFFFFF',

    // Background variations
    base100: '#FFFFFF',
    base200: '#F5F5F5',
    base300: '#E0E0E0',
    baseContent: '#000000',

    // State colors
    info: '#0052CC',
    infoContent: '#FFFFFF',
    success: '#006644',
    successContent: '#FFFFFF',
    warning: '#B76E00',
    warningContent: '#FFFFFF',
    error: '#BE0000',
    errorContent: '#FFFFFF'
  }
};