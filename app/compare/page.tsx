'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as d3 from 'd3';

// Import all map calculation functions
import { calculateLogisticMap } from '@/lib/maps/logistic';
import { calculateHenonMap } from '@/lib/maps/henon';
import { calculateStandardMap } from '@/lib/maps/standard';
import { calculateTentMap } from '@/lib/maps/tent';
import { calculateBakersMap } from '@/lib/maps/bakers';
import { calculateArnoldMap } from '@/lib/maps/arnold';
import { calculateComplexQuadraticMap } from '@/lib/maps/complexQuadratic';
import { calculateIkedaMap } from '@/lib/maps/ikeda';
import { calculateTinkerbellMap } from '@/lib/maps/tinkerbell';
import { calculateDuffingMap } from '@/lib/maps/duffing';

interface MapData {
  name: string;
  id: string;
  calculate: (params: any, iterations: number) => any[];
  defaultParams: any;
  paramRanges: { [key: string]: { min: number; max: number; step: number } };
  description: string;
  dimension: number;
}

const COMPARISON_MAPS: MapData[] = [
  {
    name: 'Logistic Map',
    id: 'logistic',
    calculate: calculateLogisticMap,
    defaultParams: { r: 3.8, x0: 0.5 },
    paramRanges: {
      r: { min: 0, max: 4, step: 0.01 },
      x0: { min: 0, max: 1, step: 0.01 }
    },
    description: 'Classic 1D chaotic system showing period doubling route to chaos',
    dimension: 1
  },
  {
    name: 'Hénon Map',
    id: 'henon',
    calculate: calculateHenonMap,
    defaultParams: { a: 1.4, b: 0.3, x0: 0.1, y0: 0.1 },
    paramRanges: {
      a: { min: 0, max: 2, step: 0.01 },
      b: { min: 0, max: 1, step: 0.01 },
      x0: { min: -2, max: 2, step: 0.01 },
      y0: { min: -2, max: 2, step: 0.01 }
    },
    description: '2D dissipative system with strange attractor',
    dimension: 2
  },
  {
    name: 'Tent Map',
    id: 'tent',
    calculate: calculateTentMap,
    defaultParams: { alpha: 1.2, x0: 0.5 },
    paramRanges: {
      alpha: { min: 0.5, max: 2, step: 0.01 },
      x0: { min: 0, max: 1, step: 0.01 }
    },
    description: 'Piecewise linear map with exact chaos threshold',
    dimension: 1
  },
  {
    name: 'Ikeda Map',
    id: 'ikeda',
    calculate: calculateIkedaMap,
    defaultParams: { a: 0.9, b: 0.9, c: 0.4, d: 6.0 },
    paramRanges: {
      a: { min: 0, max: 1, step: 0.01 },
      b: { min: 0, max: 1, step: 0.01 },
      c: { min: 0, max: 1, step: 0.01 },
      d: { min: 0, max: 10, step: 0.1 }
    },
    description: 'Laser cavity dynamics with spiral attractors',
    dimension: 2
  },
  {
    name: 'Tinkerbell Map',
    id: 'tinkerbell',
    calculate: calculateTinkerbellMap,
    defaultParams: { a: 0.9, b: -0.6, c: 2.0, d: 0.5 },
    paramRanges: {
      a: { min: -1, max: 1, step: 0.01 },
      b: { min: -1, max: 1, step: 0.01 },
      c: { min: -2, max: 2, step: 0.01 },
      d: { min: -2, max: 2, step: 0.01 }
    },
    description: 'Polynomial map with multi-loop chaotic attractors',
    dimension: 2
  },
  {
    name: 'Duffing Map',
    id: 'duffing',
    calculate: calculateDuffingMap,
    defaultParams: { a: 2.75, b: 0.2, x0: 0.1, y0: 0.1 },
    paramRanges: {
      a: { min: 0, max: 4, step: 0.01 },
      b: { min: 0, max: 1, step: 0.01 },
      x0: { min: -2, max: 2, step: 0.01 },
      y0: { min: -2, max: 2, step: 0.01 }
    },
    description: 'Discretized double-well oscillator',
    dimension: 2
  }
];

type ComparisonMode = 'time-series' | 'phase-space' | 'bifurcation' | 'lyapunov';

