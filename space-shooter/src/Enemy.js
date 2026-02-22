import Entity from './Entity.js';

// Ennemi basique — hérite d'Entity
// Descend verticalement, avec un léger mouvement sinusoïdal horizontal

export default class Enemy extends Entity {
    constructor(x, y, speed = 120) {
        super(x, y, 32, 32);
        this.baseSpeed = speed;
        this.velocityY = speed;
        this.points = 100;

        // Mouvement sinusoïdal
        this.sineOffset = Math.random() * Math.PI * 2;
        this.sineAmplitude = 30 + Math.random() * 40;
        this.sineFrequency = 1.5 + Math.random() * 1.5;
        this.baseX = x;
        this.elapsed = 0;

        // Couleur aléatoire dans des tons chauds
        this.hue = 0 + Math.random() * 60; // rouge-orange-jaune
    }

    update(dt) {
        this.elapsed += dt;
        this.x = this.baseX + Math.sin(this.elapsed * this.sineFrequency + this.sineOffset) * this.sineAmplitude;
        this.y += this.velocityY * dt;

        // Destruction si sorti par le bas
        if (this.y > 700) {
            this.destroy();
        }
    }

    render(ctx) {
        ctx.save();
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const color = `hsl(${this.hue}, 100%, 55%)`;

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;

        // Corps hexagonal de l'ennemi
        ctx.beginPath();
        const sides = 6;
        const radius = this.width / 2;
        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 / sides) * i - Math.PI / 2;
            const px = cx + radius * Math.cos(angle);
            const py = cy + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        // Œil central
        ctx.fillStyle = '#000';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx + 1, cy - 1, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
