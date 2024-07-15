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
    this.renderEngine.init()
      .then(() => this.start());
  }

  start() {
    this.vectorRace = new VectorRace(this); // Manages the state of the game
    this.rotating = true; // Flag to control rotation state
    this.pt = 0; // Previous time stamp
    this.dt = 0; // Time difference between frames
    this.car = new Car(this.renderEngine.instantiateRenderObject('car')); // The car object with position, velocity, etc.
    this.car.scale = new Vector3(100, 100, 100);

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
  };

  handleCanvasClick(event) {
    const rect = event.target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Log the mouse position
    console.log(`Mouse clicked at (${mouseX}, ${mouseY})`);

    // Calculate the target position based on the mouse click
    const maxZ = event.target.width;
    const maxY = event.target.height;
    const targetPos = new Vector3(0, (-event.clientY) + (maxY / 2), (-event.clientX) + (maxZ / 2));

    this.car.acceleration = targetPos.subtract(this.car.position).normalize().scalar_mult(100);

    // Call step() to update velocity based on current acceleration
    this.car.step();

    // Calculate new position by adding new velocity to current position
    const newPos = this.car.position.add(this.car.velocity);

    // Update car position
    this.car.position = newPos;

    // Log the car's new position and velocity for debugging
    console.log(`Car moved to (${newPos.x}, ${newPos.y}, ${newPos.z}) with velocity (${this.car.velocity.y}, ${this.car.velocity.z})`);
  }


}
