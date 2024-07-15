export default class Vector3 {
  static isVector3Like = (object) => (
    Object.hasOwn(object, 'x') &&
    Object.hasOwn(object, 'y') &&
    Object.hasOwn(object, 'z')
  );

  constructor(a, y, z) {
    if (Vector3.isVector3Like(a)) {
      this.x = a.x;
      this.y = a.y;
      this.z = a.z;
    } else {
      this.x = a;
      this.y = y;
      this.z = z;
    }
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
    return new Vector3(
      this.x + vector3.x,
      this.y + vector3.y,
      this.z + vector3.z,
    );
  }

  scalar_mult(scalar) {
    return new Vector3(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar,
    );
  }

  subtract(vector3) {
    //this.add(vector3.scalar_mult(-1));
    return new Vector3(
      this.x - vector3.x,
      this.y - vector3.y,
      this.z - vector3.z
    );
  }

  normalize() {
    //this.scalar_mult(1 / this.getMagnitude());
    const mag = this.getMagnitude();
    if (mag === 0) {
        return new Vector3(0, 0, 0);
    }
    return new Vector3(this.x / mag, this.y / mag, this.z / mag);
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  toString() {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}
