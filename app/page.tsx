// src/app/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { ThemeSwitcher, NeonButton } from '@/components/themes';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{
      background: `linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))`
    }}>
      <header className="p-6 border-b border-cyan-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold neon-text-cyan mb-2">
              CML Visualizer
            </h1>
            <p className="text-lg text-gray-300">
              Explore chaos and complexity through interactive visualizations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/theme-demo">
              <NeonButton variant="ghost" size="sm">
                Theme Demo
              </NeonButton>
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Logistic Map Card */}
          <Link href="/maps/logistic" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105" style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              borderWidth: '1px'
            }}>
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-accent)' }}>
                Logistic Map
              </h2>
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                The simplest chaotic system, demonstrating period doubling and chaos.
              </p>
              <div className="h-40 rounded bg-opacity-20 flex items-center justify-center" style={{
                backgroundColor: 'var(--bg-secondary)'
              }}>
                <span className="text-5xl">🔄</span>
              </div>
            </div>
          </Link>

          {/* Henon Map Card */}
          <Link href="/maps/henon" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105" style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              borderWidth: '1px'
            }}>
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-accent)' }}>
                Hénon Map
              </h2>
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                A classic 2D discrete dynamical system with a strange attractor.
              </p>
              <div className="h-40 rounded bg-opacity-20 flex items-center justify-center" style={{
                backgroundColor: 'var(--bg-secondary)'
              }}>
                <span className="text-5xl">🌀</span>
              </div>
            </div>
          </Link>

          {/* Standard Map Card */}
          <Link href="/maps/standard" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105" style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              borderWidth: '1px'
            }}>
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-accent)' }}>
                Standard Map
              </h2>
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                A conservative system showing the transition to chaos in Hamiltonian systems.
              </p>
              <div className="h-40 rounded bg-opacity-20 flex items-center justify-center" style={{
                backgroundColor: 'var(--bg-secondary)'
              }}>
                <span className="text-5xl">🔄</span>
              </div>
            </div>
          </Link>

          {/* CML Diffusive Card */}
          <Link href="/cml/diffusive" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105 border-2 border-cyan-500/20 bg-black/30 backdrop-blur-sm hover:border-cyan-400/40">
              <h2 className="text-2xl font-bold mb-3 neon-text-cyan">
                Diffusive CML
              </h2>
              <p className="mb-4 text-gray-300">
                Spatiotemporal chaos and pattern formation in coupled map lattices
              </p>
              <div className="h-40 rounded-lg bg-black/50 border border-cyan-500/10 flex items-center justify-center">
                <span className="text-5xl neon-text-orange">🌊</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400">Interactive</span>
              </div>
            </div>
          </Link>

          {/* CML Global Card */}
          <Link href="/cml/global" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105 border-2 border-cyan-500/20 bg-black/30 backdrop-blur-sm hover:border-cyan-400/40">
              <h2 className="text-2xl font-bold mb-3 neon-text-cyan">
                Global CML
              </h2>
              <p className="mb-4 text-gray-300">
                Synchronization phenomena in globally coupled systems
              </p>
              <div className="h-40 rounded-lg bg-black/50 border border-cyan-500/10 flex items-center justify-center">
                <span className="text-5xl neon-text-magenta">🔄</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-xs text-cyan-400">Coming Soon</span>
              </div>
            </div>
          </Link>

          {/* About Card */}
          <Link href="/about" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105 border-2 border-cyan-500/20 bg-black/30 backdrop-blur-sm hover:border-cyan-400/40">
              <h2 className="text-2xl font-bold mb-3 neon-text-cyan">
                About
              </h2>
              <p className="mb-4 text-gray-300">
                Built with TDD • WCAG AA Compliant • Vintage Tron Aesthetic
              </p>
              <div className="h-40 rounded-lg bg-black/50 border border-cyan-500/10 flex items-center justify-center">
                <span className="text-5xl neon-text-yellow">ℹ️</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400">Documentation</span>
              </div>
            </div>
          </Link>
        </div>
      </main>

      <footer className="p-6 border-t border-cyan-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 mb-2">
            CML Visualizer - Tron Theme Edition
          </p>
          <p className="text-sm text-gray-500">
            Built with TDD • WCAG AA Compliant • Vintage Tron Aesthetic
          </p>
        </div>
      </footer>
    </div>
  );
}
