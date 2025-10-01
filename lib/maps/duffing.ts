// src/lib/maps/duffing.ts
export interface DuffingPoint {
  x: number;
  y: number;
}

/**
 * Calculate a single iteration of the Duffing Map
 * Discretized version of the Duffing oscillator with double-well potential
 * Equations:
 * x_{n+1} = y_n
 * y_{n+1} = -b·y_n + a·x_n - x_n³
 *
 * @param point Current point {x, y}
 * @param params Duffing parameters {a, b}
 * @returns New point after one iteration
 */
export function calculateDuffingIteration(
  point: DuffingPoint,
  params: { a: number; b: number }
): DuffingPoint {
  const { x, y } = point;
  const { a, b } = params;

  const newX = y;
  const newY = -b * y + a * x - x * x * x;

  return { x: newX, y: newY };
}

/**
 * Calculate the Duffing Map trajectory for a given number of iterations
 * @param initialPoint Initial point {x, y}
 * @param params Duffing parameters
 * @param iterations Number of iterations (default: 1000)
 * @param transient Transient iterations to discard (default: 100)
 * @returns Array of points representing the trajectory
 */
export function calculateDuffingMap(
  initialPoint: DuffingPoint,
  params: { a: number; b: number },
  iterations: number = 1000,
  transient: number = 100
): DuffingPoint[] {
  const points: DuffingPoint[] = [];
  let currentPoint = initialPoint;

  // Transient iterations
  for (let i = 0; i < transient; i++) {
    currentPoint = calculateDuffingIteration(currentPoint, params);
  }

  // Collect points
  for (let i = 0; i < iterations; i++) {
    points.push(currentPoint);
    currentPoint = calculateDuffingIteration(currentPoint, params);
  }

  return points;
}

/**
 * Generate Duffing attractor with double-well dynamics
 * @param params Duffing parameters
 * @param iterations Number of iterations (default: 2000)
 * @returns Array of points forming the attractor
 */
export function calculateDuffingAttractor(
  params: { a: number; b: number },
  iterations: number = 2000
): DuffingPoint[] {
  const initialPoint: DuffingPoint = { x: 0.1, y: 0.1 };
  return calculateDuffingMap(initialPoint, params, iterations, 500);
}

/**
 * Calculate the potential energy landscape for the Duffing Map
 * V(x) = -0.5·a·x² + 0.25·x⁴
 * @param a Parameter a
 * @param xRange Range of x values
 * @param numPoints Number of points to calculate
 * @returns Array of {x, potential} points
 */
export function calculateDuffingPotential(
  a: number,
  xRange: { min: number; max: number } = { min: -2, max: 2 },
  numPoints: number = 200
): { x: number; potential: number }[] {
  const points: { x: number; potential: number }[] = [];
  const step = (xRange.max - xRange.min) / numPoints;

  for (let i = 0; i <= numPoints; i++) {
    const x = xRange.min + i * step;
    const potential = -0.5 * a * x * x + 0.25 * x * x * x * x;
    points.push({ x, potential });
  }

  return points;
}

/**
 * Calculate bifurcation diagram for the Duffing Map
 * @param param Parameter to vary ('a' or 'b')
 * @param paramRange Range of parameter values
 * @param fixedParams Fixed parameters
 * @param iterations Number of iterations
 * @returns Bifurcation data points
 */
export function calculateDuffingBifurcation(
  param: 'a' | 'b' = 'a',
  paramRange: { min: number; max: number; step: number },
  fixedParams: { a?: number; b?: number },
  iterations: number = 1000
): { paramValue: number; x: number; y: number }[] {
  const points: { paramValue: number; x: number; y: number }[] = [];

  for (let value = paramRange.min; value <= paramRange.max; value += paramRange.step) {
    const params = { ...fixedParams, [param]: value } as { a: number; b: number };
    const trajectory = calculateDuffingMap({ x: 0.1, y: 0.1 }, params, iterations, 500);

    // Sample points from trajectory
    for (let i = 0; i < trajectory.length; i += 20) {
      points.push({
        paramValue: value,
        x: trajectory[i].x,
        y: trajectory[i].y
      });
    }
  }

  return points;
}

