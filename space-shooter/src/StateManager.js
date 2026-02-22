// Machine à états du jeu
// Pattern : State Pattern simplifié
// États : MENU → PLAYING ↔ PAUSE → GAMEOVER → MENU

export const GameState = Object.freeze({
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSE: 'PAUSE',
    GAMEOVER: 'GAMEOVER'
});

export default class StateManager {
    constructor() {
        this.current = GameState.MENU;
        this.previous = null;
    }

    // Change l'état avec traçabilité
    setState(newState) {
        if (this.current === newState) return;
        this.previous = this.current;
        this.current = newState;
    }

    is(state) {
        return this.current === state;
    }

    // Réinitialise au menu
    reset() {
        this.current = GameState.MENU;
        this.previous = null;
    }
}
