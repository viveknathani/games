class GameManager {
  constructor() {
    this.games = [];
    this.init();
  }

  async init() {
    await this.loadGames();
    this.renderGames();
    this.setupEventListeners();
  }

  async loadGames() {
    try {
      const response = await fetch('./games.json');
      if (response.ok) {
        const data = await response.json();
        this.games = data.games || [];
      }
    } catch (error) {
      console.log('No games.json found, starting with empty game list');
      this.games = [];
    }
  }

  renderGames() {
    const gamesGrid = document.getElementById('games-grid');
    if (!gamesGrid) return;

    if (this.games.length === 0) {
      gamesGrid.innerHTML = `
        <div class="game-card placeholder">
          <h3>Your First Game</h3>
          <p>Coming soon...</p>
        </div>
      `;
      return;
    }

    gamesGrid.innerHTML = this.games
      .map(game => this.createGameCard(game))
      .join('');
  }

  createGameCard(game) {
    return `
      <div class="game-card" data-game="${game.id}">
        <div class="game-preview">
          <iframe src="./${game.id}/preview.html" class="preview-frame" frameborder="0"></iframe>
        </div>
        <h3>${game.title}</h3>
        <p>${game.description}</p>
      </div>
    `;
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      const gameCard = e.target.closest('.game-card');
      if (gameCard && !gameCard.classList.contains('placeholder')) {
        const gameId = gameCard.dataset.game;
        this.openGame(gameId);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeGame();
      }
    });
  }

  openGame(gameId) {
    const game = this.games.find(g => g.id === gameId);
    if (game) {
      window.location.href = `./${gameId}/`;
    }
  }

  closeGame() {
  }

  addGame(gameData) {
    this.games.push({
      id: gameData.id,
      title: gameData.title,
      description: gameData.description,
      icon: gameData.icon || '🎮',
      created: new Date().toISOString()
    });
    
    this.saveGames();
    this.renderGames();
  }

  async saveGames() {
    const gamesData = {
      games: this.games,
      lastUpdated: new Date().toISOString()
    };

    console.log('Games data to save:', gamesData);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.gameManager = new GameManager();
});

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
