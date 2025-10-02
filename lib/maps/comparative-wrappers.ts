// Wrapper functions to standardize map function signatures for comparative analysis

import { calculateLogisticMap } from './logistic';
import { calculateHenonMap } from './henon';
import { calculateStandardMap } from './standard';
import { calculateTentMap } from './tent';
import { calculateBakersMap } from './bakers';
import { calculateArnoldMap } from './arnold';
import { calculateIkedaMap } from './ikeda';
import { calculateTinkerbellMap } from './tinkerbell';
import { calculateDuffingMap } from './duffing';

// Standard wrapper function for maps that already match the expected signature
export const calculateLogisticMapWrapper = (params: any, iterations: number) => {
  return calculateLogisticMap(params.r || 3.8, params.x0 || 0.5, iterations);
};

export const calculateHenonMapWrapper = (params: any, iterations: number) => {
  return calculateHenonMap(params.a || 1.4, params.b || 0.3, params.x0 || 0.1, params.y0 || 0.1, iterations);
};

export const calculateStandardMapWrapper = (params: any, iterations: number) => {
  return calculateStandardMap(params.K || 1.0, params.theta0 || 0.1, params.p0 || 0.1, iterations);
};

export const calculateTentMapWrapper = (params: any, iterations: number) => {
  return calculateTentMap(params.alpha || 1.2, params.x0 || 0.5, iterations);
};

export const calculateBakersMapWrapper = (params: any, iterations: number) => {
  return calculateBakersMap({ x: params.x0 || 0.1, y: params.y0 || 0.1 }, iterations);
};

export const calculateArnoldMapWrapper = (params: any, iterations: number) => {
  return calculateArnoldMap({ x: params.x0 || 0.1, y: params.y0 || 0.1 }, iterations);
};

export const calculateIkedaMapWrapper = (params: any, iterations: number) => {
  return calculateIkedaMap(
    { x: params.x0 || 0.1, y: params.y0 || 0.1 },
    { a: params.a || 0.9, b: params.b || 0.9, c: params.c || 0.4, d: params.d || 6.0 },
    iterations
  );
};

export const calculateTinkerbellMapWrapper = (params: any, iterations: number) => {
  return calculateTinkerbellMap(
    { x: params.x0 || 0.1, y: params.y0 || 0.1 },
    { a: params.a || 0.9, b: params.b || -0.6, c: params.c || 2.0, d: params.d || 0.5 },
    iterations
  );
};

export const calculateDuffingMapWrapper = (params: any, iterations: number) => {
  return calculateDuffingMap(
    { x: params.x0 || 0.1, y: params.y0 || 0.1 },
    { a: params.a || 2.75, b: params.b || 0.2 },
    iterations
  );
};