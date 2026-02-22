// Point d'entrée du jeu
// Ce fichier instancie Game et lance la boucle — c'est tout

import Game from './Game.js';

const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);
game.start();
