# Agents Documentation

> **Important Note**: `CLAUDE.md` is a symbolic link that points to this file (`agents.md`). Always edit this file directly and never edit `CLAUDE.md` as changes will not persist. This ensures the documentation works correctly in any development setup.

This document describes the various computational agents and visualization components in the CML Visualizer project. Each agent is responsible for calculating and visualizing different types of chaotic systems and coupled map lattices.

## Map Calculation Agents

### Logistic Map Agent (`lib/maps/logistic.ts`)

The Logistic Map agent handles calculations for the simplest chaotic system, defined by the equation:
```
x_{n+1} = r * x_n * (1 - x_n)
```

**Key Functions:**
- `calculateLogisticIteration()` - Single iteration calculation
- `calculateLogisticMap()` - Time series trajectory
- `calculateLogisticCobweb()` - Cobweb plot visualization
- `calculateLogisticBifurcation()` - Bifurcation diagram
- `calculateLogisticLyapunovExponent()` - Chaos quantification

**Parameters:**
- `r`: Growth parameter (typically 0-4)
- `x0`: Initial condition (typically 0-1)
- `iterations`: Number of iterations to compute

### Hénon Map Agent (`lib/maps/henon.ts`)

The Hénon Map agent handles the classic 2D chaotic system:
```
x_{n+1} = 1 - a * x_n^2 + y_n
y_{n+1} = b * x_n
```

**Key Functions:**
- `calculateHenonIteration()` - Single iteration calculation
- `calculateHenonMap()` - Time series trajectory
- `calculateHenonPhaseSpace()` - Phase space visualization
- `calculateHenonBifurcation()` - Parameter space exploration

**Parameters:**
- `a`: Nonlinearity parameter (typically 1.4)
- `b`: Dissipation parameter (typically 0.3)
- `x0`, `y0`: Initial conditions

### Standard Map Agent (`lib/maps/standard.ts`)

The Standard Map agent handles Hamiltonian chaos:
```
θ_{n+1} = θ_n + p_n mod 2π
p_{n+1} = p_n + K * sin(θ_{n+1}) mod 2π
```

**Key Functions:**
- `calculateStandardIteration()` - Single iteration calculation
- `calculateStandardMap()` - Time series trajectory
- `calculateStandardPhaseSpace()` - Phase space visualization
- `calculateStandardBifurcation()` - Chaos-to-order transitions

**Parameters:**
- `K`: Stochasticity parameter
- `θ0`, `p0`: Initial conditions (angle and momentum)

### Coupled Map Lattice Agent (`lib/maps/cml.ts`)

The CML agent handles spatially extended chaotic systems with various coupling schemes.

**Coupling Types:**
- **Diffusive**: Local nearest-neighbor coupling
- **Global**: All-to-all coupling
- **Directional**: Asymmetric coupling patterns

**Key Functions:**
- `calculateDiffusiveCML()` - Diffusive coupling calculations
- `calculateGlobalCML()` - Global coupling calculations
- `calculateDirectionalCML()` - Directional coupling calculations
- `calculateCMLSpaceTime()` - Space-time evolution
- `calculateCMLPattern()` - Pattern formation analysis

**Parameters:**
- `ε`: Coupling strength
- `L`: Lattice size
- `r`: Local map parameter
- `boundary`: Boundary conditions (periodic, fixed, etc.)

## Visualization Agents

### 2D Visualization Agent (`components/visualizations/LogisticMapVisualization.tsx`)

Handles 2D visualizations for 1D maps:
- **Time Series**: x_n vs n
- **Cobweb Plot**: Iterative mapping visualization
- **Bifurcation Diagram**: Parameter space analysis
- **Return Map**: x_{n+1} vs x_n

### 3D Visualization Agent (`components/visualizations/HenonMapVisualization.tsx`)

