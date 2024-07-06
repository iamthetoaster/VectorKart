import RenderEngine from "./RenderEngine.js";

"use strict";

export default class GameController {
    constructor() {
        this.renderEngine = new RenderEngine;
        this.renderEngine.update(this.frameUpdate);
    }

    // controls game logic

    run() {
        this.start();
        this.renderEngine.run();
    }

    start() {
        console.log("GameController: start");
        // generate map
        // load cars/objects
            // store all objects in an array for rendering
    } 

    // updates every frame
    frameUpdate() { 
        // likely need a time param

    }

    // handles clicks
    clickUpdate(event) {
        // most likely call game state update
        // log clicks for testing

        console.log("update (canvas clicked)");
    }
}

// In index.js or entry point
const game = new GameController();
game.run();
