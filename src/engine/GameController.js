import RenderEngine from "./RenderEngine.js";
import VectorRace from "../state-objects/VectorRace.js";
import { parseObjText, createShader, createProgram } from "../webgl_utils.js";
import { degToRad } from "../math_utils.js";
import { render } from "../render.js";
import Car from "../state-objects/car.js";

"use strict";

export default class GameController {
    constructor() {
        this.renderEngine = new RenderEngine(this);
        this.vectorRace = new VectorRace(this);
        this.renderEngine.update(this.frameUpdate);
        this.rotating = false;
        this.pt = 0;
        this.dt = 0;
        this.car = new Car();

        let canvas = document.querySelector("#c");
        if (!canvas.hasAttribute('data-listener-added')) {
            canvas.addEventListener('click', this.handleCanvasClick.bind(this));
            canvas.setAttribute('data-listener-added', 'true');
        }
    }

    run() {
        this.start();
        this.renderEngine.run();
    }

    start() {
        fetch("/resources/models/race.obj")
            .then(response => response.text())
            .then(parseObjText)
            .then(obj => {
                render.setup(document.querySelector("#c")).then(() => {
                    render.makeModel("car", obj, render.program);
                    this.car.setPosition(0, 0, 0);
                    this.car.setRotation(0, 0, 0);
                    this.car.setScale(100, 100, 100);
                    this.updateCarTransform();
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

    handleCanvasClick(event) {
        const maxX = event.target.width;
        const maxY = event.target.height;
        const newPos = {
            x: Math.random() * maxX,
            y: Math.random() * maxY,
            z: 0  // Assuming Z-axis is not used in 2D space
        };

        const velocity = {
            x: newPos.x - this.car.position.x,
            y: newPos.y - this.car.position.y,
            z: 0
        };

        this.car.setVelocity(velocity.x, velocity.y, velocity.z);
        this.car.setPosition(newPos.x, newPos.y, newPos.z);
        this.updateCarTransform();

        console.log(`Car moved to (${newPos.x}, ${newPos.y}) with velocity (${velocity.x}, ${velocity.y})`);
    }

    updateCarTransform() {
        if (render.models.car) {
            render.models.car.transform.translation = [this.car.position.x, this.car.position.y, this.car.position.z];
            render.models.car.transform.rotation = [this.car.rotation.x, this.car.rotation.y, this.car.rotation.z];
            render.models.car.transform.scale = [this.car.scale.x, this.car.scale.y, this.car.scale.z];
            render.draw();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new GameController();
    game.run();
});