import RenderEngine from './RenderEngine.js';
import Dashboard from './Dashboard.js';
import VectorRace from '../state-objects/VectorRace.js';
import { degToRad } from '../math_utils.js';
import Car from '../state-objects/Car.js';
import Vector3 from '../state-objects/Vector3.js';

export default class GameController {
  constructor() {
    this.players = 2;
    this.turn = 0;
    this.cars = [];

    // Initialize the core components of the game
    this.renderEngine = new RenderEngine(this); // Handles the rendering of objects
    this.renderEngine.update(this.frameUpdate); // Link frame updates to the rendering engine
    this.renderEngine.init()
      .then(() => this.start());
  }

  start() {
    this.vectorRace = new VectorRace(this); // Manages the state of the game
    this.rotating = true; // Flag to control rotation state
    this.pt = 0; // Previous time stamp
    this.dt = 0; // Time difference between frames

    // instantiate car for each player
    for (let i = 0; i < this.players; i++) {
      this.cars.push(new Car(this.renderEngine.instantiateRenderObject('car')));
    }

    // Log the initial position of the car when the game starts
    // console.log(`Initial car position: (${this.car.position.x}, ${this.car.position.y}, ${this.car.position.z})`);

    this.dashboard = new Dashboard(document.querySelector('#dashboard'),
      [this.cars[0]]);

    // Setup to prevent adding multiple listeners to the same canvas
    const canvas = document.querySelector('#c');
    if (!Object.hasOwn(canvas.dataset, 'listenerAdded')) {
      canvas.addEventListener('click', this.handleCanvasClick.bind(this));
      canvas.dataset.listenerAdded = 'true';
    }

    this.dashboard.attach();
  }

  frameUpdate = (time) => {
    // Update the state of the game each frame

    let car = this.cars[this.turn];
    if (car && this.rotating) {
      const rotationAngle = degToRad(10 * time % 360);
      car.rotation = rotationAngle;
    }
    // Update time variables for smooth animations
    this.dt = time - this.pt;
    this.pt = time;
  };

  handleCanvasClick(event) {
    // Handle clicks on the canvas to move the car

    // console.log(`Canvas X: ${event.clientX} Canvas Y: ${event.clientY}`);
    const gameWorldPosition = this.renderEngine.worldPosition(event.clientX, event.clientY);
    // console.log(`Game X: ${gameWorldPosition[0]} Game Y: ${gameWorldPosition[1]} Game Z: ${gameWorldPosition[2]} `);

    // const newPos = new Vector3(0, (Math.random() * maxY) - (maxY / 2), (Math.random() * maxZ) - (maxZ / 2));
    const targetPos = new Vector3(gameWorldPosition[0], gameWorldPosition[1], gameWorldPosition[2]);
    // const rect = event.target.getBoundingClientRect();

    // apply acceleration to car
    let car = this.cars[this.turn];
    car.acceleration = targetPos.subtract(car.position).normalize().scalar_mult(100);

    // Call move() to update velocity and position based on current acceleration
    car.move();

    this.turn = this.turn + 1;
    if (this.turn >= this.cars.length) {
      this.turn = 0;
    }

    // Log the car's new position and velocity for debugging
    // console.log(`Car moved to (${newPos.x}, ${newPos.y}, ${newPos.z}) with velocity (${this.car.velocity.y}, ${this.car.velocity.z})`);
  }
}
