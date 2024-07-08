import { resizeCanvasToDisplaySize, parseObjText, createShader, createProgram } from "./webgl_utils.js"
import { mat4, radToDeg, degToRad } from "./math_utils.js"

"use strict";

let render = {
  setup: async function (canvas) {

    let gl = canvas.getContext("webgl2");
    render.gl = gl;
    if (!gl) {
      console.log("AHH");
    }

    // grabbing shader source
    let fragmentResponse = await fetch("/resources/shaders/fragment_shader.glsl");
    let vertexResponse = await fetch("/resources/shaders/vertex_shader.glsl");

    let vertexShaderSource = await vertexResponse.text();
    let fragmentShaderSource = await fragmentResponse.text();


    // building shaders from source
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // building program from shaders
    let program = createProgram(gl, vertexShader, fragmentShader);

    // set program and vao
    gl.useProgram(program);

    render.camera = {
      position: [1000, 1000, 0],
      target: [0, 0, 0],
    }

    requestAnimationFrame(render.draw);
  },

  draw: function(time) {

    let deltaTime = render.lastTime !== null ? time - render.lastTime : 0;
    // enabling gl features
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);


    // resizing canvas
    resizeCanvasToDisplaySize(gl.canvas);
    // setting viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // clearing display
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Compute the camera's matrix
    let up = [0, 1, 0];
    let cameraMatrix = mat4.lookAt(render.camera.position, render.camera.target, up);

    let viewMatrix = mat4.inverse(cameraMatrix);

    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let zNear = 1;
    let zFar = 2000;
    let fov = 0.5;
    render.viewProjectionMatrix = mat4.multiply(mat4.perspective(fov, aspect, zNear, zFar), mat4.inverse(cameraMatrix));

    requestAnimationFrame(render.draw);
  },

  models: {},

  makeModel: function(name, obj, program) {
    // find location of items for given program
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let normalAttributeLocation = gl.getAttribLocation(program, "a_normal");

    let matrixLocation = gl.getUniformLocation(program, "u_matrix");

    let count = obj.length;

    // vertex attribute object
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // converting model data to useful format
    let positions = obj.map((vert) => {
      return vert.position;
    }).flat();

    // creating buffer for position and binding it
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Loading data into buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);
    let size = 4;
    let type = gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;
    gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

    // ditto for normals
    let normals = obj.map((vert) => {
      return vert.normal;
    }).flat();

    let normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 4, gl.FLOAT, false, 0, 0);

    let model = {
      program: program,
      vao: vao,
      vertexCount: count,
      matrixLocation: matrixLocation,

      transform: {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },

      draw: function () {
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);

        let translation = this.transform.translation;
        let rotation = this.transform.rotation;
        let scale = this.transform.scale;

        // generating transformMatrix from transform data
        let transformMatrix = render.viewProjectionMatrix;
        transformMatrix = mat4.translate(transformMatrix, translation[0], translation[1], translation[2]);
        transformMatrix = mat4.xRotate(transformMatrix, rotation[0]);
        transformMatrix = mat4.yRotate(transformMatrix, rotation[1]);
        transformMatrix = mat4.zRotate(transformMatrix, rotation[2]);
        transformMatrix = mat4.scale(transformMatrix, scale[0], scale[1], scale[2]);


        gl.uniformMatrix4fv(this.matrixLocation, false, transformMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
      },
    }
    render.models[name] = model;
    return name;
  },
  lastTime: null,
};

export { render };
