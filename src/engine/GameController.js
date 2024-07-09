import RenderEngine from "./RenderEngine.js";
import VectorRace from "../state-objects/VectorRace.js";
import { parseObjText, createShader, createProgram } from "../webgl_utils.js";
import { degToRad } from "../math_utils.js";
import { render } from "../render.js";
import Car  from "../state-objects/car.js";

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

        // Initialize car state management
        this.car = new Car();

        // Attach click event listener to the canvas to control car rotation
        let canvas = document.querySelector("#c");
        canvas.addEventListener('click', this.clickUpdate);

        console.log("GameController initialized");
    }

    run() {
        console.log("Running game controller");
        this.start();
        this.renderEngine.run();
    }

    start() {
        console.log("GameController: start");

        // Fetch and set up the car model from an .obj file
        fetch("/resources/models/race.obj")
            .then(response => response.text())
            .then(parseObjText)
            .then(obj => {
                if (!obj) {
                    console.error("Failed to load or parse the model");
                    return;
                }
                render.setup(document.querySelector("#c")).then(() => {
                    if (!render.makeModel("car", obj, render.program)) {
                        console.error("Failed to create model");
                        return;
                    }

                    // Set initial transformation for the car model
                    this.car.setPosition(0, 0, 0);  // Use the Car class to manage position
                    this.car.setRotation(0, 0, 0);
                    this.car.setScale(100, 100, 100);
                    this.updateCarTransform();

                    console.log("Initial draw");
                    render.draw();
                });
            })
            .catch(error => console.error("Error loading model:", error));
    }

    frameUpdate = (time) => {
        if (this.rotating && render.models.car) {
            let rotationAngle = degToRad(100 * time % 360);
            this.car.setRotation(0, rotationAngle, 0);
            this.updateCarTransform();
        }

        this.dt = time - this.pt;
        this.pt = time;
    }

    clickUpdate = (event) => {
        console.log("Canvas clicked, toggling rotation.");
        this.rotating = !this.rotating;
        if (!this.rotating) {
            console.log("Car stopped rotating. Current State:", JSON.stringify(this.car));
        }
    }

    updateCarTransform() {
        // Sync the WebGL model transformation with the Car class state
        render.models.car.transform.translation = [this.car.position.x, this.car.position.y, this.car.position.z];
        render.models.car.transform.rotation = [this.car.rotation.x, this.car.rotation.y, this.car.rotation.z];
        render.models.car.transform.scale = [this.car.scale.x, this.car.scale.y, this.car.scale.z];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new GameController();
    game.run();
});
