import GameObject3D from './GameObject3D.js';
import Vector3 from './Vector3.js';

export default class Car extends GameObject3D {
  constructor(renderObject) {
    super(renderObject);

    this._velocity = Vector3.ZERO; // Do not set directly! Use step()
    this.acceleration = Vector3.ZERO;

    this.scale = new Vector3(25, 25, 25);

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

  // update velocity
  step() {
    const next = this.getNextVelocity();
    this._velocity.setComponents(next.x, next.y, next.z);

    // Update car position
    this.position = this.position.add(this.velocity);

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
