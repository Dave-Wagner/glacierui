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

/**
 * Hook to generate a theme transition animation value and style.
 *
 * This hook provides a current animation value and style object that can be
 * used to animate a component between different theme values. The animation
 * value and style object are platform specific.
 *
 * @param config The transition configuration, with default values for duration,
 * timing, and properties. If not provided, the default transition configuration
 * is used.
 *
 * @returns An object with the following properties:
 *  - `value`: The current animation value, which is a number on web and an
 *    Animated.Value on native platforms.
 *  - `style`: A style object that can be used to animate a component.
 *  - `isTransitioning`: Whether the theme is currently transitioning.
 */
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