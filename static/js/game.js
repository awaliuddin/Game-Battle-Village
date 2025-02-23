class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;

        this.player = new Player(380, 500);
        this.warlord = new Warlord(360, 100);
        this.score = 0;

        this.keys = {};
        this.villageBackground = new Image();
        this.villageBackground.src = '/static/assets/village.svg';

        this.setupEventListeners();
        this.gameLoop();
        this.updateHighScores();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ') {
                this.player.shoot();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        window.addEventListener('click', () => {
            audioManager.initialize();
        });
    }

    update() {
        // Player movement
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] && this.player.x < this.canvas.width - this.player.width) {
            this.player.x += this.player.speed;
        }

        // Update warlord
        this.warlord.update();

        // Update arrows
        for (let i = this.player.arrows.length - 1; i >= 0; i--) {
            const arrow = this.player.arrows[i];
            arrow.update();

            // Check collision with warlord
            if (arrow.collidesWith(this.warlord)) {
                this.warlord.health--;
                this.score += 100;
                this.player.arrows.splice(i, 1);
                audioManager.playHitSound();

                if (this.warlord.health <= 0) {
                    alert('Victory! Final Score: ' + this.score);
                    this.saveScore();
                    this.resetGame();
                }
                continue;
            }

            // Remove arrows that are off screen
            if (arrow.y < 0) {
                this.player.arrows.splice(i, 1);
            }
        }

        // Check bomb collisions with player
        for (let i = this.warlord.bombs.length - 1; i >= 0; i--) {
            const bomb = this.warlord.bombs[i];
            if (bomb.collidesWith(this.player)) {
                this.player.health--;
                this.warlord.bombs.splice(i, 1);
                audioManager.playDamageSound();

                if (this.player.health <= 0) {
                    alert('Game Over! Score: ' + this.score);
                    this.saveScore();
                    this.resetGame();
                }
            }
        }

        // Check if warlord hits player
        if (this.warlord.collidesWith(this.player)) {
            this.player.health--;
            audioManager.playDamageSound();

            if (this.player.health <= 0) {
                alert('Game Over! Score: ' + this.score);
                this.saveScore();
                this.resetGame();
            }
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw village background
        if (this.villageBackground.complete) {
            this.ctx.drawImage(this.villageBackground, 0, 0, this.canvas.width, this.canvas.height);
        }

        // Draw game objects
        this.player.draw(this.ctx);
        this.warlord.draw(this.ctx);
        this.player.arrows.forEach(arrow => arrow.draw(this.ctx));

        // Draw health
        this.drawHealth();

        // Draw score
        document.getElementById('score').textContent = `Score: ${this.score}`;
    }

    drawHealth() {
        const heartImage = new Image();
        heartImage.src = '/static/assets/heart.svg';
        const heartSize = 20;
        const spacing = 25;

        if (heartImage.complete) {
            // Player health
            for (let i = 0; i < this.player.health; i++) {
                this.ctx.drawImage(heartImage, 10 + i * spacing, 10, heartSize, heartSize);
            }

            // Warlord health
            for (let i = 0; i < this.warlord.health; i++) {
                this.ctx.drawImage(heartImage, this.canvas.width - (spacing * 11) + i * spacing, 10, heartSize, heartSize);
            }
        }
    }

    saveScore() {
        const gameStats = {
            score: this.score,
            playerHealth: this.player.health,
            warlordHealth: this.warlord.health,
            arrowsShot: this.player.arrows.length,
            hits: Math.floor(this.score / 100)
        };

        fetch('/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameStats)
        })
        .then(() => this.updateHighScores())
        .catch(err => console.error('Error saving score:', err));
    }

    resetGame() {
        this.player.health = 5;
        this.warlord.health = 10;
        this.score = 0;
        this.player.x = 380;
        this.warlord.x = 360;
        this.player.arrows = [];
        this.warlord.bombs = []; // Added to clear bombs on reset
    }

    updateHighScores() {
        fetch('/api/scores')
            .then(response => response.json())
            .then(scores => {
                const scoresList = document.getElementById('scores-list');
                scoresList.innerHTML = scores.map(score => `
                    <div class="score-entry">
                        <span>${score.score} points</span>
                        <small> (${new Date(score.created_at).toLocaleDateString()})</small>
                    </div>
                `).join('');
            })
            .catch(err => console.error('Error fetching scores:', err));
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.onload = () => {
    new Game();
};