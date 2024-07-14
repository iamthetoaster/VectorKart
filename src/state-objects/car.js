//import { render } from "../render.js";
import GameObject3D from "./GameObject3D.js"

export default class Car extends GameObject3D {
  constructor(renderObject) {
    super(renderObject);

    this.velocity = { x: 0, y: 0, z: 0 };
    this.acceleration = { x: 0, y: 0, z: 0 };

    // Player Stats
    this.maxSpeed = 0;
  }

  _setVelocity(x, y, z) {
    this.velocity = { x, y, z };

    const speed = this.getSpeed();
    if (speed > this.maxSpeed) {
      this.maxSpeed = speed;
    }
  }

  setAcceleration(x, y, z) {
    this.acceleration = { x, y, z };
  }
  setAcceleration(x, y, z) {
    this.acceleration = { x, y, z };
  }

  getStepVelocity() {
    return {
      x: this.velocity.x + this.acceleration.x,
      y: this.velocity.y + this.acceleration.y,
      z: this.velocity.z + this.acceleration.z,
    };
  }

  stepVelocity() {
    const newVelocity = this.getStepVelocity;
    this._setVelocity(newVelocity.x, newVelocity.y, newVelocity.z);
  }

  printState() {
    console.log(`Position: (${this.position.x}, ${this.position.y}, ${this.position.z})`);
    console.log(`Velocity: (${this.velocity.x}, ${this.velocity.y}, ${this.velocity.z})`);
    console.log(`Rotation: (${this.rotation.x}, ${this.rotation.y}, ${this.rotation.z})`);
    console.log(`Scale: (${this.scale.x}, ${this.scale.y}, ${this.scale.z})`);
  }
  printState() {
    console.log(`Position: (${this.position.x}, ${this.position.y}, ${this.position.z})`);
    console.log(`Velocity: (${this.velocity.x}, ${this.velocity.y}, ${this.velocity.z})`);
    console.log(`Rotation: (${this.rotation.x}, ${this.rotation.y}, ${this.rotation.z})`);
    console.log(`Scale: (${this.scale.x}, ${this.scale.y}, ${this.scale.z})`);
  }

  getSpeed() {
    const { x, y, z } = this.velocity;
    return Math.hypot((x), (y), (z));
  }
  getSpeed() {
    const { x, y, z } = this.velocity;
    return Math.sqrt((x * x) + (y * y) + (z * z));
  }

  getAngle() {
    return this.rotation.y;
  }
  getAngle() {
    return this.rotation.y;
  }
}
