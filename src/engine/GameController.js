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
    
    this.finishLineCrossed = false;  // Flag to track if finish line has been crossed
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

    // Set initial position of the car to (-500, 0, 0)
    this.car.position = new Vector3(-500, 0, 0);

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

    // Store the previous position before updating the car's current position
    const previousPosition = new Vector3(this.car.position.x, this.car.position.y, this.car.position.z);

    this.car.acceleration = targetPos.subtract(this.car.position).normalize().scalar_mult(100);

    // Call step() to update velocity based on current acceleration
    this.car.step();

    // Calculate new position by adding new velocity to current position
    const newPos = this.car.position.add(this.car.velocity);

    // Update car position
    this.car.position = newPos;

    // Log the car's new position and velocity for debugging
    console.log(`Car moved to (${newPos.x}, ${newPos.y}, ${newPos.z}) with velocity (${this.car.velocity.y}, ${this.car.velocity.z})`);


    // Now pass previousPosition and newPos to check if the car has crossed the finish line
    this.checkFinishLine(previousPosition, newPos);
  }

  checkFinishLine(previousPosition, currentPosition) {
    const finishLineTiles = [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: -5, y: 0 }, { x: -4, y: 0 }, { x: -3, y: 0 }, { x: -2, y: 0 }, { x: -1, y: 0 }
    ];

    const movementVector = currentPosition.subtract(previousPosition).normalize();
    const forwardDirection = Vector3.RIGHT; // This defines the correct direction to cross the finish line

    finishLineTiles.forEach(tile => {
      if (this.isLineCrossFinishTile(previousPosition, currentPosition, tile.x)) {
          const dotProduct = movementVector.dot(forwardDirection);
          if (dotProduct > 0) { // Makes sure the car is moving in the right direction
              console.log('Car correctly crossed the finish line at tile');
          }
      }
    });
  }

  isLineCrossFinishTile(previousPosition, currentPosition, tileX) {
    // Check if the x-coordinates of the previous and current positions straddle the tile's x-coordinate
    return (previousPosition.x <= tileX && currentPosition.x >= tileX) ||
           (previousPosition.x >= tileX && currentPosition.x <= tileX);
  }


}
