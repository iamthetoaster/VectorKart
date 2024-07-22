    #version 300 es

    // fragment shaders don't have a default precision so we need
    // to pick one. highp is a good default. It means "high precision"
    precision highp float;

    // we need to declare an output for the fragment shader
    in vec4 v_normal;
    out vec4 outColor;

    void main() {
      // Just set the output to a constant reddish-purple
      outColor = vec4((normalize(v_normal.xyz) + vec3(1, 1, 1)) * 0.5, 1);

      
      vec3 norm = normalize(v_Normal);

      vec3 ambient = vec3(gl_FragColor) * 0.1;    


      vec3 lightVector = vec3(v_VertPos) - u_lightPosition;
      vec3 L = normalize(lightVector);
      float NdotL = max(dot(norm, L), 0.0);

      vec3 diffuse = vec3(gl_FragColor) * NdotL*.8;


      vec3 R = reflect(-L, norm);
      vec3 E = normalize(u_Eye - vec3(v_VertPos));  
      vec3 specular = vec3(gl_FragColor) * pow(max(dot(E,R), 0.0), 10.0);

      gl_FragColor = vec4((diffuse + ambient + specular) * u_lightRGB, 1.0);


      //make a new light vector for spotlight. Position isn't a variable so can just put in numbers 
      vec3 spotlightVector = vec3(3.9, .2, -3);

      vec3 spotlightTarget = vec3(0, -.75, 0);

      vec3 w = normalize(spotlightVector - spotlightTarget);
      float ndotSL = max(dot(w, norm), 0.0);

      vec3 spotlightSpecular = ndotSL * vec3(gl_FragColor);      
      vec3 spotlightDiffuse = vec3(gl_FragColor) * ndotSL*.8;
      vec3 spotlightAmbient = vec3(gl_FragColor) * 0.2;

      gl_FragColor = vec4(diffuse + spotlightDiffuse + ambient + specular + spotlightSpecular, 1.0);
    }
