# AI Agent Guidelines for Games Site

## Project Overview
- Static games site hosting simple HTML/CSS/JS browser games
- Games are created by AI agents based on human creative direction
- Focus on instant playability, no downloads or complex setup
- Each game is self-contained and works offline

## Core Development Principles

### 1. Simplicity First
- Games should be playable in seconds, not minutes
- Avoid complex mechanics that require tutorials
- Use intuitive controls (WASD, arrow keys, mouse)
- Keep UI minimal and functional

### 2. Technical Requirements
- **Vanilla web tech only**: HTML, CSS, JavaScript
- **No external dependencies**: No frameworks, libraries, or APIs
- **Mobile responsive**: Touch-friendly and works on phones
- **Performance optimized**: 60fps gameplay, fast loading
- **Touch controls**: All games must support touch input for mobile

### 3. Game Structure Standards
```
game-name/
├── index.html    # Main game file with embedded styles/scripts if small
├── style.css     # Game-specific styles  
├── script.js     # Game logic and mechanics
└── preview.html  # Homepage preview animation
```

## Required Components

### Game Files
- **Main game**: Fully functional standalone game
- **Favicon**: Game-specific emoji using SVG data URI format
- **Footer**: "built by [viveknathani](https://vivekn.dev) and AI • [homepage](../)"
- **Instructions**: Clear controls/objective within the game UI
- **Responsive design**: Works on desktop and mobile

### Preview Animation  
- **CSS-only animation**: No JavaScript in preview
- **240x240px dimensions**: Fits homepage card layout
- **6-8 second loop**: Shows core gameplay mechanic
- **Visual accuracy**: Matches actual game appearance
- **Performance optimized**: Hardware acceleration, smooth 60fps

## Game Metadata
Update `games.json` with:
```json
{
  "id": "game-folder-name",
  "title": "Display Name",
  "description": "Single line description",
  "icon": "🎮",
  "created": "ISO date"
}
```

## Quality Standards

### Gameplay
- **Immediate engagement**: Fun within first 30 seconds
- **Clear objective**: Player understands what to do
- **Progressive difficulty**: Starts easy, gets challenging
- **Fair mechanics**: Skill-based, not luck-based
- **Edge case handling**: Graceful failures, no crashes

### Code Quality  
- **Clean, readable code**: Well-structured and commented
- **Error handling**: Graceful degradation on failures
- **Browser compatibility**: Works on modern browsers
- **Performance**: Smooth animations, responsive input
- **Security**: No vulnerabilities or unsafe practices

## Development Workflow

### For Each New Game:
1. **Create game directory** with kebab-case naming
2. **Implement core gameplay** with clean, efficient code
3. **Add responsive styling** that works on all devices
4. **Create preview animation** showing gameplay essence
5. **Update games.json** with metadata
6. **Test thoroughly** on desktop and mobile
7. **Verify homepage integration** loads correctly

### Remember
- Human provides creative direction and ideas
- AI implements with technical excellence
- Focus on player experience over technical complexity
- Every game should feel polished and complete
- Consistency across games while allowing creative freedom