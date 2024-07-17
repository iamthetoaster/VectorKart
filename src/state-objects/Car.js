import GameObject3D from './GameObject3D.js';
import Vector3 from './Vector3.js';

export default class Car extends GameObject3D {
  constructor(position, renderObject) {
    super(renderObject);

    this.startPosition = position;
    this.position = this.startPosition;

    this._velocity = Vector3.ZERO; // Do not set directly! Use step()
    this.acceleration = Vector3.ZERO;

    this.scale = new Vector3(25, 25, 25);

    this.rotation = -Math.PI / 2;

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

  reset() {
    this._velocity = new Vector3(0, 0, 0);
    this.acceleration = new Vector3(0, 0, 0);
    this.position = this.startPosition;
    // this.rotation = 0;
  }

  printState() {
    console.log(`Position: ${this.position.toString()}`);
    console.log(`Velocity: ${this.velocity.toString()}`);
    console.log(`Rotation: ${this.rotation}`);
    console.log(`Scale: ${this.scale.toString()}`);
  }
}
