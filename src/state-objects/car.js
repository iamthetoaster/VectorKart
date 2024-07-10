import { render } from "../render.js";
import RenderObject from "./RenderObject.js";
import { degToRad } from "../math_utils.js";

export default class Car extends RenderObject {
    constructor() {
        super("car");

        this.setVelocity(0, 0, 0);
        this.setAcceleration(0, 0, 0);
    }

    setVelocity(vx, vy, vz) {
        this.velocity = { x: vx, y: vy, z: vz };
    }

    setAcceleration(x, y, z) {
        this.acceleration = { x: x, y: y, z: z };
    }
}