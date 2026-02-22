import Entity from './Entity.js';

// Le vaisseau du joueur — hérite d'Entity
// Gère le mouvement horizontal, le tir, les vies et l'invincibilité

export default class Player extends Entity {
    constructor(gameWidth, gameHeight, input) {
        const width = 40;
        const height = 40;
        super(gameWidth / 2 - width / 2, gameHeight - height - 20, width, height);

        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.input = input;
        this.speed = 350;
        this.lives = 3;
        this.maxLives = 5;

        // Tir
        this.shootCooldown = 0;
        this.shootRate = 0.2; // secondes entre chaque tir

        // Invincibilité temporaire après un hit
        this.invincible = false;
        this.invincibleTimer = 0;
        this.invincibleDuration = 1.5;
        this.blinkTimer = 0;
        this.visible = true;
    }

    update(dt) {
        // Mouvement horizontal
        this.velocityX = 0;
        if (this.input.isKeyDown('ArrowLeft') || this.input.isKeyDown('KeyA')) {
            this.velocityX = -this.speed;
        }
        if (this.input.isKeyDown('ArrowRight') || this.input.isKeyDown('KeyD')) {
            this.velocityX = this.speed;
        }

        super.update(dt);

        // Limiter aux bords du canvas
        this.x = Math.max(0, Math.min(this.gameWidth - this.width, this.x));

        // Cooldown du tir
        if (this.shootCooldown > 0) {
            this.shootCooldown -= dt;
        }

        // Gestion de l'invincibilité
        if (this.invincible) {
            this.invincibleTimer -= dt;
            this.blinkTimer += dt;
            // Clignotement visuel
            this.visible = Math.floor(this.blinkTimer * 10) % 2 === 0;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
                this.visible = true;
            }
        }
    }

    // Retourne true si le joueur peut tirer
    canShoot() {
        return this.shootCooldown <= 0 &&
            (this.input.isKeyDown('Space') || this.input.isKeyDown('ArrowUp'));
    }

    // Appelé après un tir pour réinitialiser le cooldown
    onShoot() {
        this.shootCooldown = this.shootRate;
    }

    // Le joueur subit un dégât
    hit() {
        if (this.invincible) return;
        this.lives--;
        if (this.lives <= 0) {
            this.destroy();
        } else {
            this.invincible = true;
            this.invincibleTimer = this.invincibleDuration;
            this.blinkTimer = 0;
        }
    }

    // Réinitialise le joueur (nouveau jeu)
    reset() {
        this.x = this.gameWidth / 2 - this.width / 2;
        this.y = this.gameHeight - this.height - 20;
        this.lives = 3;
        this.isAlive = true;
        this.invincible = false;
        this.visible = true;
        this.shootCooldown = 0;
    }

    render(ctx) {
        if (!this.visible) return;

        ctx.save();
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        // Corps principal du vaisseau
        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(cx, this.y);                          // pointe
        ctx.lineTo(this.x + this.width, this.y + this.height); // bas-droite
        ctx.lineTo(cx, this.y + this.height - 8);        // cran bas
        ctx.lineTo(this.x, this.y + this.height);        // bas-gauche
        ctx.closePath();
        ctx.fill();

        // Cockpit
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy - 2, 5, 0, Math.PI * 2);
        ctx.fill();

        // Réacteur (flamme)
        const flameHeight = 6 + Math.random() * 6;
        ctx.fillStyle = '#ff6600';
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(cx - 6, this.y + this.height - 6);
        ctx.lineTo(cx, this.y + this.height + flameHeight);
        ctx.lineTo(cx + 6, this.y + this.height - 6);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}
