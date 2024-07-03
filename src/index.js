import { resizeCanvasToDisplaySize, parseObjText, createShader, createProgram } from "./webgl_utils.js"
"use strict";


let canvas = document.querySelector("#c");
let gl = canvas.getContext("webgl2");
if (!gl) {
  console.log("AHH");
}




async function setup() {
    let fragmentResponse = await fetch("/resources/shaders/fragment_shader.glsl");
    let vertexResponse = await fetch("/resources/shaders/vertex_shader.glsl");

    let vertexShaderSource = await vertexResponse.text();
    let fragmentShaderSource = await fragmentResponse.text();


    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    let program = createProgram(gl, vertexShader, fragmentShader);

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    let obj = await fetch("/resources/models/meat-tenderizer.obj")
        .then((response) => response.text())
        .then((text) => parseObjText(text));
    console.log(obj);

  let positions = obj.map((vert) => {
    return vert.position;

  });
  let count = positions.length;
  console.log(positions);
  positions = positions.flat();
    // [
    //   0, 0, 0, 1,
    //   0, 0, 0.5, 1,
    //   0.7, 0, 0, 1,
    // ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

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

    resizeCanvasToDisplaySize(canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.bindVertexArray(vao);

    let primitiveType = gl.TRIANGLES;
    offset = 0;
    gl.drawArrays(primitiveType, offset, count);
}

setup();

