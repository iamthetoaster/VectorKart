import RenderEngine from "./RenderEngine.js";
import { Car } from './car.js';

"use strict";

export default class GameController {
    constructor() {
        this.car = new Car("car"); // the car's HTML element ID is 'car'
        this.renderEngine = new RenderEngine();
        this.renderEngine.update(this.frameUpdate.bind(this)); // Binding this to ensure context

        // Add event listener for click events on the canvas
        document.getElementById('c').addEventListener('click', (event) => this.clickUpdate(event));
    }

    run() {
        this.start();
        this.renderEngine.run();
    }

    start() {
        console.log("GameController: start");
        // Initialization logic if any, for example, loading objects
    }

    frameUpdate() {
        // Update logic for each frame, which can include the smooth movement
        // If smooth movement is ongoing, this could manage the transition
    }

    clickUpdate(event) {
        console.log("Click event triggered"); // Debugging to see if clicks are being detected
        const canvasRect = document.getElementById('c').getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;

        console.log("Mouse X:", mouseX, "Mouse Y:", mouseY); // Check calculated positions

        // Call the smooth movement method to start moving the car
        this.smoothMoveTo(mouseX, mouseY);
    }

    smoothMoveTo(targetX, targetY) {
        const dx = targetX - this.car.position.x;
        const dy = targetY - this.car.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) { // You can adjust the threshold for when the animation should stop
            this.car.setPosition(
                this.car.position.x + dx * 0.1, // Move 10% of the distance per frame
                this.car.position.y + dy * 0.1
            );
            requestAnimationFrame(() => this.smoothMoveTo(targetX, targetY));
        } else {
            this.car.setPosition(targetX, targetY); // Set final position
            console.log("Final position set:", targetX, targetY); // Confirm final position
        }
    }
}

// In index.js or entry point
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameController();
    game.run();
});