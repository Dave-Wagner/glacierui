import { TransitionConfig } from './types';

export const defaultTransition: TransitionConfig = {
  duration: 200,
  timing: 'ease',
  properties: [
    'background-color',
    'border-color',
    'color',
    'fill',
    'stroke',
    'box-shadow'
  ]
};