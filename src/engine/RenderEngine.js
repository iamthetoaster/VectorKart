"use strict";

export default class RenderEngine {

    run() {
        this.draw()
    }

    update(callback) {
        this.runUpdate = callback;
    }

    runUpdate() {
        console.warn("Not Implemented");
    }

    draw(time) {
        time *= 0.005; // convert to seconds

        this.runUpdate();
        // recursive draw callback
        requestAnimationFrame(draw);
    }
}