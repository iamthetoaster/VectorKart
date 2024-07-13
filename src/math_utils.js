const vec3 = {
  normalize: function(v) {
    let length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    // make sure we don't divide by 0.
    if (length > 0.00001) {
      return [v[0] / length, v[1] / length, v[2] / length];
    } else {
      return [0, 0, 0];
    }
  },

  cross: function(a, b) {
    return [a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]];
  },

  add: function(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  },

  subtract: function(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  },

};

const mat4 = {
  identity: function () {
    return [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1,
    ];
  },

  translation: function (tx, ty, tz) {
    return [
        1,  0,  0, 0,
        0,  1,  0, 0,
        0,  0,  1, 0,
        tx, ty, tz, 1,
    ];
  },

  translate: function (mat, tx, ty, tz) {
    return mat4.multiply(mat, mat4.translation(tx, ty, tz));
  },

  xRotation: function (angleRadians) {
    let c = Math.cos(angleRadians);
    let s = Math.sin(angleRadians);
    return [
      1,  0, 0, 0,
      0,  c, s, 0,
      0, -s, c, 0,
      0,  0, 0, 1,
    ];
  },

  xRotate: function (mat, angleRadians) {
    return mat4.multiply(mat, mat4.xRotation(angleRadians));
  },

  yRotation: function (angleRadians) {
    let c = Math.cos(angleRadians);
    let s = Math.sin(angleRadians);
    return [
      c, 0, -s, 0,
      0, 1,  0, 0,
      s, 0,  c, 0,
      0, 0,  0, 1,
    ];
  },

  yRotate: function (mat, angleRadians) {
    return mat4.multiply(mat, mat4.yRotation(angleRadians));
  },


  zRotation: function (angleRadians) {
    let c = Math.cos(angleRadians);
    let s = Math.sin(angleRadians);
    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },

  zRotate: function (mat, angleRadians) {
    return mat4.multiply(mat, mat4.zRotation(angleRadians));
  },

  scaling: function (sx, sy, sz) {
    return [
      sx,  0,  0, 0,
       0, sy,  0, 0,
       0,  0, sz, 0,
       0,  0,  0, 1,

    ];
  },

  scale: function (mat, sx, sy, sz) {
    return mat4.multiply(mat, mat4.scaling(sx, sy, sz));
  },

  inverse: function(m) {
    let m00 = m[0 * 4 + 0];
    let m01 = m[0 * 4 + 1];
    let m02 = m[0 * 4 + 2];
    let m03 = m[0 * 4 + 3];
    let m10 = m[1 * 4 + 0];
    let m11 = m[1 * 4 + 1];
    let m12 = m[1 * 4 + 2];
    let m13 = m[1 * 4 + 3];
    let m20 = m[2 * 4 + 0];
    let m21 = m[2 * 4 + 1];
    let m22 = m[2 * 4 + 2];
    let m23 = m[2 * 4 + 3];
    let m30 = m[3 * 4 + 0];
    let m31 = m[3 * 4 + 1];
    let m32 = m[3 * 4 + 2];
    let m33 = m[3 * 4 + 3];
    let m22_m33  = m22 * m33;
    let m32_m23  = m32 * m23;
    let m12_m33  = m12 * m33;
    let m32_m13  = m32 * m13;
    let m12_m23  = m12 * m23;
    let m22_m13  = m22 * m13;
    let m02_m33  = m02 * m33;
    let m32_m03  = m32 * m03;
    let m02_m23  = m02 * m23;
    let m22_m03  = m22 * m03;
    let m02_m13 = m02 * m13;
    let m12_m03 = m12 * m03;
    let m20_m31 = m20 * m31;
    let m30_m21 = m30 * m21;
    let m10_m31 = m10 * m31;
    let m30_m11 = m30 * m11;
    let m10_m21 = m10 * m21;
    let m20_m11 = m20 * m11;
    let m00_m31 = m00 * m31;
    let m30_m01 = m30 * m01;
    let m00_m21 = m00 * m21;
    let m20_m01 = m20 * m01;
    let m00_m11 = m00 * m11;
    let m10_m01 = m10 * m01;

    let t0 = (m22_m33 * m11 + m32_m13 * m21 + m12_m23 * m31) -
        (m32_m23 * m11 + m12_m33 * m21 + m22_m13 * m31);
    let t1 = (m32_m23 * m01 + m02_m33 * m21 + m22_m03 * m31) -
        (m22_m33 * m01 + m32_m03 * m21 + m02_m23 * m31);
    let t2 = (m12_m33 * m01 + m32_m03 * m11 + m02_m13 * m31) -
        (m32_m13 * m01 + m02_m33 * m11 + m12_m03 * m31);
    let t3 = (m22_m13 * m01 + m02_m23 * m11 + m12_m03 * m21) -
        (m12_m23 * m01 + m22_m03 * m11 + m02_m13 * m21);

    let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    return [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((m32_m23 * m10 + m12_m33 * m20 + m22_m13 * m30) -
           (m22_m33 * m10 + m32_m13 * m20 + m12_m23 * m30)),
      d * ((m22_m33 * m00 + m32_m03 * m20 + m02_m23 * m30) -
           (m32_m23 * m00 + m02_m33 * m20 + m22_m03 * m30)),
      d * ((m32_m13 * m00 + m02_m33 * m10 + m12_m03 * m30) -
           (m12_m33 * m00 + m32_m03 * m10 + m02_m13 * m30)),
      d * ((m12_m23 * m00 + m22_m03 * m10 + m02_m13 * m20) -
           (m22_m13 * m00 + m02_m23 * m10 + m12_m03 * m20)),
      d * ((m20_m31 * m13 + m30_m11 * m23 + m10_m21 * m33) -
           (m30_m21 * m13 + m10_m31 * m23 + m20_m11 * m33)),
      d * ((m30_m21 * m03 + m00_m31 * m23 + m20_m01 * m33) -
           (m20_m31 * m03 + m30_m01 * m23 + m00_m21 * m33)),
      d * ((m10_m31 * m03 + m30_m01 * m13 + m00_m11 * m33) -
           (m30_m11 * m03 + m00_m31 * m13 + m10_m01 * m33)),
      d * ((m20_m11 * m03 + m00_m21 * m13 + m10_m01 * m23) -
           (m10_m21 * m03 + m20_m01 * m13 + m00_m11 * m23)),
      d * ((m10_m31 * m22 + m20_m11 * m32 + m30_m21 * m12) -
           (m10_m21 * m32 + m20_m31 * m12 + m30_m11 * m22)),
      d * ((m00_m21 * m32 + m20_m31 * m02 + m30_m01 * m22) -
           (m00_m31 * m22 + m20_m01 * m32 + m30_m21 * m02)),
      d * ((m00_m31 * m12 + m10_m01 * m32 + m30_m11 * m02) -
           (m00_m11 * m32 + m10_m31 * m02 + m30_m01 * m12)),
      d * ((m00_m11 * m22 + m10_m21 * m02 + m20_m01 * m12) -
           (m00_m21 * m12 + m10_m01 * m22 + m20_m11 * m02)),
    ];
  },

  perspective: function(fieldOfViewInRadians, aspect, near, far) {
    let f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    let rangeInv = 1.0 / (near - far);

    return [
      f / aspect, 0,                         0,  0,
      0, f,                         0,  0,
      0, 0,   (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2,  0
    ];
  },

  projection: function (width, height, depth) {
    return [
      2 / width,           0,         0, 0,
      0, -2 / height,         0, 0,
      0,           0, 2 / depth, 0,
      -1,           1,         0, 1,
    ];
  },

  lookAt: function(cameraPosition, target, up) {
    let zAxis = vec3.normalize(
      vec3.subtract(cameraPosition, target));
    let xAxis = vec3.normalize(vec3.cross(up, zAxis));
    let yAxis = vec3.normalize(vec3.cross(zAxis, xAxis));

    return [
      xAxis[0], xAxis[1], xAxis[2], 0,
      yAxis[0], yAxis[1], yAxis[2], 0,
      zAxis[0], zAxis[1], zAxis[2], 0,
      cameraPosition[0],
      cameraPosition[1],
      cameraPosition[2],
      1,
    ];
  },

  orthographic: function(left, right, bottom, top, near, far) {
    return [
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0,

      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1,
    ];
  },

  multiply: function(a, b) {
    let b00 = b[0 * 4 + 0];
    let b01 = b[0 * 4 + 1];
    let b02 = b[0 * 4 + 2];
    let b03 = b[0 * 4 + 3];
    let b10 = b[1 * 4 + 0];
    let b11 = b[1 * 4 + 1];
    let b12 = b[1 * 4 + 2];
    let b13 = b[1 * 4 + 3];
    let b20 = b[2 * 4 + 0];
    let b21 = b[2 * 4 + 1];
    let b22 = b[2 * 4 + 2];
    let b23 = b[2 * 4 + 3];
    let b30 = b[3 * 4 + 0];
    let b31 = b[3 * 4 + 1];
    let b32 = b[3 * 4 + 2];
    let b33 = b[3 * 4 + 3];
    let a00 = a[0 * 4 + 0];
    let a01 = a[0 * 4 + 1];
    let a02 = a[0 * 4 + 2];
    let a03 = a[0 * 4 + 3];
    let a10 = a[1 * 4 + 0];
    let a11 = a[1 * 4 + 1];
    let a12 = a[1 * 4 + 2];
    let a13 = a[1 * 4 + 3];
    let a20 = a[2 * 4 + 0];
    let a21 = a[2 * 4 + 1];
    let a22 = a[2 * 4 + 2];
    let a23 = a[2 * 4 + 3];
    let a30 = a[3 * 4 + 0];
    let a31 = a[3 * 4 + 1];
    let a32 = a[3 * 4 + 2];
    let a33 = a[3 * 4 + 3];

    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },
}


function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}

export { mat4, radToDeg, degToRad } ;
