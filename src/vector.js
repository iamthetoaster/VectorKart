class vector {
<<<<<<< Updated upstream
    constructor(a_x=0,a_y=0,color=[1,1,1,1],turn,dist) {
=======
    constructor(a_x=0,a_y=0,color=[1,1,1,1],turn,prev=null) {
        //assume
>>>>>>> Stashed changes
        
        this.color = color;
        //coordinates for point a 
        this.a_x = a_x; 
        this.a_y = a_y;
        //coordinates for point b
        this.b_x = a_x; //b_x and b_y will be determined by user input, so they can just be made the same as point a by default
        this.b_y = a_y;
<<<<<<< Updated upstream
        this.time = turn;
        this.dist = dist

=======
        this.dist = this.get_distance()
        this.velocity = dist / turn
        this.prev = prev
        this.acc = this.get_accelleration()
>>>>>>> Stashed changes
    }
    //what will my vector need 
    get_distance() {
        let x_len = this.b_x - this.a_x;
        
        let y_len = this.b_y - this.a_y;
        let z_sqrd = Math.pow(x_len, 2) + Math.pow(y_len, 2);
        return Math.sqrt(z_sqrd);
    }

    get_accelleration() {
        if (this.prev == null) {
            return;
        }
        //get previous velocity, 
        var velocity = this.prev.velocity + this.velocity

    }
    render() {
        //velocity triangle for gabe
        //webgl stuff, may need to get some variables from the constructor when it's called in main
    }
    
}