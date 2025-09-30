<!--
Sync Impact Report:
Version change: 0.0.0 → 1.0.0 (initial constitution)
Modified principles: N/A (new constitution)
Added sections: All sections
Removed sections: N/A
Templates requiring updates: ⚠ pending (plan-template.md, spec-template.md, tasks-template.md)
Follow-up TODOs: None
-->

# CML Visualizer Constitution

## Core Principles

### I. Static-First Deployment
**MUST**: All functionality MUST work on GitHub Pages using static HTML, CSS, and JavaScript. **NO server-side dependencies** are permitted. Any Node.js features MUST be transpiled to client-side compatible code via Next.js static export.

**Rationale**: GitHub Pages constraint requires pure static deployment; ensures maximum compatibility and performance.

### II. GPU-Accelerated Computation
**MUST**: All coupled map lattice calculations MUST leverage GPU acceleration via GPU.js or WebGL shaders. CPU fallback MUST be provided for compatibility. Performance targets: 60fps animations for lattice sizes up to 100x100.

**Rationale**: CML computations are mathematically intensive; GPU acceleration provides 1-15x speedup for real-time visualization.

### III. Progressive Enhancement
**MUST**: Core visualizations MUST work without advanced features. Enhanced features (WebGL, Web Workers, advanced shaders) MUST progressively enhance the experience. Feature detection MUST prevent crashes on older browsers.

**Rationale**: Ensures broad accessibility while taking advantage of modern capabilities when available.

### IV. Mathematical Accuracy
**MUST**: All map implementations (Logistic, Hénon, Standard, CML) MUST be mathematically accurate and validated against known values. Numerical precision MUST be maintained across all visualization modes. Reference implementations MUST be documented.

**Rationale**: Scientific visualization requires mathematical integrity; users rely on accurate chaos theory representations.

### V. Interactive Performance
**MUST**: Parameter adjustments MUST update visualizations in real-time without UI blocking. Web Workers MUST handle heavy computations. Animation controls MUST maintain 60fps during parameter changes.

**Rationale**: Interactive exploration is core to understanding chaotic systems; delays disrupt the learning experience.

## Technical Constraints

### GitHub Pages Compatibility
- **NO server-side APIs or Node.js runtime features**
- **Static export via Next.js MUST generate pure client-side code**
- **All dependencies MUST be browser-compatible**
- **CDN usage MUST respect GitHub Pages policies**

### Browser Support Matrix
- **Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)**: Full WebGL + Web Workers support
- **Legacy browsers**: Basic 2D visualizations via Canvas fallback
- **Mobile devices**: Touch-optimized controls, reduced lattice sizes by default

### Performance Requirements
- **Initial load**: < 3 seconds on 3G connection
- **Animation smoothness**: 60fps target, 30fps minimum acceptable
- **Memory usage**: < 500MB for typical usage patterns
- **Lattice size limits**: 200x200 maximum (GPU), 50x50 minimum (CPU fallback)

## Development Workflow

### Code Quality Standards
- **TypeScript mandatory** for all code except shaders
- **GLSL shaders** MUST be documented with mathematical formulas
- **Unit tests** for all map calculation functions
- **Integration tests** for GitHub Pages deployment

### Feature Development Process
1. **Specification**: Create detailed feature spec with mathematical requirements
2. **Implementation**: Build with progressive enhancement approach
3. **Validation**: Test mathematical accuracy and performance
4. **Deployment**: Verify GitHub Pages compatibility
5. **Documentation**: Update user guides and technical docs

### Review Requirements
- **Code review** mandatory for all changes affecting mathematical calculations
- **Performance review** required for new visualization features
- **Accessibility review** for UI changes
- **Mobile testing** before merging responsive features

## Governance

### Constitution Supremacy
This constitution supersedes all other practices and conventions. Any conflicts between this constitution and external guidelines must be resolved in favor of constitution compliance.

### Amendment Process
- **Proposals**: Must include specific change rationale and impact analysis
- **Review**: Minimum 24-hour review period for community feedback
- **Approval**: Requires consensus approval from maintainers
- **Documentation**: All amendments must update version and maintain change history
- **Migration**: Breaking changes require migration plan and timeline

### Compliance Enforcement
- **All pull requests** must verify constitution compliance
- **Automated checks** must validate static export compatibility
- **Performance tests** must pass for animation features
- **Mathematical validation** required for calculation changes

### Versioning Policy
- **MAJOR**: Backward incompatible changes to core principles or API
- **MINOR**: New visualization types or significant feature additions
- **PATCH**: Bug fixes, performance improvements, documentation updates

**Version**: 1.0.0 | **Ratified**: 2025-09-30 | **Last Amended**: 2025-09-30