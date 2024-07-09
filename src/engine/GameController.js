import RenderEngine from "./RenderEngine.js";
import VectorRace from "../state-objects/VectorRace.js"
import { resizeCanvasToDisplaySize, parseObjText, createShader, createProgram } from "../webgl_utils.js"
import { mat4, radToDeg, degToRad } from "../math_utils.js"
import  { render } from "../render.js"

"use strict";

export default class GameController {
    constructor() {
        // initialize references to RenderEngine (View/DOM) and VectorRace (Model)
        this.renderEngine = new RenderEngine(this);
        this.renderEngine.update(this.frameUpdate);

        this.vectorRace = new VectorRace(this);

        this.frameDebug = false;
        this.pt = 0;
        this.dt = 0;
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

        let canvas = document.querySelector("#c");
        render.setup(canvas).then(() => {
            fetch("/resources/models/race.obj")
                .then((response) => response.text())
                .then((text) => parseObjText(text))
                .then((obj) => {
                    render.makeModel("car", obj, render.program);

                    // transform data for model
                    render.models.car.transform.translation = [0, 0, 0];//update the velocity and position here
                    render.models.car.transform.rotation = [0, degToRad(25), 0];// was 0, degToRad(25), 0
                    render.models.car.transform.scale = [100, 100, 100];
                })
                .then(() => {
                    render.draw();
                }) ; 
        });
    }

    // updates every frame
    frameUpdate = (time) => {
        // likely need a time param
        if (this.frameDebug) {
            console.log("frame update: " + time);
        }

        if (render.models.car) {
            render.models.car.transform.rotation = [0, degToRad(100 * time % 360), 0];// was 0, degToRad(25), 0
        }

        this.dt = time - this.pt;
        this.pt = time;
    }

    // handles clicks
    clickUpdate = (event) => {
        // most likely call game state update
        // log clicks for testing

        console.log("update (canvas clicked)");
        this.frameDebug = !this.frameDebug;
    }
}
