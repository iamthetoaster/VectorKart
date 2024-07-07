import { render } from "./render.js"

"use strict";


let canvas = document.querySelector("#c");
render.setup(canvas);

let button = document.querySelector("#testButton");
button.addEventListener("click", () => {
    render.models.car.transform.rotation[2] = performance.now() / 1000;
})