Handles 3D visualizations for 2D maps:
- **Phase Space**: (x, y) trajectory
- **Basins of Attraction**: Attractor boundaries
- **Poincaré Sections**: Cross-sections of flow
- **3D Trajectory**: Time evolution in 3D

### CML Visualization Agent (`components/visualizations/CMLVisualization.tsx`)

Handles complex visualizations for coupled map lattices:
- **Space-Time Plots**: 2D evolution over time
- **Heat Maps**: Spatial patterns using color
- **Snapshot Animation**: Real-time evolution
- **Correlation Functions**: Spatial correlations
- **Synchronization Measures**: Collective behavior analysis

## Theme System Agents

### Theme Management Agent (`lib/themes/theme-types.ts`)

Defines the theme system architecture:
- **Color Schemes**: Dune, Tron, Matrix, Scientific, Ice Fire
- **Typography**: Font families and sizes
- **Layout**: Component styling and spacing
- **Responsive**: Mobile/tablet/desktop adaptations

### Theme Application Agent (`components/themes/theme-provider.tsx`)

Manages theme application across components:
- **Context Provider**: Global theme state
- **CSS Injection**: Dynamic style application
- **Component Theming**: Individual component styling
- **Animation**: Theme transition effects

## User Interface Agents

### Parameter Control Agent (`components/ui/ParameterControls.tsx`)

Handles real-time parameter manipulation:
- **Sliders**: Continuous parameter adjustment
- **Input Fields**: Precise numeric input
- **Presets**: Predefined parameter sets
- **Validation**: Parameter range checking

### Navigation Agent (`app/layout.tsx`)

Manages application navigation:
- **Routing**: Page navigation
- **Menu Structure**: Hierarchical organization
- **Breadcrumbs**: Navigation path display
- **Search**: Content discovery

## Data Processing Agents

### Numerical Integration Agent (`lib/integration.ts`)

Handles numerical computations:
- **Integration Methods**: Euler, Runge-Kutta
- **Error Control**: Adaptive step sizing
- **Performance Optimization**: Vectorized operations
- **Precision Handling**: Floating-point accuracy

### Statistical Analysis Agent (`lib/statistics.ts`)

Performs statistical analysis:
- **Time Series Analysis**: Autocorrelation, power spectrum
- **Chaos Measures**: Lyapunov exponents, correlation dimension
- **Pattern Recognition**: Feature extraction
- **Data Export**: CSV, JSON, image formats

## Configuration and State Management

### State Management Agent

Handles application state:
- **Parameter State**: Current map parameters
- **Visualization State**: Display settings and options
- **Theme State**: Current theme and preferences
- **Session State**: User session data

### Persistence Agent

Handles data persistence:
- **Local Storage**: Browser-based storage
- **Session Storage**: Temporary data
- **Export/Import**: Configuration sharing
- **Cache Management**: Performance optimization

## Performance Optimization

### Rendering Optimization Agent

Optimizes visualization performance:
- **Canvas Rendering**: Hardware acceleration
- **Web Workers**: Background computation
- **Memory Management**: Efficient data structures
- **Frame Rate Control**: Smooth animations

### Computation Optimization Agent

Optimizes calculation performance:
- **Vectorization**: SIMD operations
- **Caching**: Memoization of results
- **Lazy Evaluation**: On-demand computation
- **Parallel Processing**: Multi-threading where possible

## Extension Framework

### Plugin Architecture

Supports extension through:
- **Custom Maps**: User-defined map functions
- **Custom Visualizations**: Pluggable renderers
- **Custom Themes**: User-contributed themes
- **Data Sources**: External data integration

### API Interface

Provides programmatic access:
- **REST API**: Web service endpoints
- **WebSocket**: Real-time data streaming
- **GraphQL**: Query interface
- **WebAssembly**: High-performance computing

## Best Practices

### Agent Development Guidelines

1. **Modularity**: Keep agents focused and single-purpose
2. **Performance**: Optimize for real-time interaction
3. **Extensibility**: Design for future enhancements
4. **Documentation**: Maintain clear API documentation
5. **Testing**: Ensure comprehensive test coverage

