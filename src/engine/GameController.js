"use strict"

export class GameController {
    // controls game logic

    start() {
        console.log("GameController: start");
        // generate map
        // load cars/objects
            // store all objects in an array for rendering

        // click input callback for testing
        let canvas = document.querySelector("canvas");
        canvas.addEventListener("click", this.update, false);
    }

    // likely need a time param
    update() {
        // most likely call game state update
        // log clicks for testing

        console.log("update (canvas clicked)");
    }

    draw(time) {
        time *= 0.005; // convert to seconds

        // recursive draw callback
        requestAnimationFrame(draw);
    }


}