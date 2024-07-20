import GameObject3D from './GameObject3D.js';
import { Map } from '../map.js'
import Vector3 from './Vector3.js';

export default class MapObject extends GameObject3D {
  constructor(renderEngine, name, width, height, newMap=null) {
    const map = new Map(width, height);
    switch (name) {
      case 'Circle': // more magic numbers around here
        map.Circle(45, 95, width / 2, height / 2);
        break;

      case 'Diamond':
        map.Diamond(25, 40, width / 2, height / 2);
        break;

      case 'Bean':
        map.Bean(25, 40, width / 2, height / 2);
        break;

      case 'test':
        map.map = newMap;
        break;
    }

    // instantiate prefab
    const prefab = name + '-map';
    const vertexShader = 'shaders/vertex_shader.glsl';
    const fragShader = 'shaders/fragment_shader.glsl';
    renderEngine.addPrefab(prefab, map.map, vertexShader, fragShader);
    const renderObject = renderEngine.instantiateRenderObject(prefab); // create renderObject

    super(renderObject);

    this.map = map.map;
    this.width = width;
    this.height = height;

    // magic numbers
    this.scale = new Vector3(3.75, 3.75, 3.75);
    this.rotation = 0;
    this.position = new Vector3((-this.width * this.scale.x) / 2, 0, (-this.height * this.scale.z) / 2);
  }
}
