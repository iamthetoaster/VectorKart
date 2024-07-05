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

        this.gameController.start();
    }
}