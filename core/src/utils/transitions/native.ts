import { Animated } from 'react-native';
import { TransitionConfig } from './types';

/**
 * Creates a native transition animation.
 *
 * The animation transitions from the current value of `animation` to 0 and then
 * back to 1 over the course of `config.duration` milliseconds.
 *
 * @param animation The animation value to transition.
 * @param config The transition configuration.
 *
 * @returns A promise that resolves when the transition is finished.
 */
export const createNativeTransition = (
    animation: Animated.Value,
    config: TransitionConfig
): Promise<void> => {
    return new Promise((resolve) => {
        Animated.sequence([
            Animated.timing(animation, {
                toValue: 0,
                duration: config.duration / 2,
                useNativeDriver: true
            }),
            Animated.timing(animation, {
                toValue: 1,
                duration: config.duration / 2,
                useNativeDriver: true
            })
        ]).start(() => resolve());
    });
};