/**
 * Calculate basins of attraction for the two wells
 * @param params Duffing parameters
 * @param gridSize Size of the grid to test (default: 100)
 * @param bounds Spatial bounds
 * @returns 2D array indicating which well each point belongs to
 */
export function calculateDuffingBasins(
  params: { a: number; b: number },
  gridSize: number = 100,
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number } = { xMin: -2, xMax: 2, yMin: -2, yMax: 2 }
): number[][] {
  const basins: number[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
  const xStep = (bounds.xMax - bounds.xMin) / gridSize;
  const yStep = (bounds.yMax - bounds.yMin) / gridSize;

  // Find the approximate centers of the two wells
  const wellCenters = [
    { x: -Math.sqrt(params.a), y: 0 },
    { x: Math.sqrt(params.a), y: 0 }
  ];

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const initialPoint: DuffingPoint = {
        x: bounds.xMin + i * xStep,
        y: bounds.yMin + j * yStep
      };

      // Iterate to see which well it converges to
      let currentPoint = initialPoint;
      let basinId = 0;

      for (let iter = 0; iter < 1000; iter++) {
        currentPoint = calculateDuffingIteration(currentPoint, params);

        // Check if point escapes
        if (Math.abs(currentPoint.x) > 10 || Math.abs(currentPoint.y) > 10) {
          basinId = -1; // Escapes
          break;
        }

        // After transients, check which well it's closest to
        if (iter > 500) {
          const distToWell1 = Math.sqrt(
            Math.pow(currentPoint.x - wellCenters[0].x, 2) +
            Math.pow(currentPoint.y - wellCenters[0].y, 2)
          );
          const distToWell2 = Math.sqrt(
            Math.pow(currentPoint.x - wellCenters[1].x, 2) +
            Math.pow(currentPoint.y - wellCenters[1].y, 2)
          );

          if (distToWell1 < 0.5) {
            basinId = 1; // Left well
            break;
          } else if (distToWell2 < 0.5) {
            basinId = 2; // Right well
            break;
          }
        }
      }

      basins[j][i] = basinId;
    }
  }

  return basins;
}

/**
 * Calculate Lyapunov exponents for the Duffing Map
 * @param params Duffing parameters
 * @param iterations Number of iterations (default: 5000)
 * @returns Lyapunov exponents λ₁, λ₂
 */
export function calculateDuffingLyapunovExponents(
  params: { a: number; b: number },
  iterations: number = 5000
): { lambda1: number; lambda2: number } {
  let sum1 = 0;
  let sum2 = 0;
  let currentPoint: DuffingPoint = { x: 0.1, y: 0.1 };

  // Jacobian matrix for Duffing Map
  const calculateJacobian = (point: DuffingPoint): number[][] => {
    const { x } = point;
    const { a, b } = params;

    const j11 = 0; // ∂x'/∂x = 0
    const j12 = 1; // ∂x'/∂y = 1
    const j21 = a - 3 * x * x; // ∂y'/∂x = a - 3x²
    const j22 = -b; // ∂y'/∂y = -b

    return [[j11, j12], [j21, j22]];
  };

  let J1 = [[1, 0], [0, 1]]; // Identity matrix

  for (let i = 0; i < iterations; i++) {
    const J = calculateJacobian(currentPoint);

    // Multiply J1 by J
    const newJ1 = [
      [J1[0][0] * J[0][0] + J1[0][1] * J[1][0], J1[0][0] * J[0][1] + J1[0][1] * J[1][1]],
      [J1[1][0] * J[0][0] + J1[1][1] * J[1][0], J1[1][0] * J[0][1] + J1[1][1] * J[1][1]]
    ];

    J1[0] = newJ1[0];
    J1[1] = newJ1[1];

    // QR decomposition for numerical stability (simplified)
    const norm1 = Math.sqrt(J1[0][0] * J1[0][0] + J1[1][0] * J1[1][0]);
    const norm2 = Math.sqrt(J1[0][1] * J1[0][1] + J1[1][1] * J1[1][1]);

    if (norm1 > 0) {
      J1[0][0] /= norm1;
      J1[1][0] /= norm1;
      sum1 += Math.log(norm1);
    }

    if (norm2 > 0) {
      J1[0][1] /= norm2;
      J1[1][1] /= norm2;
      sum2 += Math.log(norm2);
    }

    currentPoint = calculateDuffingIteration(currentPoint, params);
  }

  return {
    lambda1: sum1 / iterations,
    lambda2: sum2 / iterations
  };
}

