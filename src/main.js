import GameController from "./engine/GameController.js";

"use strict";

const canvasId = "c";
const game = new GameController();

const canvas = document.getElementById(canvasId);
canvas.addEventListener("click", game.clickUpdate);
