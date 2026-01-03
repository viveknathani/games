class DontTouchTheCenterGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 500;
    this.canvas.height = 500;
    
    this.gameState = 'menu'; // menu, playing, paused, gameOver
    this.keys = {};
    this.startTime = 0;
    this.elapsedTime = 0;
    this.bestTime = parseFloat(localStorage.getItem('dttc-best-time') || '0');
    
    // Game objects
    this.player = {
      x: this.canvas.width * 0.8,
      y: this.canvas.height * 0.2,
      vx: 0,
      vy: 0,
      radius: 8,
      color: '#2c3e50'
    };
    
    this.center = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      radius: 40,
      color: '#e74c3c'
    };
    
    // Game physics
    this.gravity = 0.08;
    this.friction = 0.98;
    this.playerSpeed = 1.2; // Increased base speed for more responsive movement
    this.touchSpeed = 1.5; // Higher speed for touch controls
    this.maxSpeed = 12; // Increased max speed to allow faster movement
    
    // Difficulty progression
    this.difficultyTimer = 0;
    this.randomForceTimer = 0;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateBestTimeDisplay();
    this.gameLoop();
  }
  
  setupEventListeners() {
    // Keyboard events
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      
      if (e.key === 'Escape') {
        if (this.gameState === 'playing') {
          this.pauseGame();
        } else if (this.gameState === 'paused') {
          this.resumeGame();
        }
      }
      
      e.preventDefault();
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
    
    // Button events
    document.getElementById('start-btn').addEventListener('click', () => {
      this.startGame();
    });
    
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.startGame();
    });
    
    // Focus management
    window.addEventListener('blur', () => {
      if (this.gameState === 'playing') {
        this.pauseGame();
      }
    });

    // Touch controls for mobile
    this.setupTouchControls();
  }
  
  startGame() {
    this.gameState = 'playing';
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.difficultyTimer = 0;
    this.randomForceTimer = 0;
    
    // Reset player position
    this.player.x = this.canvas.width * 0.8;
    this.player.y = this.canvas.height * 0.2;
    this.player.vx = 0;
    this.player.vy = 0;
    
    // Reset difficulty
    this.gravity = 0.08;
    
    // Hide overlays
    document.getElementById('instructions').classList.add('hidden');
    document.getElementById('game-over').classList.add('hidden');
  }
  
  pauseGame() {
    this.gameState = 'paused';
  }
  
  resumeGame() {
    this.gameState = 'playing';
    this.startTime = Date.now() - this.elapsedTime * 1000;
  }
  
  endGame() {
    this.gameState = 'gameOver';
    
    // Update best time
    if (this.elapsedTime > this.bestTime) {
      this.bestTime = this.elapsedTime;
      localStorage.setItem('dttc-best-time', this.bestTime.toString());
      this.updateBestTimeDisplay();
    }
    
    // Show game over screen
    document.getElementById('final-time').textContent = this.elapsedTime.toFixed(1);
    document.getElementById('game-over').classList.remove('hidden');
  }
  
  updateTimer() {
    if (this.gameState === 'playing') {
      this.elapsedTime = (Date.now() - this.startTime) / 1000;
      document.getElementById('timer').textContent = this.elapsedTime.toFixed(1) + 's';
    }
  }
  
  updateBestTimeDisplay() {
    document.getElementById('best-time').textContent = this.bestTime.toFixed(1) + 's';
  }
  
  setupTouchControls() {
    this.touchInput = { x: 0, y: 0 };
    this.isMoving = false;

    const canvas = this.canvas;
    
    // Touch start
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.isMoving = true;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      this.updateTouchInput(touch, rect);
    });

    // Touch move
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.isMoving) return;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      this.updateTouchInput(touch, rect);
    });

    // Touch end
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.isMoving = false;
      this.touchInput.x = 0;
      this.touchInput.y = 0;
    });

    // Prevent context menu on long press
    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  updateTouchInput(touch, rect) {
    // Get touch position relative to canvas
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    // Convert to canvas coordinates
    const canvasX = (touchX / rect.width) * this.canvas.width;
    const canvasY = (touchY / rect.height) * this.canvas.height;
    
    // Calculate direction from player to touch point
    const dx = canvasX - this.player.x;
    const dy = canvasY - this.player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 15) { // Slightly larger dead zone for mobile
      // Normalize direction and apply intensity based on distance
      const intensity = Math.min(distance / 80, 1.5); // Higher max intensity, closer distance threshold
      this.touchInput.x = (dx / distance) * intensity;
      this.touchInput.y = (dy / distance) * intensity;
    } else {
      this.touchInput.x = 0;
      this.touchInput.y = 0;
    }
  }

  handleInput() {
    if (this.gameState !== 'playing') return;
    
    let inputX = 0;
    let inputY = 0;
    
    // Keyboard controls
    if (this.keys['w'] || this.keys['arrowup']) inputY -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) inputY += 1;
    if (this.keys['a'] || this.keys['arrowleft']) inputX -= 1;
    if (this.keys['d'] || this.keys['arrowright']) inputX += 1;
    
    // Touch controls (use higher speed multiplier)
    if (this.isMoving) {
      inputX = this.touchInput.x;
      inputY = this.touchInput.y;
    }
    
    // Apply input forces (different speeds for keyboard vs touch)
    const speedMultiplier = this.isMoving ? this.touchSpeed : this.playerSpeed;
    this.player.vx += inputX * speedMultiplier;
    this.player.vy += inputY * speedMultiplier;
  }
  
  updatePhysics() {
    if (this.gameState !== 'playing') return;
    
    // Update difficulty over time
    this.difficultyTimer += 1/60;
    this.gravity = 0.08 + (this.difficultyTimer * 0.002);
    
    // Add random forces periodically
    this.randomForceTimer += 1/60;
    if (this.randomForceTimer > 2) {
      const randomAngle = Math.random() * Math.PI * 2;
      const randomForce = 0.3 + (this.difficultyTimer * 0.01);
      this.player.vx += Math.cos(randomAngle) * randomForce;
      this.player.vy += Math.sin(randomAngle) * randomForce;
      this.randomForceTimer = 0;
    }
    
    // Apply gravity toward center
    const dx = this.center.x - this.player.x;
    const dy = this.center.y - this.player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      const gravityForce = this.gravity;
      this.player.vx += (dx / distance) * gravityForce;
      this.player.vy += (dy / distance) * gravityForce;
    }
    
    // Apply friction
    this.player.vx *= this.friction;
    this.player.vy *= this.friction;
    
    // Limit max speed
    const speed = Math.sqrt(this.player.vx * this.player.vx + this.player.vy * this.player.vy);
    if (speed > this.maxSpeed) {
      this.player.vx = (this.player.vx / speed) * this.maxSpeed;
      this.player.vy = (this.player.vy / speed) * this.maxSpeed;
    }
    
    // Update position
    this.player.x += this.player.vx;
    this.player.y += this.player.vy;
    
    // Keep player in bounds (with some bounce)
    if (this.player.x - this.player.radius < 0) {
      this.player.x = this.player.radius;
      this.player.vx *= -0.5;
    }
    if (this.player.x + this.player.radius > this.canvas.width) {
      this.player.x = this.canvas.width - this.player.radius;
      this.player.vx *= -0.5;
    }
    if (this.player.y - this.player.radius < 0) {
      this.player.y = this.player.radius;
      this.player.vy *= -0.5;
    }
    if (this.player.y + this.player.radius > this.canvas.height) {
      this.player.y = this.canvas.height - this.player.radius;
      this.player.vy *= -0.5;
    }
  }
  
  checkCollisions() {
    if (this.gameState !== 'playing') return;
    
    // Check if player touches the center
    const dx = this.player.x - this.center.x;
    const dy = this.player.y - this.center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < this.player.radius + this.center.radius) {
      this.endGame();
    }
  }
  
  render() {
    // Clear canvas
    this.ctx.fillStyle = '#fafafa';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw center danger zone
    this.ctx.fillStyle = this.center.color;
    this.ctx.globalAlpha = 0.8;
    this.ctx.beginPath();
    this.ctx.arc(this.center.x, this.center.y, this.center.radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw center outline
    this.ctx.globalAlpha = 1;
    this.ctx.strokeStyle = this.center.color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.center.x, this.center.y, this.center.radius, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // Draw player
    this.ctx.fillStyle = this.player.color;
    this.ctx.beginPath();
    this.ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw player outline
    this.ctx.strokeStyle = this.player.color;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // Draw pause overlay
    if (this.gameState === 'paused') {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#333';
      this.ctx.font = '24px -apple-system, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.font = '14px -apple-system, sans-serif';
      this.ctx.fillText('Press ESC to resume', this.canvas.width / 2, this.canvas.height / 2 + 30);
    }
  }
  
  update() {
    this.updateTimer();
    this.handleInput();
    this.updatePhysics();
    this.checkCollisions();
  }
  
  gameLoop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
  new DontTouchTheCenterGame();
});