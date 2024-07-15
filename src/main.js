import GameController from './engine/GameController.js';

'use strict';

const canvasIdSelect = '#c';
const game = new GameController();

// TODO: Move this into GameController and remove main.js
const canvas = document.querySelector(canvasIdSelect);
canvas.addEventListener('click', game.clickUpdate);
