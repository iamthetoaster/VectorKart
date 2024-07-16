function Map(x, y) {
  const UNASSIGNED = 0;
  const WALL = 1;
  const TRACK = 2;
  const START = 3;

  this.map = [];
  this.x = x;
  this.y = y;
  for (let index = 0; index < x; index++) {
      this.map[index] = [];
      for (let index_ = 0; index_ < y; index_++) {
          this.map[index][index_] = UNASSIGNED;
      }
  }

  this.visMap = function () {
    let s = '<div>'; // Start a new div for the map
    for (let yValues = 0; yValues < this.y; yValues++) {
      for (let xValues = 0; xValues < this.x; xValues++) {
        if (this.map[xValues][yValues] == UNASSIGNED) {
          s += '<span class="map-unassigned">O</span>'; 
        } else if (this.map[xValues][yValues] == WALL) {
          s += '<span class="map-wall">X</span>';
        } else if (this.map[xValues][yValues] == TRACK) {
          s += '<span class="map-track">Q</span>';
        } else if (this.map[xValues][yValues] == START) {
          s += '<span class="map-start">D</span>';
        }
      }
      s += '<br>';
    }
    s += '</div>';
    document.getElementById('mapContainer').innerHTML = s;
  };  

  this.hLine = function (xStart, xEnd, yLevel, type) {
      while (xStart <= xEnd) {
          this.map[xStart][yLevel] = type;
          xStart++;
      }
  };

  this.vLine = function (yStart, yEnd, xLevel, type) {
      while (yStart <= yEnd) {
          this.map[xLevel][yStart] = type;
          yStart++;
      }
  };

  this.fill = function () {
      let seenWall, trackFilled, fillWithTrack, trackMax, trackCount;
      for (let xValues = 0; xValues < this.x; xValues++) {
        fillWithTrack = true;
        seenWall = false;
        trackFilled = false;
        trackMax = 0;
        trackCount = 0;
  
        for (let yValueCheck = 0; yValueCheck < this.y; yValueCheck++) {
          if (this.map[xValues][yValueCheck] == WALL) {
            seenWall = true;
          }
  
          if (this.map[xValues][yValueCheck] == UNASSIGNED && seenWall == true) {
            trackMax++;
            seenWall = false;
          }
        }
        if (trackMax > 1) {
          fillWithTrack = true;
          seenWall = false;
          trackFilled = false;
  
          for (let yValues = 0; yValues < this.y; yValues++) {
            if (trackMax % 2 == 0) {
              if (fillWithTrack == true && seenWall == true && this.map[xValues][yValues] == UNASSIGNED) {
                this.map[xValues][yValues] = TRACK;
                trackFilled = true;
              }
  
              if (fillWithTrack == false && seenWall == true && this.map[xValues][yValues] == UNASSIGNED) {
                trackFilled = true;
              }
  
              if (this.map[xValues][yValues] == WALL) {
                seenWall = true;
                if (trackFilled == true) {
                  fillWithTrack = !fillWithTrack;
                }
                trackFilled = false;
              }
            } else {
              if (fillWithTrack == true && seenWall == true && this.map[xValues][yValues] == UNASSIGNED) {
                this.map[xValues][yValues] = TRACK;
                if (trackFilled == false) {
                  trackCount++;
                }
                trackFilled = true;
              }
  
              if (this.map[xValues][yValues] == WALL) {
                seenWall = true;
                trackFilled = false;
              }
  
              if (trackCount == trackMax) {
                break;
              }
            }
          }
        }
      }
  };

  // create negative diagonal line
  this.diagonalDown = function (xStart, xEnd, yStart, yEnd, type) {
      while (xStart < xEnd && yStart < yEnd) {
      this.map[xStart][yStart] = type;
      xStart++;
      yStart++;
      }
  };

  // create positive diagonal line
  this.diagonalUp = function (xStart, xEnd, yStart, yEnd, type) {
      while (xStart < xEnd && yStart > yEnd) {
      this.map[xStart][yStart] = type;
      xStart++;
      yStart--;
      }
  };

  this.createDiamond = function (radius, xCenter, yCenter, type) {
      this.map[xCenter][yCenter + radius] = type;
      this.map[xCenter][yCenter - radius] = type;
      this.map[xCenter + radius][yCenter] = type;
      this.map[xCenter - radius][yCenter] = type;
      this.diagonalDown(xCenter - radius, xCenter, yCenter, yCenter + radius, type);
      this.diagonalDown(xCenter, xCenter + radius, yCenter - radius, yCenter, type);
      this.diagonalUp(xCenter - radius, xCenter, yCenter, yCenter - radius, type);
      this.diagonalUp(xCenter, xCenter + radius, yCenter + radius, yCenter, type);
  };

  this.Diamond = function (innerRadius, outerRadius, xCenter, yCenter) {
      this.createDiamond(outerRadius, xCenter, yCenter, WALL);
      this.createDiamond(innerRadius, xCenter, yCenter, WALL);
      this.fill();
      this.vLine(yCenter - outerRadius + 1, yCenter - innerRadius - 1, xCenter, START);
  };

  this.createCircle = function (radius, angle, xCenter, yCenter, type) {
      const PI = 3.141_592_653;
      for (let degree = 0; degree < angle; degree++) {
        const xShift = Math.round(radius * Math.cos(degree * PI / 180));
        const yShift = Math.round(radius * Math.sin(degree * PI / 180));
  
        this.map[xCenter + xShift][yCenter + yShift] = type;
      }
  };

  this.upperCircle = function (radius, angle, xCenter, yCenter, type) {
      const PI = 3.141_592_653;
      for (let degree = 360; degree > angle; degree--) {
        const xShift = Math.round(radius * Math.cos(degree * PI / 180));
        const yShift = Math.round(radius * Math.sin(degree * PI / 180));
        this.map[xCenter + xShift][yCenter + yShift] = type;
      }
  };

  this.Circle = function (innerRadius, outerRadius, xCenter, yCenter) {
      this.createCircle(innerRadius, 360, xCenter, yCenter, WALL);
      this.createCircle(outerRadius, 360, xCenter, yCenter, WALL);
      this.fill();
      this.vLine(yCenter - outerRadius + 1, yCenter - innerRadius - 1, xCenter, START);
  };

  this.createBean = function (radius, innerRadius, xCenter, yCenter, type) {
      const smallRadius = Math.round(((radius - innerRadius) / 2));
      this.createCircle(radius, 181, xCenter, yCenter, type);
      this.createCircle(innerRadius, 180, xCenter, yCenter, type);
      this.vLine(yCenter - radius / 2, yCenter, xCenter + radius, type);
      this.vLine(yCenter - radius / 2, yCenter, xCenter - radius, type);
      this.vLine(yCenter - radius / 2, yCenter, xCenter + innerRadius, type);
      this.vLine(yCenter - radius / 2, yCenter, xCenter - innerRadius, type);
      this.upperCircle(smallRadius, 180, xCenter + Math.round((radius + innerRadius) / 2), yCenter - radius / 2, type);
      this.upperCircle(smallRadius, 180, xCenter - Math.round((radius + innerRadius) / 2), yCenter - radius / 2, type);
  };

  this.Bean = function (innerRadius, outerRadius, xCenter, yCenter) {
      this.createBean(outerRadius, Math.round(outerRadius / 4), xCenter, yCenter, WALL);
      this.createBean(innerRadius, Math.round(innerRadius / 2), xCenter, yCenter, WALL);
      this.map[xCenter][yCenter + Math.round(outerRadius / 4) + 1] = START;
      this.map[xCenter][yCenter + Math.round(innerRadius / 2) - 1] = START;
      this.fill();
      this.vLine(yCenter + Math.round(outerRadius / 4) + 1, yCenter + Math.round(innerRadius / 2) - 1, xCenter, START);
  };

}

// Main
const x = 71;
const y = 71;
const nemo = new Map(x, y); // nemo cuz why not

// Rectangle
/*
nemo.hLine(4, 19, 3);
nemo.hLine(4, 19, 6);
nemo.vLine(3, 6, 4);
nemo.vLine(3, 6, 19);

nemo.hLine(0, 23, 0);
nemo.hLine(0, 23, 9);
nemo.vLine(0, 9, 0);
nemo.vLine(0, 9, 23);

*/

// nemo.Diamond(26, 32, 35, 35);
nemo.Circle(26, 32, 35, 35);
// nemo.Bean(26, 32, 35, 35);

nemo.visMap();
