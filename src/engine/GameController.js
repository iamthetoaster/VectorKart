import RenderEngine from './RenderEngine.js';
import Dashboard from './Dashboard.js';
import VectorRace from '../state-objects/VectorRace.js';
import Car from '../state-objects/Car.js';
import MapObject from '../state-objects/MapObject.js'
import Vector3 from '../state-objects/Vector3.js';

export default class GameController {
  constructor() {
    this.players = 2;
    this.turn = 0;
    this.cars = [];

    this.mapWidth = 100;
    this.mapHeight = 100;

    // Initialize the core components of the game
    this.renderEngine = new RenderEngine(this); // Handles the rendering of objects
    this.renderEngine.update(this.frameUpdate); // Link frame updates to the rendering engine
    // this.renderEngine.update(this.checkFinishLine);
    this.renderEngine.init()
      .then(() => this.start());

    // this.finishLineCrossed = false;  // Flag to track if finish line has been crossed
  }

  start() {
    this.vectorRace = new VectorRace(this); // Manages the state of the game
    this.rotating = true; // Flag to control rotation state
    this.pt = 0; // Previous time stamp
    this.dt = 0; // Time difference between frames

    // instantiate map
    this.map = new MapObject(this.renderEngine, 'Circle', this.mapWidth, this.mapHeight);

    // instantiate car for each player
    for (let index = 0; index < this.players; index++) {
      this.cars.push(new Car(new Vector3(0, 0, (index * 50) - 315), this.renderEngine.instantiateRenderObject('car')));
    }

    // Log the initial position of the car when the game starts
    // console.log(`Initial car position: (${this.car.position.x}, ${this.car.position.y}, ${this.car.position.z})`);

    this.dashboard = new Dashboard(document.querySelector('#dashboard'), this.cars);
    this.dashboard.attach();

    // Setup to prevent adding multiple listeners to the same canvas
    const canvas = document.querySelector('#c');
    if (!Object.hasOwn(canvas.dataset, 'listenerAdded')) {
      canvas.addEventListener('click', this.handleCanvasClick.bind(this));
      canvas.dataset.listenerAdded = 'true';
    }

    // reset button callback
    const resetButton = document.querySelector('#reset-button');
    if (resetButton) {
      resetButton.addEventListener('click', this.resetGame);
    }
  }

  resetGame = () => {
    // reset position and velocity of cars
    for (let index = 0; index < this.players; index++) {
      const car = this.cars[index];
      car.reset();
    }
  };

  frameUpdate = (time) => {
    // Update the state of the game each frame

    // **saving this code for the mems :(
    // const car = this.cars[this.turn];
    // if (car && this.rotating) {
    //   const rotationAngle = degToRad(10 * time % 360);
    //   car.rotation = rotationAngle;
    // }

    // Update time variables for smooth animations
    this.dt = time - this.pt;
    this.pt = time;
    // this.checkFinishLine();
    // Debugging the car's position before checking the finish line
    // console.log('Frame Update - Car position:', this.car.position);
  };

  handleCanvasClick(event) {
    // Handle clicks on the canvas to move the car
    const mouseWorldPosition = this.renderEngine.worldPosition(event.clientX, event.clientY);

    // Get the current car based on turn
    const car = this.cars[this.turn];

    // Store the previous position before updating the car's current position
    const previousPosition = new Vector3(car.position.x, car.position.y, car.position.z);

    // set targetPos to the location of the user click
    const targetPos = new Vector3(mouseWorldPosition[0], mouseWorldPosition[1], mouseWorldPosition[2]);

    // apply acceleration to car
    car.acceleration = targetPos.subtract(car.position).normalize().scalar_mult(100);

    // Call step() to update velocity and position based on current acceleration
    car.step();
    this.dashboard.update();

    // Log the car's new position for debugging
    console.log(`Car position: (${car.position.x}, ${car.position.y}, ${car.position.z})`);

    // Now pass previousPosition and newPos to check if the car has crossed the finish line
    this.checkFinishLine(previousPosition, car.position);

    // Update turn for the next car
    this.turn = (this.turn + 1) % this.players;
  }

  checkFinishLine(previousPosition, currentPosition) {
    const finishLineTiles = [
      { x: -99, y: 0 }, { x: -98, y: 0 }, { x: -97, y: 0 }, { x: -96, y: 0 }, { x: -95, y: 0 }, { x: -94, y: 0 }, { x: -93, y: 0 },
    ];

    const movementVector = currentPosition.subtract(previousPosition).normalize();
    const forwardDirection = Vector3.RIGHT; // Defines the correct direction to cross the finish line

    let crossed = false; // flag to ensure only one crossing is logged per click event
    for (const tile of finishLineTiles) {
      if (this.isLineCrossFinishTile(previousPosition, currentPosition, tile.x)) {
        const dotProduct = movementVector.dot(forwardDirection);
        if (dotProduct > 0 && !crossed) { // Makes sure the car is moving in the right direction and hasn't been logged
          console.log('Car correctly crossed the finish line at tile');
          crossed = true; // Set flag to true after logging once
        }
      }
    }
  }

  isLineCrossFinishTile(previousPosition, currentPosition, tileX) {
    // Check if the x-coordinates of the previous and current positions straddle the tile's x-coordinate
    return (previousPosition.x <= tileX && currentPosition.x >= tileX) ||
      (previousPosition.x >= tileX && currentPosition.x <= tileX);
  }
}
