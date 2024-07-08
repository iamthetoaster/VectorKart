import GameController from "../engine/GameController.js"

"use strict"

export default class VectorRace {
    // holds game state
    // state machine

    constructor() {
        this.game = new GameController();
    }

    init() {
    }

    run() {
        // run game
        this.game.run();
    }
}
