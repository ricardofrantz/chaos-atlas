# CML Visualizer

A visual and futuristic web application for exploring coupled map lattices (CML) and iterative maps. This application allows users to visualize and interact with various chaotic systems through an intuitive interface with multiple theme options.

## Features

- **Multiple Map Types**:
  - Logistic Map - The simplest chaotic system
  - Hénon Map - A classic 2D chaotic map
  - Standard Map - For exploring Hamiltonian chaos
  - Coupled Map Lattice - With different coupling patterns (diffusive, global, directional)

- **Visualization Options**:
  - Time series plots
  - Phase space visualizations
  - Cobweb plots for 1D maps
  - Bifurcation diagrams
  - Heat maps and space-time plots for CML

- **Interactive Features**:
  - Real-time parameter adjustment with sliders
  - Visualization type selection
  - Preset configurations for interesting behaviors
  - Animation controls

- **Theming System**:
  - Dune - Desert-inspired colors from the Dune universe
  - Tron - Neon blue/cyan on dark from the Tron universe
  - Matrix - Green code on black from The Matrix
  - Scientific - Clean, publication-ready style
  - Ice Fire - Blue and red gradient theme

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cml-visualizer.git
cd cml-visualizer
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## macOS Compatibility

This application is designed to work seamlessly on macOS with specific optimizations:
- Font rendering adjustments for macOS
- Trackpad and mouse wheel behavior optimization
- Responsive design for various screen sizes
- Touch-friendly controls

## Project Structure

```
cml-visualizer/
├── app/                 # Next.js app router pages
│   ├── maps/            # Individual map pages
│   ├── cml/             # CML pages (diffusive, global)
│   └── compare/         # Comparative analysis
├── components/
│   ├── themes/          # Theme provider, switcher, neon button
│   ├── ui/              # Shared layout components
│   └── visualizations/  # D3/Canvas visualization components
├── lib/
│   ├── maps/            # Map calculation functions
│   └── themes/          # Theme types and utilities
├── public/              # Static assets
└── tests/               # Unit, integration, and e2e tests
```

## Development

### Adding a New Theme

1. Add your theme to `src/themes/theme-variants.ts` following the existing pattern
2. The theme will automatically appear in the theme switcher

### Adding a New Map Type

1. Create a new calculation file in `src/lib/maps/`
2. Create a new visualization component in `src/components/visualizations/`
3. Add a new page in `src/app/maps/` or `src/app/cml/`
4. Update the home page to include a link to your new map

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by research in chaos theory and nonlinear dynamics
- Built with Next.js, React, D3.js, and Tailwind CSS
