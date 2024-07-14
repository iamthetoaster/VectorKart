import Vector3 from './Vector3.js';

export default class GameObject3D {
  constructor(renderObject) {
    this.renderObject = renderObject;

    this._position = Vector3.ZERO;
    this._rotation = 0;
    this._scale = new Vector3(1, 1, 1);
  }

  // getters
  get position() {
    return new Vector3(this._position);
  }

  get rotation() {
    return this._rotation;
  }

  get scale() {
    return new Vector3(this._scale);
  }

  // setters
  set position(newPos) {
    this._position = newPos;
    this.renderObject.translation = this._position.toArray();
  }

  set rotation(newAngle) {
    this._rotation = newAngle;
    this.renderObject.rotation = [0, newAngle, 0];
  }

  set scale(newScale) {
    this._scale = newScale;
    this.renderObject.scale = this._scale.toArray();
  }
}
