# CML Visualizer

An interactive web application for exploring coupled map lattices (CML) and iterative maps with real-time visualizations.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the application.

## Features

- **Multiple Map Types**: Logistic, Hénon, Standard, and Coupled Map Lattices
- **Interactive Visualizations**: Time series, phase space, bifurcation diagrams
- **Real-time Controls**: Parameter adjustment with immediate feedback
- **Dynamic Themes**: Five built-in color schemes (Dune, Tron, Matrix, Scientific, Ice Fire)
- **Responsive Design**: Works on mobile, tablet, and desktop

## Project Structure

```
cml-visualizer/
├── app/                    # Next.js app directory
├── components/            # React components
├── lib/                   # Utility functions and map calculations
├── node_modules/          # Dependencies (generated)
├── .gitignore            # Git ignore rules
├── .eslintrc.json        # ESLint configuration
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Visualization**: D3.js, Three.js
- **UI**: React 18
