import RenderEngine from "./RenderEngine.js";
import Dashboard from "./Dashboard.js";
import VectorRace from "../state-objects/VectorRace.js";
import { parseObjText, createShader, createProgram } from "../webgl_utils.js";
import { mat4, degToRad } from "../math_utils.js";
import Car from "../state-objects/car.js";//was Car.js
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

                // Print initial position of the car
                console.log(`Initial car position: (${this.car.position.x}, ${this.car.position.y}, ${this.car.position.z})`);

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
        const rect = event.target.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
    
        // Get the actual canvas width and height
        const canvasWidth = event.target.width;
        const canvasHeight = event.target.height;
    
        // Convert to center-origin coordinates
        // Canvas coordinates go from -width/2 to width/2 and -height/2 to height/2
        const normalizedX = 0; // X is not used, assuming a 2D Y-Z plane
        const normalizedY = -(mouseY - canvasHeight / 2); // Y needs to be inverted
        const normalizedZ = mouseX - canvasWidth / 2; // Z is horizontal on screen
    
        // Update the car's position to where the user clicked
        this.car.setPosition(normalizedX, normalizedY, normalizedZ);
        this.car.updateTransform();
    
        // Log the action for debugging
        console.log(`Mouse clicked at raw position: (${mouseX}, ${mouseY})`);
        console.log(`Normalized coordinates: (${normalizedX}, ${normalizedY}, ${normalizedZ})`);
        console.log(`Car moved to (${normalizedX}, ${normalizedY}, ${normalizedZ})`);
    }    
}
