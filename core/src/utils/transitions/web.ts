import { TransitionConfig } from './types';

/**
 * Generates a CSS transition string for web platforms
 * @param config - Transition configuration
 * @returns CSS transition string
 */
export const createWebTransitionStyle = (config: TransitionConfig): string => {
    return config.properties
        .map(prop => `${prop} ${config.duration}ms ${config.timing}`)
        .join(', ');
};