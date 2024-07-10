import { render } from "../render.js";

export default class Car {
    constructor() {
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.scale = { x: 1, y: 1, z: 1 };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.acceleration = { x: 0, y: 0, z: 0 };
        this.statistics = {
            turnCount: 0,
            maxSpeed: 0,
        }
    }

    setPosition(x, y, z) {
        this.position = { x, y, z };
    }

    setRotation(x, y, z) {
        this.rotation = { x, y, z };
    }

    setScale(x, y, z) {
        this.scale = { x, y, z };
    }

    _setVelocity(x, y, z) {
        this.velocity = { x, y, z };

        const speed = Math.sqrt((x * x) + (y * y) + (z * z));
        if (speed > this.statistics.maxSpeed) {
            this.statistics.maxSpeed = speed;
        }
    }

    setAcceleration(x, y, z) {
        this.acceleration = { x, y, z };
    }

    getStepVelocity() {
        return { x: this.velocity.x + this.acceleration.x,
            y: this.velocity.y + this.acceleration.y,
            z: this.velocity.z + this.acceleration.z,
        };
    }

    stepVelocity() {
        const newVelocity = this.getStepVelocity;
        this._setVelocity(newVelocity.x, newVelocity.y, newVelocity.z);
    }

    updateTransform() {
        // Update the WebGL transformation matrices based on the car's state
        if (render.models.car) {
            render.models.car.transform.translation = [this.position.x, this.position.y, this.position.z];
            render.models.car.transform.rotation = [this.rotation.x, this.rotation.y, this.rotation.z];
            render.models.car.transform.scale = [this.scale.x, this.scale.y, this.scale.z];
            render.draw(); // Redraw the scene with updated transformations
        }
    }

    printState() {
        console.log(`Position: (${this.position.x}, ${this.position.y}, ${this.position.z})`);
        console.log(`Velocity: (${this.velocity.x}, ${this.velocity.y}, ${this.velocity.z})`);
        console.log(`Rotation: (${this.rotation.x}, ${this.rotation.y}, ${this.rotation.z})`);
        console.log(`Scale: (${this.scale.x}, ${this.scale.y}, ${this.scale.z})`);
    }
}