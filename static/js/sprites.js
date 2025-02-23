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
    }

    draw(ctx) {
        // Draw anime-style player
        ctx.fillStyle = '#FFB6C1';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw face
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 20, 3, 0, Math.PI * 2);
        ctx.arc(this.x + 25, this.y + 20, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw hair
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(this.x + 20, this.y + 10, 10 + i * 2, 0, Math.PI * 2);
            ctx.stroke();
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
    }

    update() {
        this.x += this.speed * this.direction;
        if (this.x > 700 || this.x < 20) {
            this.direction *= -1;
        }
        this.y += Math.sin(Date.now() / 500) * 2;
    }

    draw(ctx) {
        // Draw warlord body
        ctx.fillStyle = '#4B0082';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw wings
        ctx.fillStyle = '#800080';
        ctx.beginPath();
        ctx.moveTo(this.x - 20, this.y + 30);
        ctx.lineTo(this.x + 20, this.y + 20);
        ctx.lineTo(this.x + 20, this.y + 40);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width + 20, this.y + 30);
        ctx.lineTo(this.x + this.width - 20, this.y + 20);
        ctx.lineTo(this.x + this.width - 20, this.y + 40);
        ctx.fill();
    }
}

class Arrow extends Sprite {
    constructor(x, y) {
        super(x, y, 4, 20);
        this.velocityY = -10;
    }

    draw(ctx) {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
