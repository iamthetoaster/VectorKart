export default class GameObject3D {
  constructor(renderObject) {
    this.renderObject = renderObject;

    this.position = { x: 0, y: 0, z: 0 };
    this.rotation = { x: 0, y: 0, z: 0 };
    this.scale = { x: 1, y: 1, z: 1 };
  }

  setPosition(x, y, z) {
    this.position = { x, y, z };
    this.renderObject.translation = [this.position.x, this.position.y, this.position.z];
  }

  setRotation(x, y, z) {
    this.rotation = { x, y, z };
    this.renderObject.rotation = [this.rotation.x, this.rotation.y, this.rotation.z];
  }

  setScale(x, y, z) {
    this.scale = { x, y, z };
    this.renderObject.scale = [this.scale.x, this.scale.y, this.scale.z];
  }
}