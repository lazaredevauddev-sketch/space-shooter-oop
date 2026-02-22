// Gestion centralisée des entrées clavier
// Pattern : composition — Game possède un InputHandler

export default class InputHandler {
    constructor() {
        this.keys = new Map();
        this.justPressed = new Map();

        this._onKeyDown = (e) => {
            if (!this.keys.get(e.code)) {
                this.justPressed.set(e.code, true);
            }
            this.keys.set(e.code, true);
            // Empêche le scroll avec les flèches et espace
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        };

        this._onKeyUp = (e) => {
            this.keys.set(e.code, false);
            this.justPressed.set(e.code, false);
        };

        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
    }

    // Vérifie si une touche est actuellement enfoncée
    isKeyDown(code) {
        return this.keys.get(code) || false;
    }

    // Vérifie si une touche vient d'être pressée (une seule fois)
    isJustPressed(code) {
        return this.justPressed.get(code) || false;
    }

    // À appeler à la fin de chaque frame pour réinitialiser justPressed
    resetJustPressed() {
        this.justPressed.clear();
    }

    // Nettoyage des listeners (bonne pratique OOP)
    destroy() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
    }
}
