"use strict"

import { GameController } from './GameController.js'

export class VectorRace {
    // holds game state
    // state machine

    // GameController instance
    constructor() {
        this.gameController = new GameController();
    }

    init() {
        // init game state then call game start

        // define input callbacks, should call GameController functions,
        // should usually be update function

        // click input callback for testing
        let canvas = document.querySelector("canvas");
        canvas.addEventListener("click", this.gameController.update, false);

        this.gameController.start();
    }
}