/**
 * Find fixed points of the Duffing Map
 * @param params Duffing parameters
 * @returns Array of fixed points
 */
export function calculateDuffingFixedPoints(
  params: { a: number; b: number }
): DuffingPoint[] {
  const { a, b } = params;
  const fixedPoints: DuffingPoint[] = [];

  // Fixed points satisfy: x = y, y = -b·y + a·x - x³
  // This gives us: x = -b·x + a·x - x³
  // Simplifying: 0 = -(b+1)·x + a·x - x³
  // 0 = x·(a - b - 1 - x²)

  // Solution 1: x = 0, y = 0
  fixedPoints.push({ x: 0, y: 0 });

  // Solution 2: x² = a - b - 1
  const discriminant = a - b - 1;
  if (discriminant > 0) {
    const x1 = Math.sqrt(discriminant);
    const x2 = -Math.sqrt(discriminant);

    fixedPoints.push({ x: x1, y: x1 });
    fixedPoints.push({ x: x2, y: x2 });
  }

  return fixedPoints;
}

/**
 * Calculate energy landscape and trajectories
 * @param params Duffing parameters
 * @param initialConditions Array of initial conditions
 * @param iterations Number of iterations
 * @returns Array of trajectories with energy information
 */
export function calculateDuffingEnergyTrajectories(
  params: { a: number; b: number },
  initialConditions: DuffingPoint[],
  iterations: number = 500
): {
    trajectory: DuffingPoint[];
    energy: number[];
    well: 'left' | 'right' | 'center' | 'escape';
  }[] {
  return initialConditions.map(initialPoint => {
    const trajectory = calculateDuffingMap(initialPoint, params, iterations, 0);
    const energy: number[] = [];

    trajectory.forEach(point => {
      // Kinetic energy: KE = 0.5·y²
      // Potential energy: PE = -0.5·a·x² + 0.25·x⁴
      const kineticEnergy = 0.5 * point.y * point.y;
      const potentialEnergy = -0.5 * params.a * point.x * point.x + 0.25 * point.x * point.x * point.x * point.x;
      energy.push(kineticEnergy + potentialEnergy);
    });

    // Determine which well the trajectory ends up in
    const finalPoint = trajectory[trajectory.length - 1];
    let well: 'left' | 'right' | 'center' | 'escape';

    if (Math.abs(finalPoint.x) > 3) {
      well = 'escape';
    } else if (finalPoint.x < -0.5) {
      well = 'left';
    } else if (finalPoint.x > 0.5) {
      well = 'right';
    } else {
      well = 'center';
    }

    return { trajectory, energy, well };
  });
}

/**
 * Generate interesting Duffing parameter sets
 * @returns Array of parameter configurations with descriptions
 */
export function getInterestingDuffingParameters(): {
  name: string;
  params: { a: number; b: number };
  description: string;
}[] {
  return [
    {
      name: "Classic Bistable",
      params: { a: 1.0, b: 0.2 },
      description: "Classic double-well potential with clear bistable behavior"
    },
    {
      name: "Chaotic Regime",
      params: { a: 1.2, b: 0.3 },
      description: "Parameters producing chaotic dynamics in both wells"
    },
    {
      name: "Single Well Dominance",
      params: { a: 0.8, b: 0.1 },
      description: "One well dominates, reducing bistability"
    },
    {
      name: "Symmetric Wells",
      params: { a: 1.0, b: 0.0 },
      description: "Perfectly symmetric double-well potential"
    },
    {
      name: "High Damping",
      params: { a: 1.0, b: 0.5 },
      description: "High damping suppresses chaotic behavior"
    },
    {
      name: "Low Barrier",
      params: { a: 0.5, b: 0.2 },
      description: "Low barrier between wells allows easy transitions"
    }
  ];
}