import Entity from './Entity.js';

// Projectile tiré par le joueur — hérite d'Entity
// Monte verticalement et se détruit hors écran

export default class Projectile extends Entity {
    constructor(x, y) {
        super(x - 2, y, 4, 14);
        this.velocityY = -500;
        this.color = '#00ff88';
    }

    update(dt) {
        super.update(dt);
        // Auto-destruction hors écran
        if (this.y + this.height < 0) {
            this.destroy();
        }
    }

    render(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        // Trait lumineux
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Traînée
        ctx.globalAlpha = 0.3;
        ctx.fillRect(this.x, this.y + this.height, this.width, 8);

        ctx.restore();
    }
}