### Integration Patterns

1. **Message Passing**: Loose coupling between agents
2. **Event-Driven**: Reactive architecture
3. **Dependency Injection**: Modular composition
4. **Interface Segregation**: Clear contract definitions

## Future Enhancements

### Planned Agent Additions

- **Machine Learning Agent**: Pattern recognition and prediction
- **Collaboration Agent**: Multi-user synchronization
- **Database Agent**: Persistent data storage
- **Simulation Agent**: Advanced physics simulations

### Technology Roadmap

- **WebGPU**: Next-generation graphics acceleration
- **WebAssembly**: High-performance computation
- **Progressive Web App**: Offline functionality
- **Virtual Reality**: Immersive visualization experiences

## GitHub Pages Deployment

This project is configured for automated deployment to GitHub Pages using the latest Next.js static export standards (2025).

### Configuration Requirements

#### Next.js Configuration (`next.config.js`)

The project uses the following static export configuration:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for GitHub Pages deployment
  output: 'export',
  // GitHub Pages requires trailing slash for proper routing
  trailingSlash: true,
  // Required for static export
  images: {
    unoptimized: true
  },
  // Base path will be automatically injected by GitHub Actions
  // Uncomment if you want to set it manually for local development
  // basePath: process.env.NODE_ENV === 'production' ? '/cml-visualizer' : '',
}
```

**Key Settings Explained:**
- `output: 'export'`: Enables static export (replaces deprecated `next export`)
- `trailingSlash: true`: Ensures proper routing on GitHub Pages
- `images.unoptimized: true`: Disables server-side image optimization for static hosting
- `basePath`: Automatically set by GitHub Actions during deployment

#### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

The deployment workflow uses the latest 2025 GitHub Actions standards:

**Key Improvements (2025):**
- **Node.js 22 LTS**: Updated to current Node.js 22 Long Term Support
- **Enhanced Package Manager Support**: Auto-detects npm, yarn, and pnpm
- **Optimized Caching**: Multi-tier caching strategy for better performance
- **Pull Request Support**: Preview builds for pull requests
- **Timeout Management**: Proper timeouts for build and deployment
- **Environment Optimization**: Production build optimizations
- **Telemetry Disabled**: Faster builds with disabled telemetry

**Trigger Events:**
- **Push to main**: Automatic deployment
- **Pull requests**: Build previews (no deployment)
- **Manual dispatch**: On-demand deployment

**Workflow Features:**
- **Intelligent Package Manager Detection**: Supports npm, yarn, and pnpm with frozen lockfiles
- **Enhanced Caching Strategy**: Multi-layer caching with specific keys for better hit rates
- **Production Optimization**: Telemetry disabled, production environment variables
- **Artifact Management**: Short retention periods for storage efficiency
- **Conditional Deployment**: Only deploys on main branch pushes
- **Timeout Protection**: 10-minute build timeout, 5-minute deployment timeout

**Workflow Steps:**
1. **Checkout**: Full repository checkout with history
2. **Package Manager Detection**: Detects npm/yarn/pnpm with appropriate commands
3. **Node.js 22 Setup**: Latest LTS with built-in caching
4. **Pages Configuration**: Automatic basePath injection and Next.js optimization
5. **Enhanced Cache Restoration**: Multi-path caching with intelligent key generation
6. **Dependency Installation**: Frozen lockfile installation for reproducibility
7. **Production Build**: Optimized build with disabled telemetry
8. **Static Export**: Conditional export based on cache status
9. **Artifact Upload**: Optimized artifact upload with short retention
10. **Conditional Deployment**: Deploy only for main branch pushes

### Deployment Process

#### Automatic Deployment
1. Push changes to `main` branch
2. GitHub Actions automatically triggers build
3. Build completes and deploys to GitHub Pages
4. Site available at `https://[username].github.io/[repository-name]`

