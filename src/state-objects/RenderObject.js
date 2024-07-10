import { render } from "../render.js"

export default class RenderObject {
    constructor(modelName) {
        this.model = render.models[modelName];

        this.setPosition(0, 0, 0);
        this.setRotation(0, 0, 0);
        this.setScale(20, 20, 20);
    }

    setPosition(x, y, z) {
        this._position = { x, y, z };
        if(this.model)
            this.model.transform.translation = [x, y, z];
    }

    getPosition() {
        return this._position;
    }

    setRotation(x, y, z) {
        this._rotation = { x, y, z };
        if(this.model)
            this.model.transform.rotation = [x, y, z];
    }

    getRotation() {
        return this._rotation;
    }

    setScale(x, y, z) {
        this._scale = { x, y, z };
        if(this.model)
            this.model.transform.scale = [x, y, z];
    }

    getScale() {
        return this._scale;
    }

    printState() {
        console.log(`Position: (${this.position.x}, ${this.position.y}, ${this.position.z})`);
        console.log(`Velocity: (${this.velocity.x}, ${this.velocity.y}, ${this.velocity.z})`);
        console.log(`Rotation: (${this.rotation.x}, ${this.rotation.y}, ${this.rotation.z})`);
        console.log(`Scale: (${this.scale.x}, ${this.scale.y}, ${this.scale.z})`);
    }
}