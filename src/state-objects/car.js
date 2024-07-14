import GameObject3D from './GameObject3D.js';
import Vector3 from './Vector3.js';

export default class Car extends GameObject3D{
  constructor(renderObject) {
    super(renderObject);
    // this.renderObject = renderObject;
    // this.position = Vector3.ZERO;
    // this.rotation = 0; // rotation about the y axis
    // this.scale = Vector3.ZERO;
    this._velocity = Vector3.ZERO; // Do not set directly! Use step()
    this.acceleration = Vector3.ZERO;

    // Player Stats
    this.maxSpeed = 0;
  }

  // returns Vector3-like object without modifier methods
  get velocity() {
    return {
      x: this._velocity.x,
      y: this._velocity.y,
      z: this._velocity.z,
    };
  }

  getSpeed() {
    return this._velocity.getMagnitude();
  }

  // returns Vector3-like object without modifier methods
  getNextVelocity() {
    return {
      x: this._velocity.x + this.acceleration.x,
      y: this._velocity.y + this.acceleration.y,
      z: this._velocity.z + this.acceleration.z,
    };
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
    console.log(`Position: (${this.position.toArray().join(', ')})`);
    console.log(`Velocity: (${this.velocity.toArray().join(', ')}`);
    console.log(`Rotation: ${this.rotation}`);
    console.log(`Scale: (${this.scale.toArray().join(', ')})`);
  }
}
