import { resizeCanvasToDisplaySize, parseObjText, createShader, createProgram } from "../webgl_utils.js"
import { mat4, radToDeg, degToRad } from "../math_utils.js"

"use strict";

// import GameController from "./GameController.js";

export default class RenderEngine {

    objs = {}
    vertexShaders = {}
    fragmentShaders = {}
    programs = {}

    prefabs = {}

    constructor(game) {
        this.game = game;
    }

    async init() {
        let canvas = document.querySelector("#c");
        let gl = canvas.getContext("webgl2");
        this.gl = gl;
        if (!gl) {
        console.log("AHH");
        }

        // LOADING PREFABS
        let prefabs = await fetch("/src/prefabs.json")
            .then((response) => response.json());

        for (const prefab of prefabs) {
            if (prefab.name in this.prefabs) {
                console.log("Error, duplicate prefab name");
                return;
            }

            let obj = (prefab.obj in this.objs) ? this.objs[prefab.obj] // if this has already been fetched, go with that
                : await fetch(`/resources/${prefab.obj}`)   // Otherwise, fetch it,
                .then((response) => response.text())
                .then((text) => {
                    let obj = parseObjText(text);           // Parse it,
                    this.objs[prefab.obj] = obj;            // Cache it,
                    return obj;                             // and use the newly fetched obj
                });

            let vertexShader = (prefab.vertexShader in this.vertexShaders) ? this.vertexShaders[prefab.vertexShader] // if already fetched, use that
                : await fetch(`/resources/${prefab.vertexShader}`)              // otherwise fetch it,
                .then((response) => response.text())
                .then((source) => {
                    let shader = createShader(gl, gl.VERTEX_SHADER, source); // compile it
                    this.vertexShaders[prefab.vertexShader] = shader;       // cache it
                    return shader;                                          // and use it
                });

            let fragmentShader = (prefab.fragmentShader in this.fragmentShaders) ? this.fragmentShaders[prefab.fragmentShader] // same as above
                : await fetch(`/resources/${prefab.fragmentShader}`)
                .then((response) => response.text())
                .then((source) => {
                    let shader = createShader(gl, gl.FRAGMENT_SHADER, source);
                    this.fragmentShaders[prefab.fragmentShader] = shader;
                    return shader;

                });

            let programName = `${prefab.vertexShader} => ${prefab.fragmentShader}`
            // building program from shaders
            let program = null;
            if (programName in this.programs) {
                program = this.programs[programName];
            } else {
                program = createProgram(gl, vertexShader, fragmentShader);
                this.programs[programName] = program;
            }

            // TODO tidy this up

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

            this.prefabs[prefab.name] = {
                renderEngine: this,
                program: program,
                vao: vao,
                vertexCount: count,
                matrixLocation: matrixLocation,

                instanceAttributes: [],

                draw: function() {
                    gl.useProgram(this.program);

                    gl.bindVertexArray(this.vao);

                    for (const attributes of this.instanceAttributes) {
                        let translation = attributes.translation;
                        let rotation = attributes.rotation;
                        let scale = attributes.scale;

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
                }
            }
        }

        // Camera setup
        this.camera = {
            position: [1000, 1000, 0],//was 1000, 1000, 0
            target: [0,0,0]
        }

        this.draw();
    }

    // sets runUpdate callback (for frame updating)
    update(callback) {
        this.runUpdate = callback;
        // console.log("update(callback)");
    }

    // callback for updating frame, animations and such
    runUpdate(time) {
        console.warn("Not Implemented"); // callback, currently set to GameController.frameUpdate()
    }

    draw = (time) => {
        time *= 0.005; // convert to seconds

        this.runUpdate(time); // updates rendering logic/contents

        let gl = this.gl;

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
        let cameraMatrix = mat4.lookAt(this.camera.position, this.camera.target, up);

        let viewMatrix = mat4.inverse(cameraMatrix);

        let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        let zNear = 1;
        let zFar = 2000;
        let fov = 0.5;
        this.viewProjectionMatrix = mat4.multiply(mat4.perspective(fov, aspect, zNear, zFar), mat4.inverse(cameraMatrix));
        Object.keys(this.prefabs).forEach((name) => { this.prefabs[name].draw(); } );

        // recursive draw callback
        requestAnimationFrame(this.draw);
    }

    instantiateRenderObject(prefab) {
        let result = {
            translation: [0, 0, 0],
            rotation: [0, degToRad(25), 0],
            scale: [100, 100, 100]
        }
        this.prefabs[prefab].instanceAttributes.push(result);
        return result;
    }
}