import { resizeCanvasToDisplaySize, createShader, createProgram } from '../webgl_utils.js';
import { mat4, degToRad } from '../math_utils.js';
import { parseObjText, mapModel } from '../models.js';

'use strict';

// import GameController from "./GameController.js";

export default class RenderEngine {
  objs = {};
  vertexShaders = {};
  fragmentShaders = {};
  programs = {};

  prefabs = {};

  constructor(game) {
    this.game = game;
  }

  async init() {
    const canvas = document.querySelector('#c');
    const gl = canvas.getContext('webgl2');
    this.gl = gl;
    if (!gl) {
      console.log('AHH');
    }

    // LOADING PREFABS
    const prefabs = await fetch('/src/prefabs.json')
      .then((response) => response.json());

    for (const prefab of prefabs) {
      await this.addPrefab(prefab.name, prefab.obj, prefab.vertexShader, prefab.fragmentShader);
    }

    // Camera setup
    this.camera = {
      position: [0, 1000, 1],
      target: [0, 0, 0],
    };

    this.draw();
  }

  async addPrefab(name, obj, vertexShader, fragmentShader) {
    const prefab = {
      name: name,
      obj: obj,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    };

    const gl = this.gl;

    if (prefab.name in this.prefabs) {
      console.log('Error, duplicate prefab name');
      return;
    }

    if (typeof obj === 'string' || obj instanceof String) {
      obj = (prefab.obj in this.objs) ?
        this.objs[prefab.obj] : // if this has already been fetched, go with that
        await fetch(`./resources/${prefab.obj}`) // Otherwise, fetch it,
          .then((response) => response.text())
          .then((text) => {
            const obj = parseObjText(text); // Parse it,
            this.objs[prefab.obj] = obj; // Cache it,
            return obj; // and use the newly fetched obj
          });
    } else {
      obj = (obj.toString() in this.objs) ?
        this.objs[obj.toString()] :
        this.objs[obj.toString()] = mapModel(obj);
    }

    vertexShader = (prefab.vertexShader in this.vertexShaders) ?
      this.vertexShaders[prefab.vertexShader] : // if already fetched, use that
      await fetch(`/resources/${prefab.vertexShader}`) // otherwise fetch it,
        .then((response) => response.text())
        .then((source) => {
          const shader = createShader(gl, gl.VERTEX_SHADER, source); // compile it
          this.vertexShaders[prefab.vertexShader] = shader; // cache it
          return shader; // and use it
        });

    fragmentShader = (prefab.fragmentShader in this.fragmentShaders) ?
      this.fragmentShaders[prefab.fragmentShader] : // same as above
      await fetch(`/resources/${prefab.fragmentShader}`)
        .then((response) => response.text())
        .then((source) => {
          const shader = createShader(gl, gl.FRAGMENT_SHADER, source);
          this.fragmentShaders[prefab.fragmentShader] = shader;
          return shader;
        });

    const programName = `${prefab.vertexShader} => ${prefab.fragmentShader}`;
    // building program from shaders
    let program;
    if (programName in this.programs) {
      program = this.programs[programName];
    } else {
      program = createProgram(gl, vertexShader, fragmentShader);
      this.programs[programName] = program;
    }

    // TODO tidy this up

    // find location of items for given program
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const normalAttributeLocation = gl.getAttribLocation(program, 'a_normal');

    const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

    const count = obj.length;

    // vertex attribute object
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // converting model data to useful format
    const positions = obj.flatMap((vert) => {
      return vert.position;
    });

    // creating buffer for position and binding it
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Loading data into buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);
    const size = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

    // ditto for normals
    const normals = obj.flatMap((vert) => {
      return vert.normal;
    });

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 4, gl.FLOAT, false, 0, 0);

    this.prefabs[prefab.name] = {
      renderEngine: this,
      program: program,
      vao: vao,
      vertexCount: count,
      matrixLocation: matrixLocation,

      instanceAttributes: [],

      draw: function () {
        gl.useProgram(this.program);

        gl.bindVertexArray(this.vao);

        for (const attributes of this.instanceAttributes) {
          const translation = attributes.translation;
          const rotation = attributes.rotation;
          const scale = attributes.scale;

          // generating transformMatrix from transform data
          let transformMatrix = this.renderEngine.viewProjectionMatrix;
          transformMatrix = mat4.translate(transformMatrix, translation[0], translation[1], translation[2]);
          transformMatrix = mat4.xRotate(transformMatrix, rotation[0]);
          transformMatrix = mat4.yRotate(transformMatrix, rotation[1]);
          transformMatrix = mat4.zRotate(transformMatrix, rotation[2]);
          transformMatrix = mat4.scale(transformMatrix, scale[0], scale[1], scale[2]);

          gl.uniformMatrix4fv(this.matrixLocation, false, transformMatrix);
          gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
        }
      },
    };
  }

  // sets runUpdate callback (for frame updating)
  update(callback) {
    this.runUpdate = callback;
    // console.log("update(callback)");
  }

  // callback for updating frame, animations and such
  runUpdate(time) { // eslint-disable-line no-unused-vars
    console.warn('Not Implemented'); // callback, currently set to GameController.frameUpdate()
  }

  draw = (time) => {
    time *= 0.001; // convert to seconds

    this.runUpdate(time); // updates rendering logic/contents

    const gl = this.gl;

    // enabling gl features
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // resizing canvas
    resizeCanvasToDisplaySize(gl.canvas);
    // setting viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // clearing display
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Compute the camera's matrix
    const up = [0, 1, 0];
    const cameraMatrix = mat4.lookAt(this.camera.position, this.camera.target, up);

    // FIXME: Remove if not using
    // const viewMatrix = mat4.inverse(cameraMatrix);

    // const fov = 1;
    // const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    // const zNear = 1;
    const zFar = 4000;
    const width = gl.canvas.clientWidth;
    const height = gl.canvas.clientHeight;
    // this.viewProjectionMatrix = mat4.multiply(mat4.perspective(fov, aspect, zNear, zFar), mat4.inverse(cameraMatrix));
    this.viewProjectionMatrix = mat4.multiply(mat4.projection(width, height, zFar), mat4.inverse(cameraMatrix));

    for (const name of Object.keys(this.prefabs)) {
      this.prefabs[name].draw();
    }

    // recursive draw callback
    requestAnimationFrame(this.draw);
  };

  instantiateRenderObject(prefab) {
    const result = {
      translation: [0, 0, 0],
      rotation: [0, degToRad(25), 0],
      scale: [1, 1, 1],
    };
    this.prefabs[prefab].instanceAttributes.push(result);
    return result;
  }

  worldPosition(canvasX, canvasY) {
    canvasX = (canvasX * 2 - this.gl.canvas.clientWidth) / this.gl.canvas.clientWidth;
    canvasY = (this.gl.canvas.clientHeight - canvasY * 2) / this.gl.canvas.clientHeight;

    const projectionMatrix = this.viewProjectionMatrix;
    const inv = mat4.inverse(projectionMatrix);

    const p1 = mat4.apply(inv, [canvasX, canvasY, 0, 1]);
    const p2 = mat4.apply(inv, [canvasX, canvasY, 1, 1]);

    const y1 = p1[1];
    const y2 = p2[1];

    const z = -y1 / (y2 - y1);

    const p = mat4.apply(inv, [canvasX, canvasY, z, 1]);

    return [p[0], 0, p[2]];
  }
}
