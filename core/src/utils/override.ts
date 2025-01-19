import { Theme, ThemeColors } from '../themes/types';

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ThemeOverride = DeepPartial<Theme>;
export type ColorOverride = DeepPartial<ThemeColors>;

/**
 * Deep merges a theme override with the base theme
 * @param base - Base theme
 * @param override - Theme override
 * @returns Merged theme
 */
export function mergeTheme(base: Theme, override: ThemeOverride): Theme {
    return deepMerge(base, override) as Theme;
}

/**
 * Deep merges two objects
 * @private
 */
function deepMerge(target: any, source: any): any {
    if (!isObject(target) || !isObject(source)) {
        return source;
    }

    Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
            if (!(key in target)) {
                Object.assign(target, { [key]: {} });
            }
            deepMerge(target[key], source[key]);
        } else {
            Object.assign(target, { [key]: source[key] });
        }
    });

    return target;
}

/**
 * Type guard for objects
 * @private
 */
function isObject(item: any): item is Record<string, unknown> {
    return item && typeof item === 'object' && !Array.isArray(item);
}