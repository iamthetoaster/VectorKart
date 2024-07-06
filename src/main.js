import GameController from "./engine/GameController.js";

"use strict";

const canvasId = "c";
const game = new GameController();

document.getElementById(canvasId);
canvasId.addEventListener(game.clickUpdate);

game.run();