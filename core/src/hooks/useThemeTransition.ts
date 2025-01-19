// core/src/hooks/useThemeTransition.ts
import { useRef } from 'react';
import { Platform, Animated } from 'react-native';
import { useTheme } from './useTheme';
import {
    TransitionConfig,
    defaultTransition,
    createWebTransitionStyle
} from '../utils/transitions';

interface ThemeTransitionResult {
    /**
     * Current animation value, platform specific
     */
    value: number | Animated.Value;

    /**
     * Style object for the transition
     */
    style: Record<string, unknown>;

    /**
     * Whether the theme is currently transitioning
     */
    isTransitioning: boolean;
}

export const useThemeTransition = (
    config: TransitionConfig = defaultTransition
): ThemeTransitionResult => {
    const { theme, isTransitioning } = useTheme();
    const animation = useRef(
        Platform.OS === 'web' ? 1 : new Animated.Value(1)
    ).current;

    const transitionStyle = Platform.OS === 'web'
        ? { transition: createWebTransitionStyle(config) }
        : { opacity: animation };

    return {
        value: animation,
        style: transitionStyle,
        isTransitioning
    };
};