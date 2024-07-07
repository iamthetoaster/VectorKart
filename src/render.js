import { resizeCanvasToDisplaySize, parseObjText, createShader, createProgram } from "./webgl_utils.js"
import { mat4, radToDeg, degToRad } from "./math_utils.js"

"use strict";

let render = {
  setup: async function (canvas) {

    let gl = canvas.getContext("webgl2");
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

    // find location of items for given program
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let normalAttributeLocation = gl.getAttribLocation(program, "a_normal");

    let matrixLocation = gl.getUniformLocation(program, "u_matrix");


    // creating buffer for position and binding it
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // grabbing model data
    let obj = await fetch("/resources/models/race.obj")
        .then((response) => response.text())
        .then((text) => parseObjText(text));
    // console.log(obj);

    // converting model data to useful format
    let positions = obj.map((vert) => {
      return vert.position;
      
    });
    let count = positions.length;
    console.log(positions);
    positions = positions.flat();

    console.log(Math.min(...positions));
    console.log(Math.max(...positions));

    // Loading data into buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


    // vertex attribute object
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.enableVertexAttribArray(positionAttributeLocation);
    let size = 4;
    let type = gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;
    gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

    // resizing canvas
    resizeCanvasToDisplaySize(canvas);

    // setting viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // clearing display
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set program and vao
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    // ditto for normals
    let normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    let normals = obj.map((vert) => {
      return vert.normal;

    }).flat();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);


    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 4, gl.FLOAT, false, 0, 0);

    // transform data for model
    let translation = [100, 100, 0];
    let rotation = [degToRad(40), degToRad(25), degToRad(325)];
    let scale = [100, 100, 100];

    // generating matrix from transform data
    let matrix = mat4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
    matrix = mat4.translate(matrix, translation[0], translation[1], translation[2]);
    matrix = mat4.xRotate(matrix, rotation[0]);
    matrix = mat4.yRotate(matrix, rotation[1]);
    matrix = mat4.zRotate(matrix, rotation[2]);
    matrix = mat4.scale(matrix, scale[0], scale[1], scale[2]);

    // setting uniform
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    // gl.cullFace(gl.BACK);

    // Drawing model
    let primitiveType = gl.TRIANGLES;
    offset = 0;
    gl.drawArrays(primitiveType, offset, count);
  },
};

export { render };
