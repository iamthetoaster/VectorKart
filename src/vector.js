class vector {
    constructor(a_x=0,a_y=0,color=[1,1,1,1],turn,prev=null, scale, translation, rotation, tri_pos_x=0, tri_pos_y=0, base_pox_x, base_pos_y) {
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
        this.matrix = new Matrix4()
        this.dist = this.get_distance()
        this.velocity = dist / turn
        this.prev = prev
        this.acc = this.get_accelleration()
        this.verts = this.get_triangle()
        this.tri_height = this.verts[7]
        this.base_tri_pos = [tri_pos_x, tri_pos_y]
        this.base_pos = [base_pos_x, base_pos_y]
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

    get_triangle() { 
        //get specs for rendering triangle. Might not want to render it in here though.
        var old_vel = this.prev.velocity; 
        point1 = new Vector3([this.base_tri_pos[0],acc,0])
        point2 = new Vector3([this.base_tri_pos[0],this.base_tri_pos[1],0])
         //get specs for rendering triangle. Might not want to render it in here though.
         var old_vel = this.prev.velocity; 
         var numerator = Math.pow(old_vel, 2) + Math.pow(this.acc, 2) - Math.pow(this.velocity, 2)
         var denominator = 2 * old_vel * this.acc
         var p3 = Math.acos(numerator / denominator)
         var area = .5 * this.acc * this.old_vel * Math.sin(p3)
         var height = (2 * area) / this.old_vel
         var x =  Math.sqrt((Math.pow(old_vel, 2) - Math.pow(height, 2))) 

        //like old_vel 
        //rotate the vector with matrix
        //like old

        //alright coordinates
        //0 0 0
        //acceleration 0 0
        //trigonometry for the rest
        return [
            this.base_tri_pos[0],acc,0,
            this.base_tri_pos[0],this.base_tri_pos[1],0,
            x,height,0
        ]
    }
    scale(x, y) {
        this.matrix.scale(x, y, 1)
    }
    rotation(angle, x, y) {
        this.matrix.rotate(angle, x, y, 0)
    }
    render() {
        //velocity triangle for gabe
        //webgl stuff, may need to get some variables from the constructor when it's called in main
        var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verts), gl.DYNAMIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  
    gl.enableVertexAttribArray(positionAttributeLocation);
    
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); might not be necessary
    }
    
}
