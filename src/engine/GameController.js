import RenderEngine from "./RenderEngine.js";
import VectorRace from "../state-objects/VectorRace.js"

"use strict";

export default class GameController {
    constructor() {
        // initialize references to RenderEngine (View/DOM) and VectorRace (Model)
        this.renderEngine = new RenderEngine(this);
        this.renderEngine.update(this.frameUpdate);

        this.vectorRace = new VectorRace(this);

        this.frameDebug = false;
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
    frameUpdate = (time) => {
        // likely need a time param
        if (this.frameDebug) {
            console.log("frame update: " + time);
        }
    }

    // handles clicks
    clickUpdate = (event) => {
        // most likely call game state update
        // log clicks for testing

        console.log("update (canvas clicked)");
        this.frameDebug = !this.frameDebug;
    }
}
