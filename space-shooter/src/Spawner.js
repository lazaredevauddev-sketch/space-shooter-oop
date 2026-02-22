import Enemy from './Enemy.js';

// Système de spawn des ennemis
// Pattern : composition — Game possède un Spawner
// Gère le timing et la difficulté progressive

export default class Spawner {
    constructor(gameWidth) {
        this.gameWidth = gameWidth;
        this.timer = 0;
        this.interval = 1.2;        // secondes entre chaque spawn
        this.minInterval = 0.3;     // intervalle minimum
        this.difficultyTimer = 0;
        this.difficultyRate = 10;   // secondes avant d'accélérer
        this.baseSpeed = 100;
        this.maxSpeed = 300;
    }

    update(dt, enemies) {
        this.timer += dt;
        this.difficultyTimer += dt;

        // Augmentation progressive de la difficulté
        if (this.difficultyTimer >= this.difficultyRate) {
            this.difficultyTimer = 0;
            this.interval = Math.max(this.minInterval, this.interval - 0.1);
            this.baseSpeed = Math.min(this.maxSpeed, this.baseSpeed + 15);
        }

        if (this.timer >= this.interval) {
            this.timer = 0;
            this.spawn(enemies);
        }
    }

    spawn(enemies) {
        const margin = 40;
        const x = margin + Math.random() * (this.gameWidth - margin * 2);
        const enemy = new Enemy(x, -40, this.baseSpeed);
        enemies.push(enemy);
    }

    // Réinitialise pour un nouveau jeu
    reset() {
        this.timer = 0;
        this.interval = 1.2;
        this.difficultyTimer = 0;
        this.baseSpeed = 100;
    }
}
