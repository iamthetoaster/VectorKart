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

        const faceVerts = tokens.slice(1).filter((token) => token.length > 0).map((token) => {
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

function mapModel(map) {
  const triangles = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map.length; x++) {
      // TODO
      const tile = map[y][x];

      switch (tile) {
        case 0: {
          const positions = [
            [x, y],
            [x + 1, y],
            [x, y + 1],
            [x + 1, y + 1],
          ];
          const verts = positions.map(([x, y]) => {
            return {
              position: [x, 0, y, 1],
              normal: [0, 1, 0, 0],
              uv: [0, 0, 0],
            };
          });
          triangles.push(
            verts[0], verts[2], verts[1],
            verts[1], verts[2], verts[3],
          );
          break;
        }
        default: {
          break;
        }
      }
    }
  }
  return triangles;
}

export { parseObjText, mapModel };
