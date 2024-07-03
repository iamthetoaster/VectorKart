"use strict";

// todo figure out modules export import

function parseObjText(text) {
  let lines = text.split("\n");

  let verts = [[0,0,0,1]];
  let vertNormals = [[0,0,0,0]];
  let textureVerts = [[0,0,0]];
  let triangles = [];

  for (const line of lines) {
    let tokens = line.split(/\s+/);
    // console.log("Line:")
    // console.log(line);
    switch (tokens[0]) {
      case "v": {
        // console.log("Vertex:");
        let vec = [0,0,0,1];
        for (const [index, value] of tokens.slice(1, vec.length).entries()) {
          vec[index] = Number(value);
        }
        // console.log(vec);
        verts.push(vec);
      } break;
      case "vn": {
        // console.log("Vertex Normal:");
        let vec = [0,0,0,0];
        for (const [index, value] of tokens.slice(1, vec.length).entries()) {
          vec[index] = Number(value);
        }
        // console.log(vec);
        vertNormals.push(vec);
      } break;
      case "vt": {
        // console.log("Vertex Texture");
        let vec = [0,0,0];
        for (const [index, value] of tokens.slice(1, vec.length).entries()) {
          vec[index] = Number(value);
        }
        // console.log(vec);
        textureVerts.push(vec);
      } break;
      case "f": {
        // console.log("Face:");

        let faceVerts = tokens.slice(1).map((token) => {
          let indices = token.split("/").map(Number);
          while (indices.length < 3) {
            indices.push(0);
          }
          return {
            position: verts[indices[0]],
            uv: textureVerts[indices[1]],
            normal: vertNormals[indices[2]],
          }
        })
        // console.log(faceVerts);
        // Fan triangulation, sorry
        for (let index = 1; index < faceVerts.length - 1; index++) {
          triangles.push(faceVerts[0]);
          triangles.push(faceVerts[index]);
          triangles.push(faceVerts[index + 1]);
        }
      } break;
      case "g": {
        // console.log(`Group ${tokens[1]}`);
        // verts = [[0,0,0,1]];
        // vertNormals = [[0,0,0,0]];
        // textureVerts = [[0,0,0]];
      } break;
      default:
        // console.log("Ignored");
    }
  }
  return triangles;
}

function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.attachShader(program, vertexShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);

}

function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
        canvas.width  = width;
        canvas.height = height;
        return true;
    }
    return false;
}

export { resizeCanvasToDisplaySize, parseObjText, createShader, createProgram };