const ComparativeAnalysis: React.FC = () => {
  const [selectedMaps, setSelectedMaps] = useState<string[]>(['logistic', 'henon']);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('time-series');
  const [iterations, setIterations] = useState(1000);
  const [syncParams, setSyncParams] = useState(false);
  const [sharedParam, setSharedParam] = useState('r');
  const [comparisonData, setComparisonData] = useState<{ [key: string]: any[] }>({});

  const calculateComparisonData = () => {
    const data: { [key: string]: any[] } = {};

    selectedMaps.forEach(mapId => {
      const map = COMPARISON_MAPS.find(m => m.id === mapId);
      if (map) {
        try {
          // For synchronized parameters, modify the default parameters
          const params = { ...map.defaultParams };
          if (syncParams && sharedParam in map.paramRanges) {
            // Use a common parameter value for comparison
            params[sharedParam] = 1.5; // Mid-range value
          }

          const result = map.calculate(params, iterations);
          // Validate the result
          if (Array.isArray(result) && result.length > 0) {
            data[mapId] = result;
          } else {
            console.warn(`Invalid result for ${map.name}:`, result);
            data[mapId] = [];
          }
        } catch (error) {
          console.error(`Error calculating ${map.name}:`, error);
          data[mapId] = [];
        }
      }
    });

    setComparisonData(data);
  };

  useEffect(() => {
    calculateComparisonData();
  }, [selectedMaps, comparisonMode, iterations, syncParams, sharedParam]);

  const renderTimeSeriesComparison = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {selectedMaps.map(mapId => {
          const map = COMPARISON_MAPS.find(m => m.id === mapId);
          const data = comparisonData[mapId] || [];

          return (
            <div key={mapId} className="bg-black/30 border border-cyan-500/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-3 neon-text-cyan">{map?.name}</h3>
              <div className="h-64">
                <svg width="100%" height="100%" className="border border-cyan-500/10 rounded">
                  {data.length > 0 && (
                    <g>
                      {/* Time series line */}
                      <path
                        d={`M ${data.map((d, i) => {
                          const value = d.x !== undefined ? d.x : (d.y !== undefined ? d.y : d);
                          const safeValue = isNaN(value) || value === null || value === undefined ? 0 : value;
                          const clampedValue = Math.max(-2, Math.min(2, safeValue)); // Clamp to reasonable range
                          return `${i * 100 / data.length},${256 - clampedValue * 100}`;
                        }).join(' L ')}`}
                        fill="none"
                        stroke="#00ffff"
                        strokeWidth="1"
                      />
                    </g>
                  )}
                </svg>
              </div>
              <p className="text-sm text-gray-400 mt-2">{map?.description}</p>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPhaseSpaceComparison = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {selectedMaps.map(mapId => {
          const map = COMPARISON_MAPS.find(m => m.id === mapId);
          const data = comparisonData[mapId] || [];

          // Only show phase space for 2D maps
          if (map?.dimension !== 2) {
            return (
              <div key={mapId} className="bg-black/30 border border-cyan-500/20 rounded-lg p-4 flex items-center justify-center">
                <p className="text-gray-400">Phase space not available for 1D maps</p>
              </div>
            );
          }

          return (
            <div key={mapId} className="bg-black/30 border border-cyan-500/20 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-3 neon-text-cyan">{map?.name}</h3>
              <div className="h-64">
                <svg width="100%" height="100%" className="border border-cyan-500/10 rounded">
                  {data.length > 0 && (
                    <g>
                      {/* Phase space trajectory */}
                      <path
                        d={`M ${data.map(d => {
                          const safeX = isNaN(d.x) || d.x === null || d.x === undefined ? 0 : Math.max(-2, Math.min(2, d.x));
                          const safeY = isNaN(d.y) || d.y === null || d.y === undefined ? 0 : Math.max(-2, Math.min(2, d.y));
                          return `${(safeX + 2) * 100},${(safeY + 2) * 100}`;
                        }).join(' L ')}`}
                        fill="none"
                        stroke="#00ffff"
                        strokeWidth="0.5"
                        opacity="0.8"
                      />
                    </g>
                  )}
                </svg>
              </div>
              <p className="text-sm text-gray-400 mt-2">{map?.description}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Comparative Analysis Framework
          </h1>
          <p className="text-gray-300 text-lg">
            Compare different chaotic systems side-by-side to understand their unique behaviors and characteristics
          </p>
        </div>

        {/* Controls */}
        <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Map Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-400">
                Select Maps (2-4 recommended)
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {COMPARISON_MAPS.map(map => (
                  <label key={map.id} className="flex items-center">
                    <input
                      id={`map-${map.id}`}
                      type="checkbox"
                      checked={selectedMaps.includes(map.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (selectedMaps.length < 4) {
                            setSelectedMaps([...selectedMaps, map.id]);
                          }
                        } else {
                          setSelectedMaps(selectedMaps.filter(id => id !== map.id));
                        }
                      }}
                      className="mr-2 rounded border-cyan-500/30 bg-black/50 text-cyan-400"
                    />
                    <span className="text-sm">{map.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Comparison Mode */}
            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-400">
                Comparison Mode
              </label>
              <select
                name="comparison-mode"
                value={comparisonMode}
                onChange={(e) => setComparisonMode(e.target.value as ComparisonMode)}
                className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-white"
              >
                <option value="time-series">Time Series</option>
                <option value="phase-space">Phase Space</option>
                <option value="bifurcation">Bifurcation Analysis</option>
                <option value="lyapunov">Lyapunov Exponents</option>
              </select>
            </div>

            {/* Iterations */}
            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-400">
                Iterations: {iterations}
              </label>
              <input
                name="iterations"
                type="range"
                min="100"
                max="5000"
                value={iterations}
                onChange={(e) => setIterations(parseInt(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Parameter Synchronization */}
            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-400">
                <input
                  name="sync-params"
                  type="checkbox"
                  checked={syncParams}
                  onChange={(e) => setSyncParams(e.target.checked)}
                  className="mr-2 rounded border-cyan-500/30 bg-black/50 text-cyan-400"
                />
                Sync Parameters
              </label>
              {syncParams && (
                <select
                  name="shared-param"
                  value={sharedParam}
                  onChange={(e) => setSharedParam(e.target.value)}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="r">Growth Rate (r)</option>
                  <option value="a">Parameter (a)</option>
                  <option value="b">Parameter (b)</option>
                  <option value="x0">Initial X</option>
                </select>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-400">
              {selectedMaps.length} maps selected • {comparisonMode} comparison • {iterations} iterations
            </p>
            <button
              id="recalculate-btn"
              onClick={calculateComparisonData}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Recalculate
            </button>
          </div>
        </div>

        {/* Comparison Visualization */}
        <div className="bg-black/40 border border-cyan-500/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 neon-text-cyan capitalize">
            {comparisonMode.replace('-', ' ')} Comparison
          </h2>

          {selectedMaps.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Select at least one map to begin comparison</p>
            </div>
          ) : (
            <>
              {comparisonMode === 'time-series' && renderTimeSeriesComparison()}
              {comparisonMode === 'phase-space' && renderPhaseSpaceComparison()}
              {comparisonMode === 'bifurcation' && (
                <div className="text-center py-12">
                  <p className="text-gray-400">Bifurcation comparison coming soon...</p>
                </div>
              )}
              {comparisonMode === 'lyapunov' && (
                <div className="text-center py-12">
                  <p className="text-gray-400">Lyapunov exponent comparison coming soon...</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Educational Insights */}
        <div className="mt-8 bg-black/40 border border-purple-500/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 neon-text-purple">Comparative Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Key Differences</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Dimensionality:</strong> 1D vs 2D dynamics</li>
                <li>• <strong>Dissipation:</strong> Conservative vs dissipative systems</li>
                <li>• <strong>Attractors:</strong> Fixed points, cycles, strange attractors</li>
                <li>• <strong>Parameters:</strong> Different control parameters</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Universal Properties</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Sensitive dependence:</strong> Butterfly effect</li>
                <li>• <strong>Mixing:</strong> Ergodic behavior</li>
                <li>• <strong>Dense orbits:</strong> Coverage of phase space</li>
                <li>• <strong>Periodicity:</strong> Windows of order in chaos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparativeAnalysis;