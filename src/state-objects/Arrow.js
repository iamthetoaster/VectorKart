import GameObject3D from './GameObject3D.js';
import Vector3 from './Vector3.js';

export default class Car extends GameObject3D {
  constructor(renderObject) {
    super(renderObject);
    this.scale = new Vector3(10, 10, 0);
    this.position = new Vector3(0, 0, 0);
    this._target = new Vector3(0, 0, 0);
    this._fix();
  }

  // Getters
  get from() {
    return this.position;
  }

  get to() {
    return this._target;
  }

  // Setters
  set from(position) {
    this.position = position;
    this._fix();
  }

  set to(newTarget) {
    this._target = newTarget;
    this._fix();
  }

  _fix() {
    const delta = this._target.subtract(this.position);
    const magnitude = delta.getMagnitude();
    const newScale = new Vector3(this.scale.x, this.scale.y, magnitude);
    this.scale = newScale;
    this.rotation = Math.atan2(delta.x, delta.z);
  }
}
