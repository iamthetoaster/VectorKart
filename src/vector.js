class vector {
    constructor(a_x=0,a_y=0,color=[1,1,1,1],turn,prev=null) {
        //assume
        
        this.color = color;
        //coordinates for point a 
        this.a_x = a_x; 
        this.a_y = a_y;
        //coordinates for point b
        this.b_x = a_x; //b_x and b_y will be determined by user input, so they can just be made the same as point a by default
        this.b_y = a_y;
        this.time = turn;
        this.dist = dist

        this.dist = this.get_distance()
        this.velocity = dist / turn
        this.prev = prev
        this.acc = this.get_accelleration()
    }
    //what will my vector need 
    get_distance() {
        let x_len = this.b_x - this.a_x;
        
        let y_len = this.b_y - this.a_y;
        let z_sqrd = Math.pow(x_len, 2) + Math.pow(y_len, 2);
        return Math.sqrt(z_sqrd);
        if (this.prev == null) {
            return;
        }
        //get previous velocity, 
        return this.prev.velocity + this.velocity

    }
    angleBetween(v1, v2){
        v1_mag = v1.magnitude()
        v2_mag = v2.magnitude()
        // console.log(v1_mag, v2_mag, Vector3.dot(v1, v2))
        return Math.acos((Vector3.dot(v1, v2) / (v1_mag * v2_mag)))
    }
    
    get_triangle() { //get specs for rendering triangle. Might not want to render it in here though.
        var old_vel = this.prev.velocity; 
        var numerator = Math.pow(this.acc, 2) + Math.pow(old_vel, 2) - Math.pow(this.velocity, 2)
        var denominator = 2 * old_vel * this.velocity 
        var p3 = Math.acos(numerator / denominator)
        va
        //like old_vel 
        //rotate the vector with matrix
        //like old

        //alright coordinates
        //0 0 0
        //acceleration 0 0
        //trigonometry for the rest
    }
    render() {
        //velocity triangle for gabe
        //webgl stuff, may need to get some variables from the constructor when it's called in main
    }
    
}