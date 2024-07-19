const testMap = [
  [1, 1, 1, 1, 1],
  [1, 2, 0, 0, 2],
  [1, 2, 0, 2, 1],
  [1, 2, 2, 1, 1],
  [1, 1, 1, 1, 1],
];

function mapCollides(map, x, y, radius) {
  for (let checkY = Math.floor(y - radius); checkY <= Math.floor(y + radius); checkY++) {
    for (let checkX = Math.floor(x - radius); checkX <= Math.floor(x + radius); checkX++) {
      // console.log(`${checkX}, ${checkY}`);
      const blockType = map[checkY][checkX];
      switch (blockType) {
        case 1: { {
          if (distanceFromSquare(checkX, checkY, x, y) < radius) {
            return true;
          }
        }; break;
        }

        case 2: { {
          if (distanceFromSquare(checkX, checkY, x, y) < radius) {
            return true;
          }
        }; break;
        }

        default: {
          continue;
        }
      }
    }
  }
  return false;
}

function distanceFromSquare(squareX, squareY, x, y) {
  const dx = Math.max(0.5 - Math.abs(x - (squareX + 0.5)), 0);
  const dy = Math.max(0.5 - Math.abs(y - (squareY + 0.5)), 0);

  console.log(dx, dy);

  return Math.hypot(dx, dy);
}

export { testMap, mapCollides };
