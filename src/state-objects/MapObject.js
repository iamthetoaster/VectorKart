import GameObject3D from './GameObject3D.js';
import { Map } from '../map.js'
import Vector3 from './Vector3.js';

export default class MapObject extends GameObject3D {
    constructor(renderEngine, name, width, height) {
        const map = new Map(width, height);
        switch (name) {
            case 'Circle':
                map.Circle(25, 40, width / 2, height / 2);
                break;

            
        }
        
        const prefab = name + '-map';
        const vertexShader = 'shaders/vertex_shader.glsl';
        const fragShader = 'shaders/fragment_shader.glsl';
        renderEngine.addPrefab(prefab, map.map, vertexShader, fragShader);
        const renderObject = renderEngine.instantiateRenderObject(prefab)

        super(renderObject);

        this.map = map.map;
        this.width = width;
        this.height = height;
        this.mapArray = this.map.map;

        this.scale = new Vector3(10, 10, 10);
        this.rotation = 0;
        this.position = new Vector3(0, 0, 0);
    }


}
