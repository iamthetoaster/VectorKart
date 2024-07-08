class vector {
    constructor(a_x=0,a_y=0,color=[1,1,1,1]) {
        
        this.color = color;
        //coordinates for point a 
        this.a_x = a_x; 
        this.a_y = a_y;
        //coordinates for point b
        this.b_x = a_x; //b_x and b_y will be determined by user input, so they can just be made the same as point a by default
        this.b_y = a_y;
    }
    //what will my vector need 

    render() {
        //webgl stuff, may need to get some variables from the constructor when it's called in main
    }
    
}