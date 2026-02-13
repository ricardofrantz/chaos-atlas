"use client";

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const HenonMapVisualization: React.FC = () => {
  const [a, setA] = useState(1.4);
  const [b, setB] = useState(0.3);
  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(0);
  const [iterations, setIterations] = useState(1000);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const width = 600;
  const height = 400;
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();
    
    const svg = d3.select(svgRef.current);
    
    // Set margins
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create a group element for the visualization
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Calculate Henon map
    const points = [];
    let x = x0;
    let y = y0;
    
    // Skip transients
    for (let i = 0; i < 100; i++) {
      const xNext = 1 - a * x * x + y;
      const yNext = b * x;
      x = xNext;
      y = yNext;
    }
    
    // Collect attractor points
    for (let i = 0; i < iterations; i++) {
      points.push({ x, y });
      const xNext = 1 - a * x * x + y;
      const yNext = b * x;
      x = xNext;
      y = yNext;
    }
    
    // Find data bounds
    const xExtent = d3.extent(points, d => d.x) as [number, number];
    const yExtent = d3.extent(points, d => d.y) as [number, number];
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain(xExtent)
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain(yExtent)
      .range([innerHeight, 0]);
    
    // Add points
    g.selectAll('.henon-point')
      .data(points)
      .enter()
      .append('circle')
      .attr('class', 'henon-point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 1)
      .attr('fill', 'var(--viz-primary)')
      .attr('opacity', 0.6);
    
    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text, line, path')
      .style('color', 'var(--text-secondary)');
    
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text, line, path')
      .style('color', 'var(--text-secondary)');
    
    // Add axis labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 45)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--text-secondary)')
      .text('x');
    
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--text-secondary)')
      .text('y');
    
    // Add title
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--text-accent)')
      .style('font-weight', 'bold')
      .text(`Hénon Map (a = ${a.toFixed(2)}, b = ${b.toFixed(2)})`);
    
  }, [a, b, x0, y0, iterations]);
  
  return (
    <div className="henon-map-visualization p-6">
      {/* Controls */}
      <div className="controls mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            Parameter a: {a.toFixed(3)}
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.01"
            value={a}
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            Parameter b: {b.toFixed(3)}
          </label>
          <input
            type="range"
            min="0.1"
            max="0.5"
            step="0.01"
            value={b}
            onChange={(e) => setB(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            Initial x₀: {x0.toFixed(3)}
          </label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={x0}
            onChange={(e) => setX0(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            Initial y₀: {y0.toFixed(3)}
          </label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={y0}
            onChange={(e) => setY0(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            Iterations: {iterations}
          </label>
          <input
            type="range"
            min="500"
            max="5000"
            step="100"
            value={iterations}
            onChange={(e) => setIterations(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      {/* Visualization */}
      <div className="visualization-wrapper flex justify-center">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full border rounded-lg"
          style={{ borderColor: 'var(--border-primary)', maxWidth: width, aspectRatio: `${width}/${height}` }}
        />
      </div>
      
      {/* Info */}
      <div className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <p>The Hénon map exhibits a strange attractor for the classic values a=1.4, b=0.3.</p>
        <p>Each point represents one iteration of the map in phase space.</p>
      </div>
    </div>
  );
};

export default HenonMapVisualization;