import RenderEngine from "./RenderEngine.js";
import Dashboard from "./Dashboard.js";
import VectorRace from "../state-objects/VectorRace.js";
import { parseObjText, createShader, createProgram } from "../webgl_utils.js";
import { degToRad } from "../math_utils.js";
import Car from "../state-objects/Car.js";
"use strict";

export default class GameController {
    constructor() {
        // Initialize the core components of the game
        this.renderEngine = new RenderEngine(this); // Handles the rendering of objects
        this.renderEngine.update(this.frameUpdate); // Link frame updates to the rendering engine
        this.renderEngine.init()
            .then(() => {
                this.vectorRace = new VectorRace(this); // Manages the state of the game
                this.rotating = true; // Flag to control rotation state
                this.pt = 0; // Previous time stamp
                this.dt = 0; // Time difference between frames
                this.car = new Car(this.renderEngine.instantiateRenderObject("car")); // The car object with position, velocity, etc.
                this.car.setScale(100, 100, 100);

                this.dashboard = new Dashboard(document.getElementById("dashboard"),
                                               [ this.car ]);

                // Setup to prevent adding multiple listeners to the same canvas
                let canvas = document.querySelector("#c");
                if (!canvas.hasAttribute('data-listener-added')) {
                    canvas.addEventListener('click', this.handleCanvasClick.bind(this));
                    canvas.setAttribute('data-listener-added', 'true');
                }

            });
    }

    start() {

        this.dashboard.attach();
    }

    frameUpdate = (time) => {
        // Update the state of the game each frame
        if (this.rotating) {
            let rotationAngle = degToRad(10 * time % 360);
            this.car.setRotation(0, rotationAngle, 0);
            this.car.updateTransform();
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
