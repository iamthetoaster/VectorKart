export default class Vector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static get ZERO() {
    return new Vector3(0, 0, 0);
  }

  static get RIGHT() {
    return new Vector3(1, 0, 0);
  }

  static get LEFT() {
    return new Vector3.RIGHT.scalar_mult(-1);
  }

  static get DOWN() {
    return new Vector3(0, 0, 1);
  }

  static get UP() {
    return new Vector3.DOWN.scalar_mult(-1);
  }

  static get BACK() {
    return new Vector3(0, 1, 0);
  }

  static get FORWARD() {
    return new Vector3.BACK.scalar_mult(-1);
  }

  getMagnitude() {
    return Math.hypot(this.x, this.y, this.z);
  }

  setComponents(x, y, z) {
    if (x) this.x = x;
    if (y) this.y = y;
    if (z) this.z = z;
  }

  add(vector3) {
    this.x += vector3.x;
    this.y += vector3.y;
    this.z += vector3.z;
  }

  scalar_mult(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
  }

  subtract(vector3) {
    this.add(vector3.scalar_mult(-1));
  }

  normalize() {
    this.scalar_mult(1 / this.getMagnitude());
  }

  toArray() {
    return [this.x, this.y, this.z];
  }
}
