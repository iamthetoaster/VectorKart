function genMap(x, y){
    let map = [];
    
    for(let i = 0; i < y; i++){
        map[i] = [];
        for(let j = 0; j < x; j++){
            map[i][j] = 0;
        }
    }
    return map;
}


//console.log(map);

//horizontal track editor
function hLine(map, x1, x2, y1){
    while(x1 <= x2){
        map[y1][x1] = 1;
        x1++;
    }
}

//vertical track editor
function vLine(map, y1, y2, x1){
    while(y1<=y2){
        map[y1][x1] = 1;
        y1++;
    }
}


function fill(map, x, y){
    let f = 0;
    for(let i = 0; i<y; i++){
        for(let j = 0; j<x; j++){
            if(f == 1 && map[i][j] == 0){
                map[i][j] = 2;
            }
            if(f == 0 && map[i][j] == 1){
                f = 1;
            }

            else if(f == 1 && map[i][j] == 1){
                f = 0;
            }
            
        }
    }
}

//map visualizer in the 4th quadrant
function visMap(map, x , y){
    let s = "";
    for(let i = y-1; i >= 0; i--){
        s = "";
        for(let j = 0; j < x; j++){
            if(map[i][j] == 0){
                s = s.concat("O" + "&nbsp" + "&nbsp" + "&nbsp");
            }

            else if(map[i][j] == 1){
                s = s.concat("X" + "&nbsp" + "&nbsp" + "&nbsp");
            }

            else{
                s = s.concat("Q" + "&nbsp" + "&nbsp" + "&nbsp");
            }
        }

        document.write(s);
        document.write("<br>");
        
    }
}

//main 
let x = 24;
let y = 10;
let map = genMap(x, y);

hLine(map, 4, 19, 3);
hLine(map, 4, 19, 6);
vLine(map, 3, 6, 19);
vLine(map, 3, 6, 4);

hLine(map, 0, 23, 0);
hLine(map, 0, 23, 9);
vLine(map, 0, 9, 0);
vLine(map, 0, 9, 23);

fill(map, x, y);
visMap(map, x, y);