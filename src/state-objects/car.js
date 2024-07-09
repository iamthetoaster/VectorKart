export default class Car {
    constructor() {
        this.position = { x: 0, y: 0, z: 0 }; // 3D position
        this.rotation = { x: 0, y: 0, z: 0 }; // Rotation in degrees
        this.scale = { x: 1, y: 1, z: 1 }; // Scale
        this.velocity = { x: 0, y: 0, z: 0 }; // Velocity for potential motion physics
        this.history = []; // History of positions for tracking or undo functionality
    }

    setPosition(x, y, z) {
        this.position = { x, y, z };
        this.history.push({ ...this.position }); // Keep a history of positions
    }

    setRotation(x, y, z) {
        this.rotation = { x, y, z };
    }

    setScale(x, y, z) {
        this.scale = { x, y, z };
    }

    update(deltaTime) {
        // Example of a simple physics integration
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.position.z += this.velocity.z * deltaTime;
    }

    getLastPosition() {
        return this.history.length > 0 ? this.history[this.history.length - 1] : null;
    }
}