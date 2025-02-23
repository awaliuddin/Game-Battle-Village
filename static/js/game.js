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
        this.setupEventListeners();
        this.gameLoop();
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

        // Initialize audio on first user interaction
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
                    this.resetGame();
                }
                continue;
            }

            // Remove arrows that are off screen
            if (arrow.y < 0) {
                this.player.arrows.splice(i, 1);
            }
        }

        // Check if warlord hits player
        if (this.warlord.collidesWith(this.player)) {
            this.player.health--;
            audioManager.playDamageSound();
            
            if (this.player.health <= 0) {
                alert('Game Over! Score: ' + this.score);
                this.resetGame();
            }
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw village background
        this.drawVillage();

        // Draw game objects
        this.player.draw(this.ctx);
        this.warlord.draw(this.ctx);
        this.player.arrows.forEach(arrow => arrow.draw(this.ctx));

        // Draw health
        this.drawHealth();
        
        // Draw score
        document.getElementById('score').textContent = `Score: ${this.score}`;
    }

    drawVillage() {
        // Draw sky
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ground
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(0, 550, this.canvas.width, 50);

        // Draw houses
        for (let i = 0; i < 5; i++) {
            this.drawHouse(100 + i * 150, 450);
        }
    }

    drawHouse(x, y) {
        this.ctx.fillStyle = '#CD853F';
        this.ctx.fillRect(x, y, 60, 60);
        
        // Roof
        this.ctx.fillStyle = '#8B4513';
        this.ctx.beginPath();
        this.ctx.moveTo(x - 10, y);
        this.ctx.lineTo(x + 30, y - 30);
        this.ctx.lineTo(x + 70, y);
        this.ctx.fill();
    }

    drawHealth() {
        const heartSize = 20;
        const spacing = 25;

        // Player health
        for (let i = 0; i < this.player.health; i++) {
            this.drawHeart(10 + i * spacing, 10, heartSize, '#FF0000');
        }

        // Warlord health
        for (let i = 0; i < this.warlord.health; i++) {
            this.drawHeart(this.canvas.width - (spacing * 11) + i * spacing, 10, heartSize, '#800080');
        }
    }

    drawHeart(x, y, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x + size/2, y + size/4);
        this.ctx.bezierCurveTo(x + size/2, y, x, y, x, y + size/4);
        this.ctx.bezierCurveTo(x, y + size/2, x + size/2, y + size, x + size/2, y + size);
        this.ctx.bezierCurveTo(x + size/2, y + size, x + size, y + size/2, x + size, y + size/4);
        this.ctx.bezierCurveTo(x + size, y, x + size/2, y, x + size/2, y + size/4);
        this.ctx.fill();
    }

    resetGame() {
        // Save game stats before reset
        const gameStats = {
            score: this.score,
            playerHealth: this.player.health,
            warlordHealth: this.warlord.health,
            arrowsShot: this.player.arrows.length,
            hits: Math.floor(this.score / 100) // Each hit gives 100 points
        };

        // Send score to server
        fetch('/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameStats)
        }).catch(err => console.error('Error saving score:', err));

        // Reset game state
        this.player.health = 5;
        this.warlord.health = 10;
        this.score = 0;
        this.player.x = 380;
        this.warlord.x = 360;
        this.player.arrows = [];
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.onload = () => {
    new Game();
};