import GameObject3D from './GameObject3D.js';
import Vector3 from './Vector3.js';

export default class Car extends GameObject3D {
  constructor(renderObject) {
    super(renderObject);

    this._velocity = Vector3.ZERO; // Do not set directly! Use step()
    this.acceleration = Vector3.ZERO;

    // Player Stats
    this.maxSpeed = 0;
  }

  get velocity() {
    return new Vector3(this._velocity);
  }

  getSpeed() {
    return this._velocity.getMagnitude();
  }

  // returns Vector3-like object without modifier methods
  getNextVelocity() {
    return this._velocity.add(this.acceleration);
  }

  step() {
    const next = this.getNextVelocity();
    this._velocity.setComponents(next.x, next.y, next.z);

    const speed = this.getSpeed();
    if (speed > this.maxSpeed) {
      this.maxSpeed = speed;
    }
  }

  printState() {
    console.log(`Position: ${this.position.toString()}`);
    console.log(`Velocity: ${this.velocity.toString()}`);
    console.log(`Rotation: ${this.rotation}`);
    console.log(`Scale: ${this.scale.toString()}`);
  }
}
