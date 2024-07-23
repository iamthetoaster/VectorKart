/* eslint-disable jest/expect-expect */

import Vector3 from '../src/state-objects/Vector3.js';

const verifyValues = (vector3, values) => {
  expect(vector3.x).toBe(values[0]);
  expect(vector3.y).toBe(values[1]);
  expect(vector3.z).toBe(values[2]);
};

test('Create Vector3 object', () => {
  const values = [1, 2.1, -3];
  const vector3 = new Vector3(...values);
  verifyValues(vector3, values);
});

test('Create Vector3 object from Vector3-like', () => {
  const values = [-1, 278.2, 17];
  const vector3 = new Vector3({ x: values[0], y: values[1], z: values[2] });
  verifyValues(vector3, values);
});

test('Vector3 Constants', () => {
  expect(Vector3.ZERO.x).toBe(0);
  expect(Vector3.ZERO.y).toBe(0);
  expect(Vector3.ZERO.z).toBe(0);

  const inverses = new Map();
  inverses.set(Vector3.RIGHT, Vector3.LEFT);
  inverses.set(Vector3.DOWN, Vector3.UP);
  inverses.set(Vector3.BACK, Vector3.FORWARD);

  for (const [original, inverse] of inverses) {
    verifyValues(original, [-inverse.x, -inverse.y, -inverse.z]);
  }
});

test('Vector3 getMagnitude()', () => {
  const values = [4, 3, -7];
  const vector3 = new Vector3(...values);
  expect(vector3.getMagnitude()).toBeCloseTo(8.602);
});

test('Vector3 setComponents()', () => {
  const origValues = [2, 8, -12];
  const vector3 = new Vector3(...origValues);
  verifyValues(vector3, origValues);

  const newValues = [9, 4, 1];
  vector3.setComponents(...newValues);
  verifyValues(vector3, newValues);
});

test('Vector3 setComponents() partial', () => {
  const origValues = [2, 8, -12];
  const vector3 = new Vector3(...origValues);
  verifyValues(vector3, origValues);

  const newValues = [undefined, undefined, 5];
  vector3.setComponents(...newValues);
  verifyValues(vector3, [origValues[0], origValues[1], newValues[2]]);
});

test('Vector3 add()', () => {
  const vector3 = Vector3.RIGHT.add(Vector3.DOWN);
  verifyValues(vector3, [1, 0, 1]);
});

test('Vector3 add() does not modify', () => {
  const values = [-1, -1, -1];
  const vector3 = new Vector3(...values);
  vector3.add(new Vector3(1, 1, 1));
  verifyValues(vector3, values);
});

test('Vector3 scalar_mult()', () => {
  const values = [1, 7, 3];
  const factor = -2;
  const vector3 = new Vector3(...values).scalar_mult(factor);
  const expectValues = values.map((value) => factor * value);
  verifyValues(vector3, expectValues);
});

test('Vector3 scalar_mult() does not modify', () => {
  const values = [-1, -1, -1];
  const vector3 = new Vector3(...values);
  vector3.scalar_mult(-1);
  verifyValues(vector3, values);
});

test('Vector3 subtract()', () => {
  const vector3 = Vector3.RIGHT.subtract(Vector3.DOWN);
  verifyValues(vector3, [1, 0, -1]);
});

test('Vector3 subtract() does not modify', () => {
  const values = [-1, -1, -1];
  const vector3 = new Vector3(...values);
  vector3.subtract(new Vector3(1, 1, 1));
  verifyValues(vector3, values);
});

test('Vector3 normalize()', () => {
  const vector3 = new Vector3(1, 2, -1).normalize();
  expect(vector3.x).toBeCloseTo(0.408);
  expect(vector3.y).toBeCloseTo(0.816);
  expect(vector3.z).toBeCloseTo(-0.408);
});

test('Vector3 normalize() does not modify', () => {
  const values = [-1, -1, -1];
  const vector3 = new Vector3(...values);
  vector3.normalize();
  verifyValues(vector3, values);
});

test('Vector3 dot()', () => {
  const product = new Vector3(1, 2, -1).dot(new Vector3(-1, 7, 3));
  expect(product).toBe(10);
});

test('Vector3 dot() does not modify', () => {
  const values = [-1, -1, -1];
  const vector3 = new Vector3(...values);
  vector3.dot(Vector3.ZERO);
  verifyValues(vector3, values);
});

test('Vector3 toArray()', () => {
  const values = [-218, 24.2, 13];
  const vector3 = new Vector3 (...values);
  expect(vector3.toArray()).toEqual(values);
});

test('Vector3 toString()', () => {
  const vector3 = new Vector3 (81, -82, -83);
  expect(vector3.toString()).toBe('(81, -82, -83)');
});
