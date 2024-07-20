import RenderEngine from './RenderEngine.js';
import Dashboard from './Dashboard.js';
import VectorRace from '../state-objects/VectorRace.js';
import Car from '../state-objects/Car.js';
import MapObject from '../state-objects/MapObject.js';
import Vector3 from '../state-objects/Vector3.js';
import { mapCollides } from '../mapCollision.js';

export default class GameController {
  constructor() {
    this.players = 1;
    this.turn = 0;
    this.cars = [];

    this.mapWidth = 200;
    this.mapHeight = 200;

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

    this.velocityVector = this.renderEngine.instantiateRenderObject('vector');
    this.accelerationVector = this.renderEngine.instantiateRenderObject('vector');

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

    this.cars.forEach(car => car.animate(this.dt));

    const car = this.cars[0];
    if (car && car.atPos) {
      this.updateVelocityVector(car);
    }
  };

  handleCanvasClick(event) {
    // Exit if the game is over
    if (this.gameOver) return;

    // Handle clicks on the canvas to move the car
    const mouseWorldPosition = this.renderEngine.worldPosition(event.clientX, event.clientY);
    // console.log("world mouse(x, y): " + mouseWorldPosition);


    // Get the current car based on turn
    const car = this.cars[this.turn];

    if (car.atPos) {
      // Store the previous position before updating the car's current position
      const previousPosition = new Vector3(car.position.x, car.position.y, car.position.z);

      // set targetPos to the location of the user click
      const targetPos = new Vector3(mouseWorldPosition[0], mouseWorldPosition[1], mouseWorldPosition[2]);

      // apply acceleration to car
      car.acceleration = targetPos.subtract(car.position).normalize().scalar_mult(50);

      // Call step() to update velocity and position based on current acceleration
      car.step();

      this.updateVelocityVector(car);

      this.dashboard.update();

      // calculate car map positions (magic numbers)
      const carMapPosX = (car.nextPos.x + 367) / this.map.scale.x;
      const carMapPosY = (car.nextPos.z + 367) / this.map.scale.z;

      const collisionRadius = 4;

      // make sure car is in map
      if (carMapPosX >= 0 && carMapPosX < this.map.width && carMapPosY >= 0 && carMapPosY < this.map.height) {
        if (mapCollides(this.map.map, carMapPosY, carMapPosX, collisionRadius)) { // check for car-map collisions with radius
          console.log("collision");
        }
      } else {
        console.log("car out of map");
      }

      // Log the car's new position for debugging
      //console.log(`Car position: (${car.position.x}, ${car.position.y}, ${car.position.z})`);

      // Now pass previousPosition and newPos to check if the car has crossed the finish line
      //this.checkFinishLine(previousPosition, car.position);
      // if (this.checkFinishLine(previousPosition, car.nextPos)) {
      //   this.gameOver = true;
      //   document.querySelector('#winMessage').innerText = "Car correctly crossed the finish line! Game Over.";
      //   const canvas = document.querySelector('#c');
      //   canvas.removeEventListener('click', this.boundHandleCanvasClick);
      // }

      // Move to the next turn, cycling back to the first car if necessary
      this.turn = (this.turn + 1) % this.players;
    }
  }

  updateVelocityVector(car) {
    const velMag = car.velocity.getMagnitude();
    this.velocityVector.scale = [velMag, velMag, velMag];
    const pos = car.position.add(car.velocity.normalize().scalar_mult(20));
    this.velocityVector.translation = [pos.x, pos.y, pos.z];
    this.velocityVector.rotation = [0, Math.PI + Math.atan2(car.velocity.x, car.velocity.z), 0];
  }

  checkFinishLine(previousPosition, currentPosition) {
    const finishLineTiles = [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 },
      { x: 9, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 }, { x: 12, y: 0 }, { x: 13, y: 0 }, { x: 14, y: 0 }, { x: 15, y: 0 }, { x: 16, y: 0 }, { x: 17, y: 0 }, { x: 18, y: 0 },
      { x: 19, y: 0 }, { x: 20, y: 0 }, { x: 21, y: 0 }, { x: 22, y: 0 }, { x: 23, y: 0 }, { x: 24, y: 0 }, { x: 25, y: 0 }, { x: 26, y: 0 }, { x: 27, y: 0 },
    ];
    const movementVector = currentPosition.subtract(previousPosition).normalize();
    const forwardDirection = Vector3.LEFT;
    for (const tile of finishLineTiles) {
      if (this.isLineCrossFinishTile(previousPosition, currentPosition, tile.x, tile.y)) {
        const dotProduct = movementVector.dot(forwardDirection);
        if (dotProduct > 0) { // Correct direction
          return true;
        }
      }
    }
    return false;
  }

  isLineCrossFinishTile(previousPosition, currentPosition, tileX, tileY) {
    return (previousPosition.x <= tileX && currentPosition.x >= tileX) ||
      (previousPosition.x >= tileX && currentPosition.x <= tileX);
  }
}
