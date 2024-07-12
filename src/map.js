
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
    this.hLine = function(xStart, xEnd, yLevel){
        while(xStart <= xEnd){
            this.map[xStart][yLevel] = WALL;
            xStart++;
        }
    };

    //vertical track editor
    this.vLine = function(yStart, yEnd, xLevel){
        while(yStart <= yEnd){
            this.map[xLevel][yStart] = WALL;
            yStart++;
        }
    };

    //fills in between WALLS with TRACK
    this.fill = function(){
        let alternateWhenWall = false;
        for(let xValues = 0; xValues<this.x; xValues++){
            for(let yValues = 0; yValues<this.y; yValues++){
                if(alternateWhenWall == true && this.map[xValues][yValues] == UNASSIGNED){
                    this.map[xValues][yValues] = TRACK;
                }
                if(alternateWhenWall == false && this.map[xValues][yValues] == WALL){
                    alternateWhenWall = true;
                }
    
                else if(alternateWhenWall == true && this.map[xValues][yValues] == WALL){
                    alternateWhenWall = false;
                }
                
            }
        }
    };

    //create positive diagonal line
    this.diagonalUp = function(xStart, xEnd, yStart, yEnd){
        while(xStart < xEnd && yStart < yEnd){
            this.map[xStart][yStart] = WALL;
            xStart++;
            yStart++;
        }
    };

    //creat negative diagonal line
    this.diagonalDown = function(xStart, xEnd, yStart, yEnd){
        while(xStart < xEnd && yStart > yEnd){
            this.map[xStart][yStart] = WALL;
            xStart++;
            yStart--;
        }
    }
/*
    this.Circle = function(radius, xCenter, yCenter){
        this.map.diagonalUp(xCenter - radius, xCenter, yCenter, yCenter + radius);
        this.map.diagonalUp(xCenter, xCenter + radius, yCenter - radius, yCenter);
        this.map.diagonalDown(xCenter - radius, xCenter, yCenter, yCenter - radius);
        this.map.diagonalDown(xCenter, xCenter + radius, yCenter + radius, yCenter);
    };*/
}
//main 


let x = 24;
let y = 10;
let nemo = new Map(x,y); //nemo cuz why not

//Rectangle

nemo.hLine(4, 19, 3);
nemo.hLine(4, 19, 6);
nemo.vLine(3, 6, 4);
nemo.vLine(3, 6, 19);

nemo.hLine(0, 23, 0);
nemo.hLine(0, 23, 9);
nemo.vLine(0, 9, 0);
nemo.vLine(0, 9, 23);


nemo.fill();

nemo.visMap();
