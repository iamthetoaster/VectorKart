import { resizeCanvasToDisplaySize, parseObjText, createShader, createProgram } from "./webgl_utils.js"
import { mat4, radToDeg, degToRad } from "./math_utils.js"

"use strict";

let models = {};
let gl = null;
let car_model = null;

let render = {
  setup: async function (canvas) {

    gl = canvas.getContext("webgl2");
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

    // grabbing model data
    let obj = await fetch("/resources/models/race.obj")
        .then((response) => response.text())
        .then((text) => parseObjText(text));
    // set program and vao
    gl.useProgram(program);

    car_model = render.makeModel("car", obj, program);
    // resizing canvas
    resizeCanvasToDisplaySize(canvas);

    requestAnimationFrame(render.draw);
  },

  draw: function(time) {
    // enabling gl features
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // setting viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // clearing display
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // transform data for model
    let translation = [100, 100, 0];
    let rotation = [degToRad(40), degToRad(25), time / 1000];
    let scale = [100, 100, 100];

    // generating matrix from transform data
    let matrix = mat4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
    matrix = mat4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = mat4.xRotate(matrix, rotation[0]);
    matrix = mat4.yRotate(matrix, rotation[1]);
    matrix = mat4.zRotate(matrix, rotation[2]);
    matrix = mat4.scale(matrix, scale[0], scale[1], scale[2]);

    render.models[car_model].transformMatrix = matrix;

    render.models[car_model].draw();

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

      transformMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],

      draw: function () {
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);
        gl.uniformMatrix4fv(this.matrixLocation, false, this.transformMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
      },
    }
    render.models[name] = model;
    return name;
  }
};

export { render };
