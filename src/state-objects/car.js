class Car {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.position = { x: 0, y: 0 };
        this.rotation = 0; // Default rotation
        this.scale = { x: 1, y: 1, z: 1 }; // Default scale
        this.velocity = { x: 0, y: 0 }; // Velocity in pixels per frame
        this.history = []; // History of positions
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.history.push({x: x, y: y}); // Store position in history
        this.render();
    }

    setRotation(degrees) {
        this.rotation = degrees;
        this.render();
    }

    setScale(x, y, z) {
        this.scale.x = x;
        this.scale.y = y;
        this.scale.z = z;
        this.render();
    }

    updateVelocity(vx, vy) {
        this.velocity.x = vx;
        this.velocity.y = vy;
    }

    updatePositionWithVelocity() {
        this.setPosition(this.position.x + this.velocity.x, this.position.y + this.velocity.y);
    }

    render() {
        // Apply transformation styles based on position, rotation, and scale
        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px) rotate(${this.rotation}deg) scale(${this.scale.x}, ${this.scale.y})`;
    }

    // Method to get the last state from history
    getLastPosition() {
        return this.history.length > 0 ? this.history[this.history.length - 1] : null;
    }
}