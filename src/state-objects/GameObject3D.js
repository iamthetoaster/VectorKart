import Vector3 from './Vector3.js';

export default class GameObject3D {
  constructor(renderObject) {
    this.renderObject = renderObject;

    this._position = Vector3.ZERO;
    this._rotation = Vector3.ZERO;
    this._scale = new Vector3(1, 1, 1);
  }

  // getters
  get position() {
    return this._position;
  }

  get rotation() {
    return this._rotation;
  }

  get scale() {
    return this._scale;
  }

  // setters
  set position(newPos) { 
    this._position = newPos;
    this.renderObject.translation = [this.position.x, this.position.y, this.position.z];
  }

  set rotation(newAngle) {
    this._rotation = newAngle;
    this.renderObject.rotation = [0, newAngle, 0];
  }

  set scale(newScale) {
    this._scale = newScale;
    this.renderObject.scale = [this.scale.x, this.scale.y, this.scale.z];
  }
}
