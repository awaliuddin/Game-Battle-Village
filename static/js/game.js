class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();

        this.player = new Player(380, 500);
        this.warlord = new Warlord(360, 100);
        this.score = 0;

        this.keys = {};
        this.isTouchDevice = 'ontouchstart' in window;
        this.touchControls = {
            leftPressed: false,
            rightPressed: false
        };

        this.villageBackground = new Image();
        this.villageBackground.src = '/static/assets/village.svg';

        this.setupEventListeners();
        this.gameLoop();
        this.updateHighScores();
    }

    setupCanvas() {
        const resizeCanvas = () => {
            const container = document.getElementById('game-container');
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            // Set canvas size to match container while maintaining aspect ratio
            const aspectRatio = 800 / 600;
            let width = containerWidth;
            let height = containerWidth / aspectRatio;

            if (height > containerHeight) {
                height = containerHeight;
                width = containerHeight * aspectRatio;
            }

            this.canvas.width = width;
            this.canvas.height = height;

            // Store the scale for use in rendering
            this.scale = {
                x: width / 800,
                y: height / 600
            };
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
    }

    setupEventListeners() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ') {
                this.player.shoot();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Touch controls
        if (this.isTouchDevice) {
            this.setupTouchControls();
        }

        window.addEventListener('click', () => {
            audioManager.initialize();
        });
    }

    setupTouchControls() {
        const touchControls = document.createElement('div');
        touchControls.id = 'touch-controls';
        touchControls.innerHTML = `
            <div class="move-controls">
                <div class="control-button" id="moveLeft">←</div>
                <div class="control-button" id="moveRight">→</div>
            </div>
            <div class="control-button" id="shoot">🏹</div>
        `;
        document.getElementById('game-container').appendChild(touchControls);

        // Move left
        const leftBtn = document.getElementById('moveLeft');
        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls.leftPressed = true;
        });
        leftBtn.addEventListener('touchend', () => {
            this.touchControls.leftPressed = false;
        });

        // Move right
        const rightBtn = document.getElementById('moveRight');
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchControls.rightPressed = true;
        });
        rightBtn.addEventListener('touchend', () => {
            this.touchControls.rightPressed = false;
        });

        // Shoot
        const shootBtn = document.getElementById('shoot');
        shootBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.player.shoot();
        });
    }

    update() {
        // Player movement from both keyboard and touch
        if ((this.keys['ArrowLeft'] || this.touchControls.leftPressed) && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if ((this.keys['ArrowRight'] || this.touchControls.rightPressed) && this.player.x < 800 - this.player.width) {
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
        // Clear canvas and set proper scaling
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Scale everything to match canvas size
        this.ctx.scale(this.scale.x, this.scale.y);

        // Draw village background contained within game area
        if (this.villageBackground.complete) {
            this.ctx.drawImage(this.villageBackground, 0, 0, 800, 600);
        }

        // Draw game objects
        this.player.draw(this.ctx);
        this.warlord.draw(this.ctx);
        this.player.arrows.forEach(arrow => arrow.draw(this.ctx));

        // Draw health
        this.drawHealth();

        // Update score display
        document.getElementById('score').textContent = `Score: ${this.score}`;

        this.ctx.restore();
    }

    drawHealth() {
        const heartImage = new Image();
        heartImage.src = '/static/assets/heart.svg';

        // Calculate heart size based on screen size
        const baseHeartSize = 20;
        const heartSize = Math.max(baseHeartSize, Math.min(30, this.canvas.width / 25));
        const spacing = heartSize * 1.25;
        const yOffset = Math.max(10, this.canvas.height / 30);

        if (heartImage.complete) {
            // Player health - positioned from left
            for (let i = 0; i < this.player.health; i++) {
                this.ctx.drawImage(heartImage, 
                    10 + i * spacing, 
                    yOffset, 
                    heartSize, 
                    heartSize);
            }

            // Warlord health - positioned from right
            for (let i = 0; i < this.warlord.health; i++) {
                this.ctx.drawImage(heartImage, 
                    800 - (spacing * (this.warlord.health - i)), 
                    yOffset, 
                    heartSize, 
                    heartSize);
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
        this.warlord.bombs = [];
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