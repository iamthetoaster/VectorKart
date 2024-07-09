const { default: QuadMesh } = require("three/examples/jsm/objects/QuadMesh.js");

class vector {
    tructor(a_x=0,a_y=0,color=[1,1,1,1]) {
        
        this.color = color;
        //coordinates for point a 
        this.a_x = a_x; 
        this.a_y = a_y;
        //coordinates for point b
        this.b_x = a_x; //b_x and b_y will be determined by user input, so they can just be made the same as point a by default
        this.b_y = a_y;
        this.velocity = velocity //should take in either starting velocity or velocity from previous vector
        this.acceleration = acceleration //likewise with acceleration, see above comment

        //render function keeps the first coordinates on spot but is constantly taking in point b coordinates 
    }
    //what will my vector need 

    render() {
        gl.drawArrays(gl.LINES, 0, n);
        
        }
    
    
    
    }
    
}