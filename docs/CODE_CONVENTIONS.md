# Code Conventions for Games Site

## General Principles
- Write clean, readable code
- Use consistent formatting and naming
- Prioritize maintainability over cleverness
- Comment complex logic but avoid obvious comments

## HTML Conventions
- Use semantic HTML elements
- Include proper meta tags for SEO and mobile
- Use meaningful class and id names
- Structure: `kebab-case` for classes and ids
- Indent with 2 spaces

## CSS Conventions
- Use CSS custom properties for theming
- Mobile-first responsive design
- BEM methodology for complex components
- Class naming: `kebab-case`
- Organize: variables → reset → layout → components
- Indent with 2 spaces

## JavaScript Conventions
- Use modern ES6+ features
- Prefer `const` and `let` over `var`
- Function naming: `camelCase`
- Variable naming: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Use descriptive names over short abbreviations
- Indent with 2 spaces

## File Structure
```
/
├── index.html              # Homepage
├── style.css              # Homepage styles  
├── script.js              # Homepage functionality
├── games.json             # Game metadata
├── game-name/             # Individual game directories
│   ├── index.html         # Main game file
│   ├── style.css         # Game styles
│   ├── script.js         # Game logic
│   └── preview.html      # Animated preview (240x240px)
└── docs/                 # AI agent documentation
    ├── AGENTS.md         # Agent guidelines
    └── CODE_CONVENTIONS.md
```

## Game-Specific Conventions
- Each game in its own directory at root level
- Directory names: `kebab-case`
- Always include game title and description
- Consistent control schemes where possible
- Include score/progress indicators
- **Required footer**: Every game must include a footer with text "built by [viveknathani](https://vivekn.dev) and AI • [homepage](../)" with proper styling
- **Required preview**: Each game must include a `preview.html` file with CSS animation showing gameplay

## Preview Animation Requirements
- Size: 240x240px (rendered in iframe on homepage)
- Duration: 6-8 seconds loop
- Style: CSS-only animations, no JavaScript
- Content: Show core gameplay mechanic visually
- Performance: Use `will-change`, `transform`, avoid layout thrashing
- Aesthetics: Match game's visual style and color scheme

## Homepage Integration  
- Games automatically appear on homepage when added to `games.json`
- Preview animations load in iframes with `pointer-events: none`
- Card layout: square grid, 240px cards with preview + title + description
- Text: Single line only, ellipsis overflow

## Performance Guidelines
- Optimize images and assets
- Minimize HTTP requests
- Use efficient algorithms for game loops
- Avoid memory leaks in animations
- Test performance on mobile devices

## Browser Compatibility
- Support modern browsers (Chrome, Firefox, Safari, Edge)
- Use feature detection for newer APIs
- Provide fallbacks for CSS features
- Test on mobile browsers

## Mobile Support Requirements
- **Touch controls**: Implement touch input for all interactive elements
- **Responsive canvas**: Games should scale properly on mobile screens
- **Touch-action CSS**: Use `touch-action: none` to prevent scrolling during gameplay
- **Prevent context menus**: Block long-press context menus on game elements
- **Instructions**: Always show both desktop and mobile controls in UI
- **Testing**: Verify gameplay works smoothly on actual mobile devices
