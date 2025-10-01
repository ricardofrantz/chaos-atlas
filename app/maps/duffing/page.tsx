"use client";

import React from 'react';
import DuffingMapVisualization from '@/components/visualizations/DuffingMapVisualization';
import Link from 'next/link';

export default function DuffingMapPage() {
  return (
    <div className="min-h-screen" style={{
      background: `linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))`
    }}>
      <header className="p-6 border-b border-opacity-30" style={{
        borderColor: 'var(--border-primary)',
        backgroundColor: 'var(--bg-header)'
      }}>
        <div className="container mx-auto">
          <Link href="/" className="text-sm mb-2 inline-block" style={{ color: 'var(--text-secondary)' }}>
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-accent)' }}>
            Duffing Map
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Discretized double-well oscillator demonstrating bistable dynamics and chaos
          </p>
        </div>
      </header>
      <main className="container mx-auto p-6">
        <DuffingMapVisualization />
      </main>
    </div>
  );
}