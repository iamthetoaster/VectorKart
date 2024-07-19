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
    this.renderEngine.init().then(() => this.start());

    // Bind event handlers
    this.boundHandleCanvasClick = this.handleCanvasClick.bind(this);
  }

  start() {
    this.vectorRace = new VectorRace(this); // Manages the state of the game

    // instantiate map
    this.map = new MapObject(this.renderEngine, 'Circle', this.mapWidth, this.mapHeight);

    // instantiate car for each player
    for (let index = 0; index < this.players; index++) {
      this.cars.push(new Car(new Vector3(100, 0, (index * 50) - 305), this.renderEngine.instantiateRenderObject('car')));
    }

    this.dashboard = new Dashboard(document.querySelector('#dashboard'), this.cars);
    this.dashboard.attach();

    // Setup to prevent adding multiple listeners to the same canvas
    const canvas = document.querySelector('#c');
    if (!Object.hasOwn(canvas.dataset, 'listenerAdded')) {
      canvas.addEventListener('click', this.boundHandleCanvasClick);
      canvas.dataset.listenerAdded = 'true';
    }

    // reset button callback
    const resetButton = document.querySelector('#reset-button');
    resetButton.addEventListener('click', this.resetGame);
  }

  resetGame = () => {
    this.cars.forEach(car => car.reset());
    this.gameOver = false;
    document.querySelector('#winMessage').style.display = 'none';  // Hide the win message on reset
    document.querySelector('#winMessage').innerText = '';
    const canvas = document.querySelector('#c');
    canvas.removeEventListener('click', this.boundHandleCanvasClick);
    canvas.addEventListener('click', this.boundHandleCanvasClick);
    this.turn = 0;
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
    if (!this.pt) this.pt = time;
    this.dt = time - this.pt;
    this.pt = time;
  };

  handleCanvasClick(event) {
    // Exit if the game is over
    if (this.gameOver) return;

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
    if (this.checkFinishLine(previousPosition, car.position)) {
      this.gameOver = true;
      const winMessage = document.querySelector('#winMessage');
      winMessage.innerText = "Car correctly crossed the finish line! Game Over.";
      winMessage.style.display = 'block';  // Show the message when the finish line is crossed
      const canvas = document.querySelector('#c');
      canvas.removeEventListener('click', this.boundHandleCanvasClick);
    }

    // Move to the next turn, cycling back to the first car if necessary
    this.turn = (this.turn + 1) % this.players;
  }

  checkFinishLine(previousPosition, currentPosition) {
    const finishLineTiles = [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 },
      { x: 9, y: 0}, { x: 10, y: 0}, { x: 11, y: 0}, { x: 12, y: 0}, { x: 13, y: 0}, { x: 14, y: 0}, { x: 15, y: 0}, { x: 16, y: 0}, { x: 17, y: 0}, { x: 18, y: 0},
    ];
    const movementVector = currentPosition.subtract(previousPosition).normalize();
    const forwardDirection = Vector3.LEFT;
    for (const tile of finishLineTiles) {
      if (this.isLineCrossFinishTile(previousPosition, currentPosition, tile.x)) {
        const dotProduct = movementVector.dot(forwardDirection);
        if (dotProduct > 0) { // Correct direction
          return true;
        }
      }
    }
    return false;
  }

  isLineCrossFinishTile(previousPosition, currentPosition, tileX) {
    return (previousPosition.x <= tileX && currentPosition.x >= tileX) ||
           (previousPosition.x >= tileX && currentPosition.x <= tileX);
  }
}
