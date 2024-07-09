import RenderEngine from "./RenderEngine.js";

"use strict";

export default class GameController {
    constructor() {
        this.renderEngine = new RenderEngine(this);
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
    frameUpdate(time) { 
        // likely need a time param
        console.log("frame update: " + time);
    }

    // handles clicks
    clickUpdate(event) {
        // most likely call game state update
        // log clicks for testing

        console.log("update (canvas clicked)");
    }
}
