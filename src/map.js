
function Map(x, y){
    const UNASSIGNED = 0;
    const WALL = 1;
    const TRACK = 2;

    this.map = [];
    this.x = x;
    this.y = y;
    for(let i = 0; i < x; i++){
        this.map[i] = [];
        for(let j = 0; j < y; j++){
            this.map[i][j] = 0;
        }
    }

    //map visualizer in th 4th quadrant
    this.visMap = function() {
        let s = ""; // a string to represent the array
        for(let yValues = 0; yValues < this.y; yValues++){
            s = "";
            for(let xValues = 0; xValues < this.x; xValues++){

                if(this.map[xValues][yValues] == UNASSIGNED){
                    s = s.concat("O" + "&nbsp" + "&nbsp" + "&nbsp"); //O represents an undefined value
                }

                else if(this.map[xValues][yValues] == WALL){
                    s = s.concat("X" + "&nbsp" + "&nbsp" + "&nbsp");// X represents a wall
                }

                else if(this.map[xValues][yValues] == TRACK){
                    s = s.concat("Q" + "&nbsp" + "&nbsp" + "&nbsp");// Q represents track space
                }

                else{
                    s = s.concat("?" + "&nbsp" + "&nbsp" + "&nbsp");// ? for mistakes lol
                }
            }

            document.write(s);
            document.write("<br>");

        }
    };

    //horizontal track editor
    this.hLine = function(xStart, xEnd, yLevel, type){
        while(xStart <= xEnd){
            this.map[xStart][yLevel] = type;
            xStart++;
        }
    };

    //vertical track editor
    this.vLine = function(yStart, yEnd, xLevel,type){
        while(yStart <= yEnd){
            this.map[xLevel][yStart] = type;
            yStart++;
        }
    };

    //fills in between WALLS with TRACK
    /*
    this.fill = function(){
        let seenWall = false;
        let fillWithTrack = false;
        for(let xValues = 0; xValues<this.x; xValues++){
            fillWithTrack = false;
            seentrack = false;
            for(let yValues = 0; yValues<this.y; yValues++){
                if(fillWithTrack == true && seenWall == true && this.map[xValues][yValues] == UNASSIGNED){
                    this.map[xValues][yValues] = TRACK;
                }

                if(this.map[xValues][yValues] == WALL){
                    seenWall = true;
                    fillWithTrack = false;
                }


            }
        }
    };*/

    //create negative diagonal line
    this.diagonalDown = function(xStart, xEnd, yStart, yEnd, type){
        while(xStart < xEnd && yStart < yEnd){
            this.map[xStart][yStart] = type;
            xStart++;
            yStart++;
        }
    };

    //create positive diagonal line
    this.diagonalUp = function(xStart, xEnd, yStart, yEnd, type){
        while(xStart < xEnd && yStart > yEnd){
            this.map[xStart][yStart] = type;
            xStart++;
            yStart--;
        }
    }

    this.createDiamond = function(radius, xCenter, yCenter, type){
        this.map[xCenter][yCenter + radius] = type;
        this.map[xCenter][yCenter - radius] = type;
        this.map[xCenter + radius][yCenter] = type;
        this.map[xCenter - radius][yCenter] = type;
        this.diagonalDown(xCenter - radius, xCenter, yCenter, yCenter + radius, type);
        this.diagonalDown(xCenter, xCenter + radius, yCenter - radius, yCenter,type);
        this.diagonalUp(xCenter - radius, xCenter, yCenter, yCenter - radius, type);
        this.diagonalUp(xCenter, xCenter + radius, yCenter + radius, yCenter, type);
    };

    this.Diamond = function (innerRadius, outerRadius, xCenter, yCenter){
        this.createDiamond(outerRadius, xCenter, yCenter, WALL);
        this.createDiamond(innerRadius, xCenter, yCenter, WALL);

        let fill = (outerRadius-1);
        while(fill > innerRadius){
            this.createDiamond(fill, xCenter, yCenter, TRACK);
            fill--;
        }
    }

    this.createCircle = function(radius, angle, xCenter, yCenter, type){
        const PI = 3.141592653
        for(let degree = 0; degree < angle; degree++){
            let xShift = Math.round(radius * Math.cos(degree * PI / 180));
            let yShift = Math.round(radius * Math.sin(degree * PI / 180));

            this.map[xCenter+xShift][yCenter+yShift] = type;
        }
    };

    this.Circle = function(innerRadius, outerRadius, xCenter, yCenter){
        this.createCircle(innerRadius, 360, xCenter, yCenter, WALL);
        this.createCircle(outerRadius, 360, xCenter, yCenter, WALL);

        let fill = (outerRadius-1);
        while(fill > innerRadius){
            this.createCircle(fill, 360, xCenter, yCenter, TRACK);
            fill--;
        }
    };

    this.createBean = function(radius, xCenter, yCenter){
        this.createCircle(radius, 180, xCenter, yCenter);
    }


}
//main


let x = 71;
let y = 71;
let nemo = new Map(x,y); //nemo cuz why not

//Rectangle
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

//nemo.Diamond(20, 32, 35, 35);
nemo.Circle(26, 32, 35, 35);

nemo.visMap();
