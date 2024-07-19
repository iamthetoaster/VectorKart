import GameObject3D from './GameObject3D.js';
import Vector3 from './Vector3.js';

export default class Car extends GameObject3D {
  constructor(position, renderObject) {
    super(renderObject);

    this.startPosition = position;
    this.position = this.startPosition;
    this.nextPos = this.position;
    this.atPos = true;

    this._velocity = Vector3.ZERO; // Do not set directly! Use step()
    this.acceleration = Vector3.ZERO;

    this.scale = new Vector3(25, 25, 25);

    this.rotation = -Math.PI / 2;

    // Player Stats
    this.lap = 0;
    this.turnsTaken = 0;
    this.maxSpeed = 0;
  }

  get velocity() {
    return new Vector3(this._velocity);
  }

  getRotationDeg() {
    return (this.rotation / Math.PI) * 180;
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
    this.nextPos = this.position.add(this.velocity);
    this.atPos = false;

    // update rotation based on velocity
    this.rotation = Math.atan2(this._velocity.x, this._velocity.z);

    // Update player stats
    this.turnsTaken++;
    const speed = this.getSpeed();
    if (speed > this.maxSpeed) {
      this.maxSpeed = speed;
    }
  }

  animate(dt) {
    if (this.atPos) {
      return;
    }

    if (this.position.subtract(this.nextPos).getMagnitude() >= 0.1) {
      this.position = this.position.add(this.nextPos.subtract(this.position)
        .normalize().scalar_mult(this.velocity.getMagnitude())
        .scalar_mult(dt));
    } else {
      this.atPos = true;
      this.position = this.nextPos;
    }
  }

  // resets car state
  reset() {
    this._velocity = new Vector3(0, 0, 0);
    this.acceleration = new Vector3(0, 0, 0);
    this.position = this.startPosition;
    this.rotation = -Math.PI / 2;
    this.atNextPos = true;
  }

  printState() {
    console.log(`Position: ${this.position.toString()}`);
    console.log(`Velocity: ${this.velocity.toString()}`);
    console.log(`Rotation: ${this.rotation}`);
    console.log(`Scale: ${this.scale.toString()}`);
  }
}
