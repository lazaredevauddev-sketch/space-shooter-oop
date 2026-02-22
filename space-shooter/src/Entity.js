// Classe de base pour toutes les entités du jeu
// Utilise l'héritage : Player, Enemy et Projectile en héritent

export default class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isAlive = true;
    }

    // Met à jour la position en fonction de la vélocité et du deltaTime
    update(dt) {
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;
    }

    // Rendu par défaut (rectangle) — les sous-classes le surchargent
    render(ctx) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Retourne la bounding box pour la détection de collisions AABB
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    // Marque l'entité comme morte (sera nettoyée par Game)
    destroy() {
        this.isAlive = false;
    }
}
