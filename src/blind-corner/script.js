const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Game state
let gameState = 'stopped'; // 'stopped', 'playing', 'paused', 'gameOver'
let animationId = null;
let lastTime = 0;

// UI elements
const distanceDisplay = document.getElementById('distance');
const bestDistanceDisplay = document.getElementById('best-distance');
const finalDistanceDisplay = document.getElementById('final-distance');
const gameOverScreen = document.getElementById('game-over');
const instructionsScreen = document.getElementById('instructions');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

// Game configuration
const INITIAL_SPEED = 3;
const SPEED_INCREASE_RATE = 0.0005;
const MAX_SPEED = 10;
const TRACK_WIDTH = 120;
const CAR_WIDTH = 20;
const CAR_HEIGHT = 30;
const VISIBILITY_RADIUS = 150;
const STEER_SPEED = 4;
const TRACK_CURVE_FREQUENCY = 0.01;
const TRACK_CURVE_AMPLITUDE = 80;

// Game variables
let speed = INITIAL_SPEED;
let distance = 0;
let bestDistance = parseInt(localStorage.getItem('blindCornerBest') || '0');
let carX = 0;
let trackOffset = 0;
let trackSegments = [];

// Input state
let leftPressed = false;
let rightPressed = false;
let touchX = null;

// Initialize canvas size
function resizeCanvas() {
  const container = canvas.parentElement;
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  carX = canvas.width / 2;
}

// Track generation
function generateTrackSegments() {
  trackSegments = [];
  const segmentCount = Math.ceil(canvas.height / 2) + 100;

  for (let i = 0; i < segmentCount; i++) {
    const y = i * 2;
    const centerX = canvas.width / 2 +
      Math.sin(y * TRACK_CURVE_FREQUENCY) * TRACK_CURVE_AMPLITUDE +
      Math.sin(y * TRACK_CURVE_FREQUENCY * 0.5) * TRACK_CURVE_AMPLITUDE * 0.5;

    trackSegments.push({
      y: y,
      centerX: centerX,
      leftEdge: centerX - TRACK_WIDTH / 2,
      rightEdge: centerX + TRACK_WIDTH / 2
    });
  }
}

// Get track segment at a given y position
function getTrackSegment(y) {
  const index = Math.floor((y - trackOffset) / 2);
  if (index < 0 || index >= trackSegments.length) {
    return null;
  }
  return trackSegments[index];
}

// Check collision
function checkCollision() {
  const carY = canvas.height * 0.7;
  const segment = getTrackSegment(carY);

  if (!segment) return false;

  const carLeft = carX - CAR_WIDTH / 2;
  const carRight = carX + CAR_WIDTH / 2;

  return carLeft < segment.leftEdge || carRight > segment.rightEdge;
}

// Draw track
function drawTrack() {
  ctx.fillStyle = '#2d2d2d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw track segments
  for (let i = 0; i < trackSegments.length; i++) {
    const segment = trackSegments[i];
    const y = segment.y + trackOffset;

    if (y < -10 || y > canvas.height + 10) continue;

    // Track surface
    ctx.fillStyle = '#404040';
    ctx.fillRect(segment.leftEdge, y, TRACK_WIDTH, 3);

    // Track edges
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(segment.leftEdge - 2, y, 2, 3);
    ctx.fillRect(segment.rightEdge, y, 2, 3);

    // Center line dashes
    if (i % 10 === 0) {
      ctx.fillStyle = '#666666';
      ctx.fillRect(segment.centerX - 1, y, 2, 8);
    }
  }
}

