    #version 300 es

    // fragment shaders don't have a default precision so we need
    // to pick one. highp is a good default. It means "high precision"
    precision highp float;

    // we need to declare an output for the fragment shader
    in vec4 v_Normal;
    in vec3 u_Eye;
    vec4 v_VertPos;
    uniform vec3 u_lightPosition;
    uniform vec3 u_lightRGB;
    out vec4 outColor;

    void main() {
      // Just set the output to a constant reddish-purple
     vec3 norm = normalize(v_Normal.xyz);
      outColor = vec4((norm + vec3(1, 1, 1)) * 0.5, 1);

      vec3 ambient = vec3(outColor) * 0.1;   
      vec3 lightVector = vec3(v_VertPos) - u_lightPosition;
      vec3 L = normalize(lightVector);
      float NdotL = max(dot(norm, L), 0.0);
      vec3 diffuse = vec3(outColor) * NdotL * .8;

      
      vec3 R = reflect(-L, norm);
      vec3 E = normalize(u_Eye - vec3(v_VertPos));  
      vec3 specular = vec3(outColor) * pow(max(dot(E,R), 0.0), 10.0);

      outColor = vec4((diffuse + ambient + specular) * u_lightRGB, 1.0);
    }
