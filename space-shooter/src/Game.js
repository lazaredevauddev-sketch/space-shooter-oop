import InputHandler from './InputHandler.js';
import Player from './Player.js';
import Projectile from './Projectile.js';
import Spawner from './Spawner.js';
import CollisionManager from './CollisionManager.js';
import StateManager, { GameState } from './StateManager.js';
import UI from './UI.js';

// Classe principale — orchestre tout le jeu
// Pattern : composition — possède tous les systèmes et listes d'entités
// Responsabilité : boucle de jeu, coordination update/render, gestion du cycle de vie

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 480;
        this.height = 640;
        canvas.width = this.width;
        canvas.height = this.height;

        // Systèmes (composition)
        this.input = new InputHandler();
        this.state = new StateManager();
        this.collision = new CollisionManager();
        this.ui = new UI(this.width, this.height);
        this.spawner = new Spawner(this.width);

        // Entités
        this.player = new Player(this.width, this.height, this.input);
        this.projectiles = [];
        this.enemies = [];

        // Score
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('spaceShooterHighScore')) || 0;

        // Étoiles de fond (défilement parallaxe)
        this.stars = this.createStars(120);

        // Timing
        this.lastTime = 0;
        this.running = true;
    }

    // Génère les étoiles de fond pour l'effet de défilement spatial
    createStars(count) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: 0.5 + Math.random() * 2,
                speed: 20 + Math.random() * 80,
                brightness: 0.3 + Math.random() * 0.7
            });
        }
        return stars;
    }

    // Point d'entrée de la boucle de jeu
    start() {
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    loop(timestamp) {
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05); // cap à 50ms
        this.lastTime = timestamp;

        this.update(dt);
        this.render();
        this.input.resetJustPressed();

        if (this.running) {
            requestAnimationFrame((t) => this.loop(t));
        }
    }

    update(dt) {
        // Étoiles toujours animées
        this.updateStars(dt);

        switch (this.state.current) {
            case GameState.MENU:
                if (this.input.isJustPressed('Enter')) {
                    this.startNewGame();
                }
                break;

            case GameState.PLAYING:
                this.updatePlaying(dt);
                if (this.input.isJustPressed('Escape')) {
                    this.state.setState(GameState.PAUSE);
                }
                break;

            case GameState.PAUSE:
                if (this.input.isJustPressed('Escape')) {
                    this.state.setState(GameState.PLAYING);
                }
                break;

            case GameState.GAMEOVER:
                if (this.input.isJustPressed('Enter')) {
                    this.state.setState(GameState.MENU);
                }
                break;
        }
    }

    updatePlaying(dt) {
        // Joueur
        this.player.update(dt);

        // Tir
        if (this.player.canShoot()) {
            const px = this.player.x + this.player.width / 2;
            const py = this.player.y;
            this.projectiles.push(new Projectile(px, py));
            this.player.onShoot();
        }

        // Ennemis
        this.spawner.update(dt, this.enemies);

        // Mise à jour des entités
        this.projectiles.forEach(p => p.update(dt));
        this.enemies.forEach(e => e.update(dt));

        // Collisions
        this.score += this.collision.checkProjectilesVsEnemies(this.projectiles, this.enemies);
        this.collision.checkEnemiesVsPlayer(this.enemies, this.player);

        // Nettoyage des entités mortes
        this.projectiles = this.projectiles.filter(p => p.isAlive);
        this.enemies = this.enemies.filter(e => e.isAlive);

        // Game over ?
        if (!this.player.isAlive) {
            this.onGameOver();
        }
    }

    startNewGame() {
        this.score = 0;
        this.projectiles = [];
        this.enemies = [];
        this.player.reset();
        this.spawner.reset();
        this.state.setState(GameState.PLAYING);
    }

    onGameOver() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('spaceShooterHighScore', this.highScore);
        }
        this.state.setState(GameState.GAMEOVER);
    }

    render() {
        const ctx = this.ctx;

        // Fond
        ctx.fillStyle = '#05051a';
        ctx.fillRect(0, 0, this.width, this.height);

        // Étoiles
        this.renderStars(ctx);

        // Entités (seulement en jeu, pause ou game over)
        if (!this.state.is(GameState.MENU)) {
            this.projectiles.forEach(p => p.render(ctx));
            this.enemies.forEach(e => e.render(ctx));
            this.player.render(ctx);
        }

        // UI par-dessus
        this.ui.render(ctx, this.state.current, this.score, this.player.lives, this.highScore);
    }

    updateStars(dt) {
        for (const star of this.stars) {
            star.y += star.speed * dt;
            if (star.y > this.height) {
                star.y = -2;
                star.x = Math.random() * this.width;
            }
        }
    }

    renderStars(ctx) {
        ctx.save();
        for (const star of this.stars) {
            ctx.globalAlpha = star.brightness;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(star.x, star.y, star.size, star.size);
        }
        ctx.restore();
    }
}
