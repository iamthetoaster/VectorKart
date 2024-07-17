import RenderEngine from './RenderEngine.js';
import Dashboard from './Dashboard.js';
import VectorRace from '../state-objects/VectorRace.js';
import { degToRad } from '../math_utils.js';
import Car from '../state-objects/Car.js';
import Vector3 from '../state-objects/Vector3.js';

export default class GameController {
  constructor() {
    // Initialize the core components of the game
    this.renderEngine = new RenderEngine(this); // Handles the rendering of objects
    this.renderEngine.update(this.frameUpdate); // Link frame updates to the rendering engine
    //this.renderEngine.update(this.checkFinishLine);
    this.renderEngine.init()
      .then(() => this.start());
  }

  start() {
    this.vectorRace = new VectorRace(this); // Manages the state of the game
    this.rotating = true; // Flag to control rotation state
    this.pt = 0; // Previous time stamp
    this.dt = 0; // Time difference between frames
    this.renderEngine.addPrefab('map', [[0, 1], [1, 0]], 'shaders/vertex_shader.glsl', 'shaders/fragment_shader.glsl');
    const map = this.renderEngine.instantiateRenderObject('map');
    map.scale = [100, 100, 100];//was 100, 100, 100
    this.car = new Car(this.renderEngine.instantiateRenderObject('car')); // The car object with position, velocity, etc.
    this.car.scale = new Vector3(50, 50, 50);

    // Set initial position of the car to (-200, 0, 0)
    this.car.position = new Vector3(-200, 0, 0);

    // Log the initial position of the car when the game starts
    console.log(`Initial car position: (${this.car.position.x}, ${this.car.position.y}, ${this.car.position.z})`);

    this.dashboard = new Dashboard(document.querySelector('#dashboard'),
      [this.car]);

    // Setup to prevent adding multiple listeners to the same canvas
    const canvas = document.querySelector('#c');
    if (!Object.hasOwn(canvas.dataset, 'listenerAdded')) {
      canvas.addEventListener('click', this.handleCanvasClick.bind(this));
      canvas.dataset.listenerAdded = 'true';
    }

    this.dashboard.attach();

    // Add a mouse movement listener to the document body or map container
    //document.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  frameUpdate = (time) => {
    // Update the state of the game each frame
    if (this.car && this.rotating) {
      const rotationAngle = degToRad(10 * time % 360);
      this.car.rotation = rotationAngle;
    }
    // Update time variables for smooth animations
    this.dt = time - this.pt;
    this.pt = time;
    //this.checkFinishLine();
    // Debugging the car's position before checking the finish line
    //console.log('Frame Update - Car position:', this.car.position);
  };

  handleCanvasClick(event) {
    // Handle clicks on the canvas to move the car

    // console.log(`Canvas X: ${event.clientX} Canvas Y: ${event.clientY}`);
    const gameWorldPosition = this.renderEngine.worldPosition(event.clientX, event.clientY);
    // console.log(`Game X: ${gameWorldPosition[0]} Game Y: ${gameWorldPosition[1]} Game Z: ${gameWorldPosition[2]} `);

    // const newPos = new Vector3(0, (Math.random() * maxY) - (maxY / 2), (Math.random() * maxZ) - (maxZ / 2));
    const targetPos = new Vector3(gameWorldPosition[0], gameWorldPosition[1], gameWorldPosition[2]);
    // const rect = event.target.getBoundingClientRect();

    this.car.acceleration = targetPos.subtract(this.car.position).normalize().scalar_mult(100);

    // Call step() to update velocity based on current acceleration
    this.car.step();

    // Calculate new position by adding new velocity to current position
    const newPos = this.car.position.add(this.car.velocity);

    // Update car position
    this.car.position = newPos;

    // Log the car's new position and velocity for debugging
    console.log(`Car moved to (${newPos.x}, ${newPos.y}, ${newPos.z}) with velocity (${this.car.velocity.y}, ${this.car.velocity.z})`);

    // Check if the car has crossed the finish line
    this.checkFinishLine();
  }

  // handleMouseMove(event) {
  //   // Transform the mouse coordinates to game world coordinates
  //   const gameWorldPosition = this.renderEngine.worldPosition(event.clientX, event.clientY);
  
  //   // Assuming finish line tiles are at specific game world coordinates
  //   // Example finish line coordinates (x, y), adjust according to your game setup
  //   const finishLineTiles = [
  //     { x: 0, y: 0 }, // example coordinates of finish line tile
  //     { x: 1, y: 0 },
  //     { x: 2, y: 0 },
  //     { x: 3, y: 0 },
  //     { x: 4, y: 0 },
  //     { x: 5, y: 0 },
  //     { x: -5, y: 0 },
  //     { x: -4, y: 0 },
  //     { x: -3, y: 0 },
  //     { x: -2, y: 0 },
  //     { x: -1, y: 0 }
  //   ];
  
  //   // Check if the mouse is over any of the finish line tiles
  //   finishLineTiles.forEach(tile => {
  //     if (Math.floor(gameWorldPosition[0]) === tile.x && Math.floor(gameWorldPosition[1]) === tile.y) {
  //       console.log('Mouse crossed the finish line at tile ' + JSON.stringify(tile));
  //     }
  //   });
  // }

  checkFinishLine() {
    //console.log('Checking finish line...');
    //console.log('Car position:', this.car.position); // Check car's position
    const finishLineTiles = [
      { x: 0, y: 0 }, // example coordinates of finish line tile
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: -5, y: 0 },
      { x: -4, y: 0 },
      { x: -3, y: 0 },
      { x: -2, y: 0 },
      { x: -1, y: 0 }
    ];

    finishLineTiles.forEach(tile => {
      if (Math.floor(this.car.position.x) === tile.x && Math.floor(this.car.position.y) === tile.y) {
        console.log('Car crossed the finish line at tile ' + JSON.stringify(tile));
      }
    });
  }
  
}
