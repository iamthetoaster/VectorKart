import RenderEngine from "./RenderEngine.js";
import VectorRace from "../state-objects/VectorRace.js"
import { resizeCanvasToDisplaySize, parseObjText, createShader, createProgram } from "../webgl_utils.js"
import { mat4, radToDeg, degToRad } from "../math_utils.js"
import { render } from "../render.js"

"use strict";

export default class GameController {
    constructor() {
        // Initialize the render engine and vector race model
        this.renderEngine = new RenderEngine(this);
        this.vectorRace = new VectorRace(this);

        // Update method for the render engine; binds 'this' for context
        this.renderEngine.update(this.frameUpdate);

        // Flag to control the rotation of the car
        this.rotating = false;  

        // Time variables for animation control
        this.pt = 0; // Previous time
        this.dt = 0; // Delta time

        // Attach click event listener to the canvas to control car rotation
        let canvas = document.querySelector("#c");
        canvas.addEventListener('click', this.clickUpdate);
    }

    // Starts the game logic and the render loop
    run() {
        this.start();
        this.renderEngine.run();
    }

    // Initializes game components and loads the 3D model
    start() {
        console.log("GameController: start");
        
        // Fetch and set up the car model from an .obj file
        fetch("/resources/models/race.obj")
            .then((response) => response.text())
            .then((text) => parseObjText(text))
            .then((obj) => {
                render.setup(document.querySelector("#c")).then(() => {
                    render.makeModel("car", obj, render.program);

                    // Set initial transformation for the car model
                    render.models.car.transform.translation = [0, 0, 0];
                    render.models.car.transform.rotation = [0, 0, 0];
                    render.models.car.transform.scale = [100, 100, 100];

                    // Draw the scene initially
                    render.draw();
                });
            });
    }

    // Called every frame to update game state
    frameUpdate = (time) => {
        // Apply rotation if the 'rotating' flag is true
        if (this.rotating && render.models.car) {
            let rotationAngle = degToRad(100 * time % 360);
            render.models.car.transform.rotation = [0, rotationAngle, 0];
        }

        // Calculate time since last frame
        this.dt = time - this.pt;
        this.pt = time;
    }

    // Handles clicks on the canvas, toggling the rotation state
    clickUpdate = (event) => {
        console.log("Canvas clicked, toggling rotation.");
        this.rotating = !this.rotating;  // Toggle the rotation on or off
    }
}

// The entry point for setting up the game controller
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameController();
    game.run();
});