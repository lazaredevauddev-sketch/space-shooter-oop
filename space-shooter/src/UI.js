import { GameState } from './StateManager.js';

// Interface utilisateur : HUD + écrans de menu/pause/game over
// Pattern : composition — Game possède un UI
// Séparation logique/affichage : UI ne modifie aucun état du jeu

export default class UI {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    render(ctx, state, score, lives, highScore) {
        switch (state) {
            case GameState.MENU:
                this.renderMenu(ctx);
                break;
            case GameState.PLAYING:
                this.renderHUD(ctx, score, lives);
                break;
            case GameState.PAUSE:
                this.renderHUD(ctx, score, lives);
                this.renderPause(ctx);
                break;
            case GameState.GAMEOVER:
                this.renderGameOver(ctx, score, highScore);
                break;
        }
    }

    renderMenu(ctx) {
        const cx = this.width / 2;
        const cy = this.height / 2;

        // Titre
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 20;
        ctx.font = '900 42px Orbitron, monospace';
        ctx.fillText('SPACE SHOOTER', cx, cy - 80);

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#8899aa';
        ctx.font = '500 16px Rajdhani, sans-serif';
        ctx.fillText('Apprendre l\'OOP en JavaScript', cx, cy - 35);

        // Contrôles
        ctx.fillStyle = '#aabbcc';
        ctx.font = '400 15px Rajdhani, sans-serif';
        const controls = [
            '← →  ou  A D  —  Déplacer',
            'ESPACE  ou  ↑  —  Tirer',
            'ECHAP  —  Pause'
        ];
        controls.forEach((line, i) => {
            ctx.fillText(line, cx, cy + 20 + i * 28);
        });

        // Call to action (pulsation)
        const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 400);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#00ff88';
        ctx.font = '700 20px Orbitron, monospace';
        ctx.fillText('APPUYEZ SUR ENTRÉE', cx, cy + 130);
        ctx.globalAlpha = 1;

        ctx.restore();
    }

    renderHUD(ctx, score, lives) {
        ctx.save();
        ctx.textBaseline = 'top';

        // Score
        ctx.fillStyle = '#00d4ff';
        ctx.font = '600 18px Rajdhani, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`SCORE  ${score}`, 15, 12);

        // Vies (icônes ♦)
        ctx.fillStyle = '#ff4466';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'right';
        const heartsText = '♥ '.repeat(Math.max(0, lives)).trim();
        ctx.fillText(heartsText, this.width - 15, 14);

        ctx.restore();
    }

    renderPause(ctx) {
        const cx = this.width / 2;
        const cy = this.height / 2;

        // Overlay semi-transparent
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 15;
        ctx.font = '900 36px Orbitron, monospace';
        ctx.fillText('PAUSE', cx, cy - 20);

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#8899aa';
        ctx.font = '400 16px Rajdhani, sans-serif';
        ctx.fillText('Appuyez sur ECHAP pour reprendre', cx, cy + 25);
        ctx.restore();
    }

    renderGameOver(ctx, score, highScore) {
        const cx = this.width / 2;
        const cy = this.height / 2;

        // Overlay
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Titre
        ctx.fillStyle = '#ff4466';
        ctx.shadowColor = '#ff4466';
        ctx.shadowBlur = 20;
        ctx.font = '900 40px Orbitron, monospace';
        ctx.fillText('GAME OVER', cx, cy - 60);

        ctx.shadowBlur = 0;

        // Score final
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 22px Rajdhani, sans-serif';
        ctx.fillText(`Score : ${score}`, cx, cy);

        // Meilleur score
        ctx.fillStyle = '#ffcc00';
        ctx.font = '500 18px Rajdhani, sans-serif';
        ctx.fillText(`Meilleur : ${highScore}`, cx, cy + 35);

        // Rejouer
        const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 400);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#00ff88';
        ctx.font = '700 18px Orbitron, monospace';
        ctx.fillText('ENTRÉE POUR REJOUER', cx, cy + 90);
        ctx.globalAlpha = 1;

        ctx.restore();
    }
}
