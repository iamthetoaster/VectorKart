import { resizeCanvasToDisplaySize, parseObjText, createShader, createProgram } from "./webgl_utils.js"
import VectorRace from "./state-objects/VectorRace.js"
import { mat4, radToDeg, degToRad } from "./math_utils.js"
import { render } from "./render.js"

"use strict";


let canvas = document.querySelector("#c");
render.setup(canvas).then(() => {
    fetch("/resources/models/race.obj")
        .then((response) => response.text())
        .then((text) => parseObjText(text))
        .then((obj) => {
            render.makeModel("car", obj, program);
        });
    
    // transform data for model
    render.models.car.transform.translation = [0, 0, 0];//update the velocity and position here
    render.models.car.transform.rotation = [0, degToRad(25), 0];// was 0, degToRad(25), 0
    render.models.car.transform.scale = [100, 100, 100];
    //render.models.car.velocity?
});
canvas.addEventListener("click", () => {
    // render.models.car.transform.rotation[1] = performance.now() / 1000;
});