// Draw fog of war
function drawFog() {
  const carY = canvas.height * 0.7;

  // Create radial gradient for fog effect
  const gradient = ctx.createRadialGradient(
    carX, carY, VISIBILITY_RADIUS * 0.3,
    carX, carY, VISIBILITY_RADIUS
  );
  gradient.addColorStop(0, 'rgba(26, 26, 26, 0)');
  gradient.addColorStop(0.7, 'rgba(26, 26, 26, 0.7)');
  gradient.addColorStop(1, 'rgba(26, 26, 26, 0.98)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Extra fog at edges
  ctx.fillStyle = 'rgba(26, 26, 26, 0.95)';
  ctx.fillRect(0, 0, canvas.width, carY - VISIBILITY_RADIUS);
}

// Draw car
function drawCar() {
  const carY = canvas.height * 0.7;

  // Car body
  ctx.fillStyle = '#ff4444';
  ctx.fillRect(carX - CAR_WIDTH / 2, carY - CAR_HEIGHT / 2, CAR_WIDTH, CAR_HEIGHT);

  // Car windows
  ctx.fillStyle = '#333333';
  ctx.fillRect(carX - CAR_WIDTH / 2 + 3, carY - CAR_HEIGHT / 2 + 3, CAR_WIDTH - 6, 8);

  // Car highlights
  ctx.fillStyle = '#ff6666';
  ctx.fillRect(carX - CAR_WIDTH / 2, carY - CAR_HEIGHT / 2, CAR_WIDTH, 3);
}

// Draw UI
function drawUI() {
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';

  // Speed indicator
  const speedPercent = Math.round((speed / MAX_SPEED) * 100);
  ctx.fillText(`Speed: ${speedPercent}%`, 10, 25);
}

// Update game state
function update(deltaTime) {
  if (gameState !== 'playing') return;

  // Update speed
  speed = Math.min(speed + SPEED_INCREASE_RATE * deltaTime, MAX_SPEED);

  // Update distance
  distance += speed * deltaTime * 0.01;
  distanceDisplay.textContent = Math.floor(distance);

  // Update track offset
  trackOffset += speed;

  // Generate new track segments if needed
  const maxY = trackSegments[trackSegments.length - 1].y;
  if (trackOffset + canvas.height > maxY - 200) {
    const currentLength = trackSegments.length;
    for (let i = 0; i < 50; i++) {
      const y = (currentLength + i) * 2;
      const centerX = canvas.width / 2 +
        Math.sin(y * TRACK_CURVE_FREQUENCY) * TRACK_CURVE_AMPLITUDE +
        Math.sin(y * TRACK_CURVE_FREQUENCY * 0.5) * TRACK_CURVE_AMPLITUDE * 0.5;

      trackSegments.push({
        y: y,
        centerX: centerX,
        leftEdge: centerX - TRACK_WIDTH / 2,
        rightEdge: centerX + TRACK_WIDTH / 2
      });
    }
  }

  // Update car position
  if (leftPressed) {
    carX -= STEER_SPEED;
  }
  if (rightPressed) {
    carX += STEER_SPEED;
  }

  // Handle touch steering
  if (touchX !== null) {
    const diff = touchX - carX;
    if (Math.abs(diff) > 5) {
      carX += Math.sign(diff) * STEER_SPEED;
    }
  }

  // Keep car in bounds
  carX = Math.max(CAR_WIDTH / 2, Math.min(canvas.width - CAR_WIDTH / 2, carX));

  // Check collision
  if (checkCollision()) {
    endGame();
  }
}

// Render game
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTrack();
  drawCar();
  drawFog();
  drawUI();
}

// Game loop
function gameLoop(currentTime) {
  if (gameState === 'stopped') return;

  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  update(deltaTime);
  render();

  animationId = requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
  gameState = 'playing';
  speed = INITIAL_SPEED;
  distance = 0;
  carX = canvas.width / 2;
  trackOffset = 0;
  leftPressed = false;
  rightPressed = false;
  touchX = null;

  generateTrackSegments();

  instructionsScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');

  lastTime = performance.now();
  animationId = requestAnimationFrame(gameLoop);
}

// End game
function endGame() {
  gameState = 'gameOver';

  if (distance > bestDistance) {
    bestDistance = Math.floor(distance);
    localStorage.setItem('blindCornerBest', bestDistance);
    bestDistanceDisplay.textContent = bestDistance;
  }

  finalDistanceDisplay.textContent = Math.floor(distance);
  gameOverScreen.classList.remove('hidden');

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

// Pause/resume game
function togglePause() {
  if (gameState === 'playing') {
    gameState = 'paused';
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  } else if (gameState === 'paused') {
    gameState = 'playing';
    lastTime = performance.now();
    animationId = requestAnimationFrame(gameLoop);
  }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (gameState !== 'playing' && gameState !== 'paused') return;

  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    leftPressed = true;
    e.preventDefault();
  } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    rightPressed = true;
    e.preventDefault();
  } else if (e.key === 'Escape') {
    togglePause();
    e.preventDefault();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    leftPressed = false;
  } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    rightPressed = false;
  }
});

// Touch controls
canvas.addEventListener('touchstart', (e) => {
  if (gameState !== 'playing') return;
  e.preventDefault();

  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  touchX = touch.clientX - rect.left;
});

canvas.addEventListener('touchmove', (e) => {
  if (gameState !== 'playing') return;
  e.preventDefault();

  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  touchX = touch.clientX - rect.left;
});

canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  touchX = null;
});

// Mouse controls (treat like touch for desktop testing)
let mouseDown = false;

canvas.addEventListener('mousedown', (e) => {
  if (gameState !== 'playing') return;
  mouseDown = true;
  const rect = canvas.getBoundingClientRect();
  touchX = e.clientX - rect.left;
});

canvas.addEventListener('mousemove', (e) => {
  if (gameState !== 'playing' || !mouseDown) return;
  const rect = canvas.getBoundingClientRect();
  touchX = e.clientX - rect.left;
});

canvas.addEventListener('mouseup', () => {
  mouseDown = false;
  touchX = null;
});

canvas.addEventListener('mouseleave', () => {
  mouseDown = false;
  touchX = null;
});

// Button event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Window resize handler
window.addEventListener('resize', () => {
  resizeCanvas();
  if (gameState === 'stopped') {
    generateTrackSegments();
    render();
  }
});

// Initialize
resizeCanvas();
bestDistanceDisplay.textContent = bestDistance;
generateTrackSegments();
render();
