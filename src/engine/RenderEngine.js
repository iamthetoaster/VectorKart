"use strict";

// import GameController from "./GameController";

export default class RenderEngine {

    run() {
        this.draw();
        // requestAnimationFrame();
    }

    update(callback) {
        this.runUpdate = callback;
        console.log("update(callback)");
    }

    runUpdate(time) {
        console.warn("Not Implemented");
    }

    draw = (time) => {
        time *= 0.005; // convert to seconds
    
        this.runUpdate(time); // updates rendering logic/contents
    
        // recursive draw callback
        requestAnimationFrame(this.draw);
    }
}
