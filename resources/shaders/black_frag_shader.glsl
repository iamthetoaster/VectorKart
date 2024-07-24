    #version 300 es

    // fragment shaders don't have a default precision so we need
    // to pick one. highp is a good default. It means "high precision"
    precision highp float;

    // we need to declare an output for the fragment shader
    in vec4 v_normal;
    out vec4 outColor;

    void main() {
      // Just set the output to a constant black
      outColor = vec4(0, 0, 0, 1);
    }
