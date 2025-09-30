# Data Model: Tron-Themed Dark Mode

## Theme Configuration Entity

**Description**: Central configuration for the Tron theme system containing all visual parameters and settings.

**Fields**:
- `themeId`: string - Unique identifier for the theme ("tron-dark")
- `name`: string - Display name ("Tron Dark")
- `backgroundColor`: string - Primary background color (#000000)
- `primaryColors`: object - Map of neon colors to semantic purposes
  - `cyan`: string (#00FFFF) - Primary accent color
  - `orange`: string (#FF7F00) - Secondary accent color
  - `magenta`: string (#FF00FF) - Tertiary accent color
  - `yellow`: string (#FFFF00) - Warning/highlight color
- `glowSettings`: object - Configuration for glow effects
  - `intensity`: number (0.8) - Default glow intensity (0-1)
  - `blurRadius`: number (8px) - Gaussian blur radius for glow
  - `spreadRadius`: number (2px) - Glow spread radius
- `animationSettings`: object - Animation configuration
  - `duration`: string (0.3s) - Default transition duration
  - `easing`: string (ease-out) - Default easing function
  - `reducedMotion`: boolean (false) - Respect user's motion preferences
- `accessibility`: object - Accessibility overrides
  - `highContrast`: boolean (false) - High contrast mode
  - `reducedGlow`: boolean (false) - Reduced glow for light sensitivity

**Validation Rules**:
- All color values must be valid hex codes
- Intensity values must be between 0 and 1
- Animation duration must be valid CSS time values
- Theme ID must be unique across system

## User Preferences Entity

**Description**: User-specific theme preferences and settings storage.

**Fields**:
- `userId`: string - Unique user identifier (generated UUID)
- `selectedTheme`: string - Currently active theme ID
- `customSettings`: object - User customizations
  - `glowIntensity`: number (null) - Custom glow intensity override
  - `animationSpeed`: number (1.0) - Animation speed multiplier
  - `colorScheme`: string (null) - Custom color scheme variant
- `accessibilityPreferences`: object - User accessibility settings
  - `prefersReducedMotion`: boolean (false) - Motion preference
  - `prefersHighContrast`: boolean (false) - Contrast preference
  - `lightSensitivity`: boolean (false) - Light sensitivity mode
- `lastUpdated`: timestamp - Last preference update time

**Validation Rules**:
- Theme ID must correspond to available theme
- Custom intensity values must be between 0 and 1
- Animation speed must be positive
- All boolean fields must be valid boolean values

## Visualization Color Mapping Entity

**Description**: Mapping of mathematical visualization data to Tron theme colors.

**Fields**:
- `visualizationType`: string - Type of visualization (logistic, henon, standard, cml)
- `dataMappings`: array - Array of color mapping configurations
  - `dataType`: string - Type of data being visualized
  - `colorScale`: array - Array of colors for data values
  - `valueRange`: object - Min/max values for mapping
- `neonEffects`: object - Neon effect settings for visualizations
  - `glowEnabled`: boolean (true) - Enable glow on data points
  - `trailEnabled`: boolean (true) - Enable light trails for animations
  - `pulseEnabled`: boolean (false) - Enable pulsing effects
- `performanceSettings`: object - Performance optimization settings
  - `maxDataPoints`: number (10000) - Maximum points for full effects
  - `reducedEffectsThreshold`: number (5000) - Threshold for reduced effects

**Validation Rules**:
- Visualization type must be one of: logistic, henon, standard, cml
- Color arrays must contain valid hex codes
- Value ranges must be numeric with min < max
- Threshold values must be positive integers

## Interactive Element States Entity

**Description**: Configuration for interactive UI element states and animations.

**Fields**:
- `elementType`: string - Type of UI element (button, slider, input, etc.)
- `states`: object - State configurations
  - `default`: object - Default appearance
    - `backgroundColor`: string
    - `textColor`: string
    - `borderColor`: string
    - `glowIntensity`: number
  - `hover`: object - Hover state
    - `backgroundColor`: string
    - `textColor`: string
    - `glowIntensity`: number
    - `transitionDuration`: string
  - `focus`: object - Focus state
    - `backgroundColor`: string
    - `textColor`: string
    - `glowIntensity`: number
    - `outlineStyle`: string
  - `active`: object - Active/pressed state
    - `backgroundColor`: string
    - `textColor`: string
    - `transform`: string
    - `glowIntensity`: number
- `animations`: object - Animation configurations
  - `entrance`: object - Element entrance animation
  - `exit`: object - Element exit animation
  - `interaction`: object - User interaction feedback

**Validation Rules**:
- Element type must be valid UI component type
- All color values must be valid hex codes
- Glow intensity values must be between 0 and 1
- Transform values must be valid CSS transforms
- Transition durations must be valid CSS time values

## State Transitions

### Theme Application
1. **Theme Load** → Parse theme configuration → Apply CSS classes → Update UI
2. **Theme Switch** → Save user preference → Update CSS classes → Animate transition
3. **Customization** → Validate settings → Update theme config → Apply changes

### Preference Updates
1. **User Selection** → Validate preference → Update localStorage → Trigger theme update
2. **Accessibility Change** → Detect system preference → Update settings → Apply accessibility mode
3. **Performance Adjustment** → Monitor performance → Adjust effects → Update configuration

### Visualization Updates
1. **Data Change** → Map data to colors → Apply neon effects → Render visualization
2. **Performance Mode** → Detect performance issues → Reduce effects → Update settings
3. **User Interaction** → Handle user input → Update element states → Trigger animations