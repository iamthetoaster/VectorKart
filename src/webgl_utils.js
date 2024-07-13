function parseObjText(text) {
  const lines = text.split('\n');

  const verts = [[0, 0, 0, 1]];
  const vertNormals = [[0, 0, 0, 0]];
  const textureVerts = [[0, 0, 0]];
  const triangles = [];

  for (const line of lines) {
    const tokens = line.split(/\s+/);
    // console.log("Line:")
    // console.log(line);
    switch (tokens[0]) {
      case 'v': { {
        // console.log("Vertex:");
        const vec = [0, 0, 0, 1];
        for (const [index, value] of tokens.slice(1, vec.length).entries()) {
          vec[index] = Number(value);
        }
        // console.log(vec);
        verts.push(vec);
      } break;
      }
      case 'vn': { {
        // console.log("Vertex Normal:");
        const vec = [0, 0, 0, 0];
        for (const [index, value] of tokens.slice(1, vec.length).entries()) {
          vec[index] = Number(value);
        }
        // console.log(vec);
        vertNormals.push(vec);
      } break;
      }
      case 'vt': { {
        // console.log("Vertex Texture");
        const vec = [0, 0, 0];
        for (const [index, value] of tokens.slice(1, vec.length).entries()) {
          vec[index] = Number(value);
        }
        // console.log(vec);
        textureVerts.push(vec);
      } break;
      }
      case 'f': { {
        // console.log("Face:");

        const faceVerts = tokens.slice(1).filter(token => token.length > 0).map((token) => {
          const indices = token.split('/').map(Number);
          while (indices.length < 3) {
            indices.push(0);
          }
          return {
            position: verts[indices[0]],
            uv: textureVerts[indices[1]],
            normal: vertNormals[indices[2]],
          };
        });
        // console.log(faceVerts);
        // Fan triangulation, sorry
        for (let index = 1; index < faceVerts.length - 1; index++) {
          triangles.push(faceVerts[0], faceVerts[index], faceVerts[index + 1]);
        }
      } break;
      }
      case 'g': { {
        // console.log(`Group ${tokens[1]}`);
        // verts = [[0,0,0,1]];
        // vertNormals = [[0,0,0,0]];
        // textureVerts = [[0,0,0]];
      } break;
      }
      default:
        // console.log("Ignored");
    }
  }
  return triangles;
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.attachShader(program, vertexShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function resizeCanvasToDisplaySize(canvas, multiplier) {
  // eslint-disable-next-line unicorn/prefer-default-parameters
  multiplier = multiplier || 1;
  const width = canvas.clientWidth * Math.trunc(multiplier);
  const height = canvas.clientHeight * Math.trunc(multiplier);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}

export { resizeCanvasToDisplaySize, parseObjText, createShader, createProgram };
