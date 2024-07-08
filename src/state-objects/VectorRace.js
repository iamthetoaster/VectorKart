import GameController from "../engine/GameController.js"

"use strict"

export default class VectorRace {
    // holds game state
    // state machine

    constructor() {
        this.game = new GameController();
    }

    init() {
        // initialize game state, state machine
    }

    run() {
        // run game
        this.game.run();
    }
}
