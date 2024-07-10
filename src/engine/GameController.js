import RenderEngine from "./RenderEngine.js";
import VectorRace from "../state-objects/VectorRace.js";
import { parseObjText, createShader, createProgram } from "../webgl_utils.js";
import { degToRad } from "../math_utils.js";
import { render } from "../render.js";
import Car from "../state-objects/car.js";

"use strict";

export default class GameController {
    constructor() {
        // Initialize the core components of the game
        this.renderEngine = new RenderEngine(this); // Handles the rendering of objects
        this.vectorRace = new VectorRace(this); // Manages the state of the game
        this.renderEngine.update(this.frameUpdate); // Link frame updates to the rendering engine
        this.rotating = false; // Flag to control rotation state
        this.pt = 0; // Previous time stamp
        this.dt = 0; // Time difference between frames
        this.car = new Car(); // The car object with position, velocity, etc.

        // Setup to prevent adding multiple listeners to the same canvas
        let canvas = document.querySelector("#c");
        if (!canvas.hasAttribute('data-listener-added')) {
            canvas.addEventListener('click', this.handleCanvasClick.bind(this));
            canvas.setAttribute('data-listener-added', 'true');
        }
    }

    run() {
        // Start the game logic and rendering process
        this.start();
        this.renderEngine.run();
    }

    start() {
        // Load the car model and initialize the game components
        fetch("/resources/models/race.obj")
            .then(response => response.text())
            .then(parseObjText)
            .then(obj => {
                render.setup(document.querySelector("#c")).then(() => {
                    if (!render.makeModel("car", obj, render.program)) {
                        console.error("Failed to create model");
                        return;
                    }
                    // Set initial car properties and draw it on the canvas
                    this.car.setPosition(0, 0, 0);
                    this.car.setRotation(0, 0, 0);
                    this.car.setScale(100, 100, 100);
                    this.car.updateTransform();
                    render.draw();
                });
            })
            .catch(error => console.error("Error loading model:", error));
    }

    frameUpdate = (time) => {
        // Update the state of the game each frame
        if (this.rotating && render.models.car) {
            let rotationAngle = degToRad(100 * time % 360);
            this.car.setRotation(0, rotationAngle, 0);
            this.updateCarTransform();
        }
        // Update time variables for smooth animations
        this.dt = time - this.pt;
        this.pt = time;
    }

    handleCanvasClick(event) {
        // Handle clicks on the canvas to move the car to random positions
        const maxZ = event.target.width;
        const maxY = event.target.height;
        const newPos = {
            x: 0, // Assuming X-axis is not used in 2D space
            y: (Math.random() * maxY) - (maxY / 2), // vertical on screen
            z: (Math.random() * maxZ) - (maxZ / 2) // horizontal on screen
        };

        // Compute the new velocity based on position change
        const velocity = {
            x: 0,
            y: newPos.y - this.car.position.y,
            z: newPos.z - this.car.position.z
        };

        // Update the car's state and redraw
        this.car.setPosition(newPos.x, newPos.y, newPos.z);
        this.car.updateTransform();

        // Log the car's new position and velocity for debugging
        console.log(`Car moved to (${newPos.x}, ${newPos.y}) with velocity (${velocity.x}, ${velocity.y})`);
    }
}