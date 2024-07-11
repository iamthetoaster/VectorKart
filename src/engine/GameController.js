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
            this.car.updateTransform();
        }
        this.dt = time - this.pt;
        this.pt = time;
    }

    handleCanvasClick(event) {
        const rect = event.target.getBoundingClientRect();
        const mouseX = event.clientX - rect.left; // Get mouse X coordinate within the canvas
        const mouseY = event.clientY - rect.top;  // Get mouse Y coordinate within the canvas
    
        const canvasCenterX = event.target.width / 2;
        const canvasCenterY = event.target.height / 2;
    
        // Normalize the mouse coordinates to center the origin (0, 0) in the middle of the canvas
        // Also inverts the Y to align with a more standard Cartesian plane where up is positive
        const newPos = {
            x: 0, // Assuming X-axis is not used in 2D space
            y: -(mouseY - canvasCenterY), // Invert Y-axis
            z: mouseX - canvasCenterX // Z uses the width for horizontal movement
        };
    
        // Compute the velocity as the difference divided by deltaTime
        const now = performance.now();
        const deltaTime = (now - this.pt) / 1000;
        this.pt = now;
    
        if (deltaTime > 0) {
            const velocity = {
                x: 0, // X velocity is not used
                y: (newPos.y - this.car.position.y) / deltaTime,
                z: (newPos.z - this.car.position.z) / deltaTime
            };
    
            this.car._setVelocity(velocity.x, velocity.y, velocity.z);
        }
    
        this.car.setPosition(newPos.x, newPos.y, newPos.z);
        this.updateCarTransform();
    
        console.log(`Mouse clicked at position: (${mouseX}, ${mouseY})`);
        console.log(`Car moved to (${newPos.x}, ${newPos.y}, ${newPos.z}) with velocity (${this.car.velocity.x}, ${this.car.velocity.y}, ${this.car.velocity.z})`);
    }
}