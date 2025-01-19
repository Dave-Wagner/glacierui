export interface TransitionConfig {
    duration: number;
    timing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
    properties: string[];
}