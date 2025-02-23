class Sprite {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collidesWith(other) {
        return !(this.x > other.x + other.width ||
                this.x + this.width < other.x ||
                this.y > other.y + other.height ||
                this.y + this.height < other.y);
    }
}

class Player extends Sprite {
    constructor(x, y) {
        super(x, y, 40, 60);
        this.health = 5;
        this.speed = 5;
        this.arrows = [];
        this.sprite = new Image();
        this.sprite.src = '/static/assets/player.svg';
    }

    draw(ctx) {
        if (this.sprite.complete) {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }
    }

    shoot() {
        const arrow = new Arrow(this.x + this.width / 2, this.y);
        this.arrows.push(arrow);
        audioManager.playShootSound();
    }
}

class Warlord extends Sprite {
    constructor(x, y) {
        super(x, y, 80, 60);
        this.health = 10;
        this.speed = 3;
        this.direction = 1;
        this.sprite = new Image();
        this.sprite.src = '/static/assets/warlord.svg';
        this.bombs = [];
        this.lastBombTime = 0;
        this.bombInterval = 2000; // Drop bomb every 2 seconds
    }

    update() {
        this.x += this.speed * this.direction;
        if (this.x > 700 || this.x < 20) {
            this.direction *= -1;
        }
        this.y += Math.sin(Date.now() / 500) * 2;

        // Update bombs
        this.bombs.forEach(bomb => bomb.update());
        this.bombs = this.bombs.filter(bomb => bomb.y < 600);

        // Drop new bomb
        const currentTime = Date.now();
        if (currentTime - this.lastBombTime > this.bombInterval) {
            this.dropBomb();
            this.lastBombTime = currentTime;
        }
    }

    draw(ctx) {
        if (this.sprite.complete) {
            ctx.save();
            if (this.direction < 0) {
                ctx.scale(-1, 1);
                ctx.drawImage(this.sprite, -this.x - this.width, this.y, this.width, this.height);
            } else {
                ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
            }
            ctx.restore();
        }
        // Draw bombs
        this.bombs.forEach(bomb => bomb.draw(ctx));
    }

    dropBomb() {
        const bomb = new Bomb(this.x + this.width / 2, this.y + this.height);
        this.bombs.push(bomb);
    }
}

class Arrow extends Sprite {
    constructor(x, y) {
        super(x, y, 4, 20);
        this.velocityY = -10;
        this.sprite = new Image();
        this.sprite.src = '/static/assets/arrow.svg';
    }

    draw(ctx) {
        if (this.sprite.complete) {
            ctx.save();
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
            ctx.restore();
        }
    }
}

class Bomb extends Sprite {
    constructor(x, y) {
        super(x, y, 20, 30);
        this.velocityY = 5;
        this.sprite = new Image();
        this.sprite.src = '/static/assets/bomb.svg';
    }

    draw(ctx) {
        if (this.sprite.complete) {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        }
    }
    update() {
        this.y += this.velocityY;
    }
}