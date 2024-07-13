    #version 300 es

    // an attribute is an input (in) to a vertex shader.
    // It will receive data from a buffer
    in vec4 a_position;

    // all shaders have a main function
    void main() {

      // gl_Position is a special variable a vertex shader
      // is responsible for setting
      mat4 rotate;
      rotate[0] = vec4(1, -1, 0, 0);
      rotate[1] = vec4(0, 2, 0, 0);
      rotate[2] = vec4(-1, -1, 0, 0);
      rotate[3] = vec4(0, -0.5, 0, 1);
      gl_Position = 0.1 * rotate * a_position;
    }
