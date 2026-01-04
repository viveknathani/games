// Game constants
const CELL_SIZE = 30;
const TILE = {
  PATH: 0,
  WALL: 1,
  START: 2,
  EXIT: 3
};

// Level definitions - progressively more complex with narrow paths and dead ends
const LEVELS = [
  // Level 1 - Simple 8x8 maze with basic challenge
  {
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 1],
      [1, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ]
  },
  // Level 2 - 10x10 with multiple dead ends
  {
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
  },
  // Level 3 - 12x12 with tricky dead ends
  {
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
  },
  // Level 4 - 14x14 with narrow corridors
  {
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
  },
  // Level 5 - 16x16 complex maze
  {
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
  },
  // Level 6 - 18x18 very challenging with lots of dead ends
  {
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
  }
];

// Game state
let currentLevel = 0;
let playerX = 0;
let playerY = 0;
let exitX = 0;
let exitY = 0;
let canvas, ctx;
let canvasWidth, canvasHeight;

// Touch controls
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 30;

// Initialize game
function init() {
  canvas = document.getElementById('game-canvas');
  ctx = canvas.getContext('2d');

  // Event listeners
  document.getElementById('start-btn').addEventListener('click', startGame);
  document.getElementById('restart-level-btn').addEventListener('click', restartLevel);
  document.getElementById('restart-game-btn').addEventListener('click', restartGame);
  document.getElementById('play-again-btn').addEventListener('click', restartGame);

  // Keyboard controls
  document.addEventListener('keydown', handleKeyPress);

  // Touch controls
  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
}

function startGame() {
  document.getElementById('instructions').style.display = 'none';
  document.getElementById('game-wrapper').style.display = 'flex';
  currentLevel = 0;
  loadLevel(currentLevel);
}

function loadLevel(levelIndex) {
  const level = LEVELS[levelIndex];
  const grid = level.grid;
  const rows = grid.length;
  const cols = grid[0].length;

  // Find start and exit positions
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === TILE.START) {
        playerX = x;
        playerY = y;
      } else if (grid[y][x] === TILE.EXIT) {
        exitX = x;
        exitY = y;
      }
    }
  }

  // Set canvas size
  canvasWidth = cols * CELL_SIZE;
  canvasHeight = rows * CELL_SIZE;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Update level number display
  document.getElementById('level-number').textContent = levelIndex + 1;

  render();
}

function render() {
  const level = LEVELS[currentLevel];
  const grid = level.grid;
  const rows = grid.length;
  const cols = grid[0].length;

  // Clear canvas
  ctx.fillStyle = '#1a1f3a';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw maze
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tile = grid[y][x];

      if (tile === TILE.WALL) {
        // Draw wall
        ctx.fillStyle = '#2d3748';
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        // Add subtle border
        ctx.strokeStyle = '#1a1f3a';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      } else {
        // Draw path
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }

  // Draw exit
  ctx.fillStyle = '#00ff88';
  ctx.fillRect(
    exitX * CELL_SIZE + 2,
    exitY * CELL_SIZE + 2,
    CELL_SIZE - 4,
    CELL_SIZE - 4
  );

  // Draw player
  ctx.fillStyle = '#00d4ff';
  ctx.beginPath();
  ctx.arc(
    playerX * CELL_SIZE + CELL_SIZE / 2,
    playerY * CELL_SIZE + CELL_SIZE / 2,
    CELL_SIZE / 2 - 4,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function handleKeyPress(e) {
  let newX = playerX;
  let newY = playerY;

  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      newY--;
      e.preventDefault();
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      newY++;
      e.preventDefault();
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      newX--;
      e.preventDefault();
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      newX++;
      e.preventDefault();
      break;
    default:
      return;
  }

  movePlayer(newX, newY);
}

function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

function handleTouchEnd(e) {
  e.preventDefault();
  const touch = e.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  // Determine swipe direction
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX > 0) {
        movePlayer(playerX + 1, playerY); // Right
      } else {
        movePlayer(playerX - 1, playerY); // Left
      }
    }
  } else {
    // Vertical swipe
    if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
      if (deltaY > 0) {
        movePlayer(playerX, playerY + 1); // Down
      } else {
        movePlayer(playerX, playerY - 1); // Up
      }
    }
  }
}

function movePlayer(newX, newY) {
  const grid = LEVELS[currentLevel].grid;
  const rows = grid.length;
  const cols = grid[0].length;

  // Check bounds
  if (newX < 0 || newX >= cols || newY < 0 || newY >= rows) {
    return;
  }

  // Check wall collision
  if (grid[newY][newX] === TILE.WALL) {
    return;
  }

  // Move player
  playerX = newX;
  playerY = newY;

  render();

  // Check if reached exit
  if (playerX === exitX && playerY === exitY) {
    handleLevelComplete();
  }
}

function handleLevelComplete() {
  if (currentLevel < LEVELS.length - 1) {
    // Show transition to next level
    showTransition(`Level ${currentLevel + 2}`);
    setTimeout(() => {
      currentLevel++;
      loadLevel(currentLevel);
    }, 1500);
  } else {
    // All levels completed
    showCompletion();
  }
}

function showTransition(text) {
  const screen = document.getElementById('transition-screen');
  const textElement = screen.querySelector('.transition-text');
  textElement.textContent = text;
  screen.classList.add('active');

  setTimeout(() => {
    screen.classList.remove('active');
  }, 1500);
}

function showCompletion() {
  document.getElementById('game-wrapper').style.display = 'none';
  document.getElementById('completion-screen').classList.add('active');
}

function restartLevel() {
  loadLevel(currentLevel);
}

function restartGame() {
  document.getElementById('completion-screen').classList.remove('active');
  document.getElementById('instructions').style.display = 'block';
  document.getElementById('game-wrapper').style.display = 'none';
  currentLevel = 0;
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
