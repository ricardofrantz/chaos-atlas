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
        <div className="container mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold neon-text-cyan mb-2">
              CML Visualizer
            </h1>
            <p className="text-lg text-gray-300">
              Explore chaos and complexity through interactive visualizations
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/cml/diffusive">
              <NeonButton variant="primary" size="sm">
                CML Diffusive
              </NeonButton>
            </Link>
            <Link href="/cml/global">
              <NeonButton variant="secondary" size="sm">
                CML Global
              </NeonButton>
            </Link>
            <Link href="/about">
              <NeonButton variant="tertiary" size="sm">
                About
              </NeonButton>
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tent Map Card */}
          <Link href="/maps/tent" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105 border-2 border-cyan-500/20 bg-black/30 backdrop-blur-sm hover:border-cyan-400/40">
              <h2 className="text-2xl font-bold mb-3 neon-text-cyan">
                Tent Map
              </h2>
              <p className="mb-4 text-gray-300">
                Piecewise linear chaos with exact analytical solutions and symbolic dynamics
              </p>
              <div className="h-40 rounded-lg bg-black/50 border border-cyan-500/10 flex items-center justify-center">
                <div className="text-4xl neon-text-orange">▲</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400">Symbolic</span>
              </div>
            </div>
          </Link>

          {/* Arnold Cat Map Card */}
          <Link href="/maps/arnold" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105 border-2 border-cyan-500/20 bg-black/30 backdrop-blur-sm hover:border-cyan-400/40">
              <h2 className="text-2xl font-bold mb-3 neon-text-cyan">
                Arnold Cat Map
              </h2>
              <p className="mb-4 text-gray-300">
                Area-preserving transformation with periodic orbits and Fibonacci connections
              </p>
              <div className="h-40 rounded-lg bg-black/50 border border-cyan-500/10 flex items-center justify-center">
                <div className="text-4xl neon-text-orange">◈</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400">Periodic</span>
              </div>
            </div>
          </Link>

          {/* Baker's Map Card */}
          <Link href="/maps/bakers" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105 border-2 border-cyan-500/20 bg-black/30 backdrop-blur-sm hover:border-cyan-400/40">
              <h2 className="text-2xl font-bold mb-3 neon-text-cyan">
                Baker&apos;s Map
              </h2>
              <p className="mb-4 text-gray-300">
                Stretching and folding dynamics demonstrating exact mixing and symbolic dynamics
              </p>
              <div className="h-40 rounded-lg bg-black/50 border border-cyan-500/10 flex items-center justify-center">
                <div className="text-4xl neon-text-orange">◧</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400">Mixing</span>
              </div>
            </div>
          </Link>

          {/* Ikeda Map Card */}
          <Link href="/maps/ikeda" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105 border-2 border-cyan-500/20 bg-black/30 backdrop-blur-sm hover:border-cyan-400/40">
              <h2 className="text-2xl font-bold mb-3 neon-text-cyan">
                Ikeda Map
              </h2>
              <p className="mb-4 text-gray-300">
                Nonlinear optics model with stunning spiral attractors from laser cavity dynamics
              </p>
              <div className="h-40 rounded-lg bg-black/50 border border-cyan-500/10 flex items-center justify-center">
                <div className="text-4xl neon-text-orange">◉</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400">Spiral</span>
              </div>
            </div>
          </Link>

          {/* Tinkerbell Map Card */}
          <Link href="/maps/tinkerbell" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105 border-2 border-cyan-500/20 bg-black/30 backdrop-blur-sm hover:border-cyan-400/40">
              <h2 className="text-2xl font-bold mb-3 neon-text-cyan">
                Tinkerbell Map
              </h2>
              <p className="mb-4 text-gray-300">
                Complex polynomial dynamics with multi-loop attractors and bistable behavior
              </p>
              <div className="h-40 rounded-lg bg-black/50 border border-cyan-500/10 flex items-center justify-center">
                <div className="text-4xl neon-text-orange">✦</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400">Multi-loop</span>
              </div>
            </div>
          </Link>

          {/* Duffing Map Card */}
          <Link href="/maps/duffing" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105 border-2 border-cyan-500/20 bg-black/30 backdrop-blur-sm hover:border-cyan-400/40">
              <h2 className="text-2xl font-bold mb-3 neon-text-cyan">
                Duffing Map
              </h2>
              <p className="mb-4 text-gray-300">
                Double-well oscillator demonstrating bistable dynamics and physical chaos
              </p>
              <div className="h-40 rounded-lg bg-black/50 border border-cyan-500/10 flex items-center justify-center">
                <div className="text-4xl neon-text-orange">⚛</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400">Bistable</span>
              </div>
            </div>
          </Link>

          {/* Complex Quadratic Map Card */}
          <Link href="/maps/complex" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105 border-2 border-cyan-500/20 bg-black/30 backdrop-blur-sm hover:border-cyan-400/40">
              <h2 className="text-2xl font-bold mb-3 neon-text-cyan">
                Complex Quadratic
              </h2>
              <p className="mb-4 text-gray-300">
                Julia sets and Mandelbrot set exploring complex dynamics and fractals
              </p>
              <div className="h-40 rounded-lg bg-black/50 border border-cyan-500/10 flex items-center justify-center">
                <div className="text-4xl neon-text-orange">◈</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400">Fractals</span>
              </div>
            </div>
          </Link>

          {/* Logistic Map Card */}
          <Link href="/maps/logistic" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105 border-2 border-cyan-500/20 bg-black/30 backdrop-blur-sm hover:border-cyan-400/40">
              <h2 className="text-2xl font-bold mb-3 neon-text-cyan">
                Logistic Map
              </h2>
              <p className="mb-4 text-gray-300">
                The simplest chaotic system, demonstrating period doubling and chaos
              </p>
              <div className="h-40 rounded-lg bg-black/50 border border-cyan-500/10 flex items-center justify-center">
                <div className="text-4xl neon-text-orange">∞</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400">Bifurcation</span>
              </div>
            </div>
          </Link>

          {/* Henon Map Card */}
          <Link href="/maps/henon" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105 border-2 border-cyan-500/20 bg-black/30 backdrop-blur-sm hover:border-cyan-400/40">
              <h2 className="text-2xl font-bold mb-3 neon-text-cyan">
                Hénon Map
              </h2>
              <p className="mb-4 text-gray-300">
                A classic 2D discrete dynamical system with a strange attractor
              </p>
              <div className="h-40 rounded-lg bg-black/50 border border-cyan-500/10 flex items-center justify-center">
                <div className="text-4xl neon-text-magenta">∞</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400">Attractor</span>
              </div>
            </div>
          </Link>

          {/* Standard Map Card */}
          <Link href="/maps/standard" className="block">
            <div className="h-full p-6 rounded-lg transition-all duration-300 hover:scale-105 border-2 border-cyan-500/20 bg-black/30 backdrop-blur-sm hover:border-cyan-400/40">
              <h2 className="text-2xl font-bold mb-3 neon-text-cyan">
                Standard Map
              </h2>
              <p className="mb-4 text-gray-300">
                Conservative system showing transition to chaos in Hamiltonian systems
              </p>
              <div className="h-40 rounded-lg bg-black/50 border border-cyan-500/10 flex items-center justify-center">
                <div className="text-4xl neon-text-yellow">⚡</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400">Chaos</span>
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
                <div className="text-4xl neon-text-orange">∇</div>
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
              <div className="text-4xl neon-text-magenta">⟳</div>
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
              <div className="text-4xl neon-text-yellow">ⓘ</div>
            </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400">Documentation</span>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
