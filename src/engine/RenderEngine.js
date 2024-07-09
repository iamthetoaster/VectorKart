"use strict";

import GameController from "./GameController.js";

export default class RenderEngine {

    run() {
        this.draw();
    }

    // sets runUpdate callback (for frame updating)
    update(callback) {
        this.runUpdate = callback;
        console.log("update(callback)");
    }

    // callback for updating frame, animations and such
    runUpdate(time) {
        console.warn("Not Implemented"); // callback, currently set to GameController.frameUpdate()
    }

    draw = (time) => {
        time *= 0.005; // convert to seconds
    
        this.runUpdate(time); // updates rendering logic/contents
    
        // recursive draw callback
        // requestAnimationFrame(this.draw);
    }
}
