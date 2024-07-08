import GameController from "./engine/GameController.js";

"use strict";

const canvasId = "c";
const game = new GameController();

// Retrieve the actual canvas element and then add the event listener
const canvas = document.getElementById(canvasId);
canvas.addEventListener('click', (event) => game.clickUpdate(event));

game.run();
