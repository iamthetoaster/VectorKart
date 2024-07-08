import { render } from "./render.js"

"use strict";


let canvas = document.querySelector("#c");
render.setup(canvas);

let button = document.querySelector("#testButton");
button.addEventListener("click", () => {
    // render.models.car1.transform.rotation[0] = performance.now() / 100;
})
