// Détection de collisions AABB (Axis-Aligned Bounding Box)
// Pattern : composition — Game possède un CollisionManager
// Responsabilité unique : détecter et résoudre les collisions

export default class CollisionManager {

    // Test AABB entre deux entités
    static isColliding(a, b) {
        const ab = a.getBounds();
        const bb = b.getBounds();
        return (
            ab.x < bb.x + bb.width &&
            ab.x + ab.width > bb.x &&
            ab.y < bb.y + bb.height &&
            ab.y + ab.height > bb.y
        );
    }

    // Vérifie projectiles vs ennemis → détruit les deux, retourne le score gagné
    checkProjectilesVsEnemies(projectiles, enemies) {
        let scoreGained = 0;

        for (const projectile of projectiles) {
            if (!projectile.isAlive) continue;
            for (const enemy of enemies) {
                if (!enemy.isAlive) continue;
                if (CollisionManager.isColliding(projectile, enemy)) {
                    projectile.destroy();
                    enemy.destroy();
                    scoreGained += enemy.points;
                    break; // un projectile ne touche qu'un seul ennemi
                }
            }
        }

        return scoreGained;
    }

    // Vérifie ennemis vs joueur → appelle player.hit()
    checkEnemiesVsPlayer(enemies, player) {
        if (!player.isAlive || player.invincible) return;

        for (const enemy of enemies) {
            if (!enemy.isAlive) continue;
            if (CollisionManager.isColliding(enemy, player)) {
                enemy.destroy();
                player.hit();
                break;
            }
        }
    }
}
