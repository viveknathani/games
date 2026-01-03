class PrimeOrTrapGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    
    this.gameState = 'menu'; // menu, playing, gameOver
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.bestScore = parseInt(localStorage.getItem('prime-or-trap-best') || '0');
    
    this.numbers = [];
    this.lastSpawn = 0;
    this.spawnInterval = 1200; // Start with 1.2 seconds between spawns
    
    this.minNumber = 2;
    this.maxNumber = 20;
    
    this.setupEventListeners();
    this.updateDisplay();
    this.gameLoop();
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.resizeCanvas());
    
    document.getElementById('start-btn').addEventListener('click', () => {
      this.startGame();
    });
    
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.restartGame();
    });
    
    this.canvas.addEventListener('click', (e) => {
      if (this.gameState === 'playing') {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.handleClick(x, y);
      }
    });
    
    // Touch support
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.gameState === 'playing') {
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        this.handleClick(x, y);
      }
    });
  }

  startGame() {
    this.gameState = 'playing';
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.numbers = [];
    this.lastSpawn = Date.now();
    this.spawnInterval = 1200;
    this.minNumber = 2;
    this.maxNumber = 20;
    
    document.getElementById('instructions').classList.add('hidden');
    this.updateDisplay();
  }

  restartGame() {
    document.getElementById('game-over').classList.add('hidden');
    this.startGame();
  }

  spawnNumber() {
    const now = Date.now();
    if (now - this.lastSpawn > this.spawnInterval) {
      const value = Math.floor(Math.random() * (this.maxNumber - this.minNumber + 1)) + this.minNumber;
      const x = Math.random() * (this.canvas.width - 60) + 30;
      
      this.numbers.push({
        value: value,
        x: x,
        y: -30,
        speed: 1 + (this.level - 1) * 0.3,
        size: 30,
        isPrime: this.isPrime(value),
        clicked: false
      });
      
      this.lastSpawn = now;
    }
  }

  updateNumbers() {
    for (let i = this.numbers.length - 1; i >= 0; i--) {
      const number = this.numbers[i];
      number.y += number.speed;
      
      // Remove numbers that fell off screen
      if (number.y > this.canvas.height + 50) {
        if (number.isPrime && !number.clicked) {
          // Missed a prime number
          this.lives--;
          if (this.lives <= 0) {
            this.endGame('You missed a prime number!');
            return;
          }
        }
        this.numbers.splice(i, 1);
      }
    }
  }

  handleClick(x, y) {
    for (let i = this.numbers.length - 1; i >= 0; i--) {
      const number = this.numbers[i];
      const dx = x - number.x;
      const dy = y - number.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < number.size && !number.clicked) {
        number.clicked = true;
        
        if (number.isPrime) {
          // Clicked a prime - good!
          this.score += 10 * this.level;
          this.createParticles(number.x, number.y, '#4ecdc4', '✓');
        } else {
          // Clicked a composite - bad!
          this.createParticles(number.x, number.y, '#ff6b6b', '✗');
          this.endGame('You clicked a composite number!');
          return;
        }
        
        this.numbers.splice(i, 1);
        this.updateDisplay();
        this.checkLevelUp();
        break;
      }
    }
  }

  createParticles(x, y, color, symbol) {
    // Simple particle effect - could be enhanced later
    this.ctx.fillStyle = color;
    this.ctx.font = 'bold 20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(symbol, x, y);
  }

  checkLevelUp() {
    const newLevel = Math.floor(this.score / 100) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.spawnInterval = Math.max(400, 1200 - (this.level - 1) * 150);
      this.maxNumber = Math.min(100, 20 + (this.level - 1) * 10);
      this.updateDisplay();
    }
  }

  endGame(reason) {
    this.gameState = 'gameOver';
    
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('prime-or-trap-best', this.bestScore.toString());
    }
    
    document.getElementById('game-over-reason').textContent = reason;
    document.getElementById('final-score').textContent = this.score;
    document.getElementById('best-score').textContent = this.bestScore;
    document.getElementById('game-over').classList.remove('hidden');
  }

  updateDisplay() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('level').textContent = this.level;
    document.getElementById('lives').textContent = this.lives;
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.gameState === 'playing') {
      // Draw numbers
      this.numbers.forEach(number => {
        this.ctx.save();
        
        // Number circle background
        this.ctx.fillStyle = number.isPrime ? 
          'rgba(76, 205, 196, 0.9)' : 
          'rgba(255, 107, 107, 0.9)';
        this.ctx.beginPath();
        this.ctx.arc(number.x, number.y, number.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Number border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Number text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(number.value.toString(), number.x, number.y);
        
        this.ctx.restore();
      });
      
      // Draw level indicator
      if (this.numbers.length > 0) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Range: ${this.minNumber}-${this.maxNumber}`, 10, 30);
      }
    }
  }

  gameLoop() {
    if (this.gameState === 'playing') {
      this.spawnNumber();
      this.updateNumbers();
    }
    
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.game = new PrimeOrTrapGame();
});