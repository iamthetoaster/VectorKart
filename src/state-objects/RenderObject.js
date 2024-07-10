import { render } from "../render.js"

export default class RenderObject {
    constructor(position) {
        this.position = position;
        this.velocity = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.acceleration = { x: 0, y: 0, z: 0 };
        this.scale = { x: 1, y: 1, z: 1};
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

    setVelocity(vx, vy, vz) {
        this.velocity = { x: vx, y: vy, z: vz };
    }

    setAcceleration(x, y, z) {
        this.accerleation = { x: x, y: y, z: z };
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

    draw() {

    }
}