#### Manual Deployment
1. Go to repository **Actions** tab
2. Select **Deploy Next.js site to Pages** workflow
3. Click **Run workflow** button
4. Choose branch and trigger deployment

#### Local Development
For local development with GitHub Pages configuration:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (generates static files)
npm run build

# Export static files (equivalent to build with output: 'export')
npm run export
```

### Repository Settings

Ensure the following GitHub repository settings:

1. **Pages Configuration**:
   - Go to Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` (auto-created by Actions) or `main`
   - Folder: `/ (root)`

2. **Actions Permissions**:
   - Settings → Actions → General
   - Allow "Actions" permissions
   - Allow "GitHub Actions" to create and approve pull requests

3. **Environments**:
   - `github-pages` environment automatically created
   - Contains deployment rules and protection

### Troubleshooting

#### Common Issues

1. **404 Errors on Sub-pages**:
   - Ensure `trailingSlash: true` in next.config.js
   - Check that `basePath` is correctly set
   - Verify GitHub Pages settings

2. **Build Failures**:
   - Check Actions tab for error logs
   - Ensure Node.js version compatibility
   - Verify all dependencies are installed

3. **Static Asset Loading**:
   - Images must be in `/public` folder
   - Use absolute paths for assets
   - `images.unoptimized: true` is required

4. **Routing Issues**:
   - Use Next.js Link component for navigation
   - Avoid dynamic routes that require server-side rendering
   - Ensure all pages can be statically generated

#### Debug Commands (2025 Updated)

```bash
# Check Next.js configuration and environment
npx next info

# Build with verbose output and profiling
npm run build -- --debug --profile

# Export with additional info
npm run export -- --debug

# Analyze bundle size (if @next/bundle-analyzer is installed)
npm run analyze

# Check Node.js version and compatibility
node --version
npm --version

# Test build locally before deployment
npm run build && npm run start

# Verify static export output
ls -la out/
```

#### New in 2025

**Enhanced Debugging Features:**
- **Build Profiling**: Built-in profiling capabilities
- **Bundle Analysis**: Enhanced bundle size tracking
- **Environment Validation**: Better environment variable validation
- **Performance Metrics**: Real-time build performance tracking
- **Cache Diagnostics**: Detailed cache hit/miss information
- **Dependency Analysis**: Enhanced dependency tree analysis

### Performance Optimization

#### Build Optimization (2025 Standards)
- **Node.js 22 Performance**: Leverage latest V8 engine improvements
- **Enhanced Caching**: Multi-tier caching strategy with intelligent keys
- **Static Imports**: Optimize component loading for static generation
- **Bundle Analysis**: Monitor and optimize bundle sizes
- **Asset Optimization**: Minimize and compress static assets
- **Parallel Processing**: Utilize multi-core build capabilities

#### Deployment Optimization (2025 Standards)
- **Intelligent Caching**: Multi-layer caching with dependency and source file tracking
- **Frozen Lockfiles**: Ensure reproducible builds across environments
- **Telemetry Disabled**: Faster builds with reduced overhead
- **Artifact Management**: Optimized storage with short retention periods
- **Timeout Protection**: Prevent hanging builds and deployments
- **Conditional Deployment**: Deploy only when necessary (main branch)
- **CDN Integration**: Leverage GitHub Pages global CDN
- **Build Monitoring**: Track build times and performance metrics

### Future Enhancements

#### Advanced Deployment Features
- **Multi-environment Deployment**: Staging/production environments
- **Custom Domain**: Personal domain configuration
- **Analytics Integration**: Visitor tracking and analytics
- **Progressive Web App**: Offline capabilities and installability

#### Build Improvements
- **Incremental Static Regeneration**: ISR for dynamic content
- **Edge Functions**: Server-side functions for dynamic features
- **Bundle Analysis**: Monitor bundle size and performance
- **Automated Testing**: E2E and unit testing in CI/CD