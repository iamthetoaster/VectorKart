import RenderEngine from './RenderEngine.js';
import Dashboard from './Dashboard.js';
import VectorRace from '../state-objects/VectorRace.js';
import Car from '../state-objects/Car.js';
import Arrow from '../state-objects/Arrow.js';
import MapObject from '../state-objects/MapObject.js';
import Vector3 from '../state-objects/Vector3.js';
import { mapCollides } from '../mapCollision.js';

export default class GameController {
  constructor() {
    this.players = 2;
    this.turn = 0;
    this.cars = [];

    this.mapWidth = 200;
    this.mapHeight = 200;
    this.finishLineCrossed = [false, false]; // Track initial crossing for both players
    this.raceStarted = false; // To check if both players have crossed the finish line initially
    
    // Dynamic boundaries for the finish line
    this.dynamicMinX = 100; // Initial minX value before the race starts
    this.dynamicMaxX = 120; // Initial maxX value before the race starts

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

    this.velocityArrow = new Arrow(this.renderEngine.instantiateRenderObject('arrow'));

    this.newVelocityArrow = new Arrow(this.renderEngine.instantiateRenderObject('arrow'));

    this.accelerationArrow = new Arrow(this.renderEngine.instantiateRenderObject('arrow'));

    this.dashboard = new Dashboard(document.querySelector('#dashboard'), this.cars);
    this.dashboard.attach();

    // Setup to prevent adding multiple listeners to the same canvas
    const canvas = document.querySelector('#c');
    if (!Object.hasOwn(canvas.dataset, 'listenerAdded')) {
      canvas.addEventListener('mousemove', (event) => {
        this.mousePos = new Vector3(...this.renderEngine.worldPosition(event.offsetX, event.offsetY));
      });
      canvas.addEventListener('click', this.boundHandleCanvasClick);
      canvas.dataset.listenerAdded = 'true';
    }

    // reset button callback
    const resetButton = document.querySelector('#reset-button');
    resetButton.addEventListener('click', this.resetGame);
  }

  resetGame = () => {
    for (const car of this.cars) {
      car.reset();
    }
    this.cars.forEach(car => {
      car.lap = 0;  // Reset laps
      car.maxSpeed = 0;  // Reset max speed
      car.collisionCount = 0;  // Ensure this property exists and reset collision count
    });
    this.cars.forEach(car => car.reset());
    this.finishLineCrossed = [false, false];
    this.raceStarted = false;
    this.gameOver = false;

    document.querySelector('#winMessage').style.display = 'none'; // Hide the win message on reset
    document.querySelector('#winMessage').textContent = '';

    const canvas = document.querySelector('#c');
    canvas.removeEventListener('click', this.boundHandleCanvasClick);
    canvas.addEventListener('click', this.boundHandleCanvasClick);
    this.turn = 0;

    this.dashboard.update();  // Call update to refresh the dashboard display
  };

  frameUpdate = (time) => {
    if (!this.pt) this.pt = time;
    this.dt = time - this.pt;
    this.pt = time;

    for (const car of this.cars) {
      car.animate(this.dt);
    }

    if (this.cars.length > 0) {
      const currentCar = this.cars[this.turn];
      this.velocityArrow.from = new Vector3(currentCar.position.x, 100, currentCar.position.z);
      const end = currentCar.position.add(currentCar.velocity);
      this.velocityArrow.to = new Vector3(end.x, 100, end.z);

      if (this.mousePos) {
        this.accelerationArrow.from = new Vector3(end.x, 100, end.z);
        const target = new Vector3(this.mousePos.x, 100, this.mousePos.z);
        const delta = target.subtract(this.accelerationArrow.from);
        const length = Math.min(delta.getMagnitude(), 100);
        const result = this.accelerationArrow.from.add(delta.normalize().scalar_mult(length));
        this.accelerationArrow.to = result;

        this.newVelocityArrow.from = this.velocityArrow.from;
        this.newVelocityArrow.to = this.accelerationArrow.to;
      }
    }
  };

  handleCanvasClick(event) {
    if (this.gameOver) return;

    // Handle clicks on the canvas to move the car
    const mouseWorldPosition = this.renderEngine.worldPosition(event.offsetX, event.offsetY);

    // Get the current car based on turn
    const car = this.cars[this.turn];

    if (car.atPos) {
        // Store the previous position before updating the car's current position
        const previousPosition = car.position.add(car.velocity);

        // set targetPos to the location of the user click
        const targetPos = new Vector3(mouseWorldPosition[0], mouseWorldPosition[1], mouseWorldPosition[2]);

        // Log the car's current position.
        console.log(`Car position: X=${car.position.x}, Y=${car.position.y}, Z=${car.position.z}`);

        // apply acceleration to car
        const attemptedAcceleration = targetPos.subtract(previousPosition).getMagnitude();
        car.acceleration = targetPos.subtract(previousPosition).normalize().scalar_mult(Math.min(attemptedAcceleration, 100));

        // Call step() to update velocity and position based on current acceleration
        car.step();
        this.dashboard.update();

        // calculate car map positions (magic numbers)
        const carMapPosX = (car.nextPos.x + 367) / this.map.scale.x;
        const carMapPosY = (car.nextPos.z + 367) / this.map.scale.z;

        const collisionRadius = 4;

        // Check if the car is within the map bounds and for collisions
        if (carMapPosX >= 0 && carMapPosX < this.map.width && carMapPosY >= 0 && carMapPosY < this.map.height) {
          if (mapCollides(this.map.map, carMapPosY, carMapPosX, 4)) {
              car.incrementCollision();
              //console.log(`Collision detected for player ${this.turn + 1}. Total: ${car.collisionCount}`);
              car.stop(); // Use the stop method to halt the car immediately
              this.dashboard.update();  // Update the dashboard to reflect changes
              if (car.collisionCount >= 3) {
                this.gameOver = true;
                const winningPlayerIndex = (this.turn + 1) % this.players;  // This is currently giving you the next player, not the other player
                const losingPlayerIndex = this.turn + 1;  // Adjust to correctly reference losing player
                
                // Correct calculation for the other player (if two players, the other index is simply 1 - this.turn)
                const correctWinningPlayerIndex = 1 - this.turn;  // Adjusts for a two-player game to find the other player
            
                const winMessage = document.querySelector('#winMessage');
                winMessage.innerText = `Player ${losingPlayerIndex} loses the game due to too many collisions. Player ${correctWinningPlayerIndex + 1} wins!`;
                winMessage.style.display = 'block';
                return;  // Stop further processing
              }                        
          }
        } else {
          car.incrementCollision();
          car.stop(); // Use the stop method to halt the car immediately
          this.dashboard.update();  // Update the dashboard to reflect changes
          console.log('Car is out of map bounds.');
          if (car.collisionCount >= 3) {
            this.gameOver = true;
            const winningPlayerIndex = (this.turn + 1) % this.players;  // This is currently giving you the next player, not the other player
            const losingPlayerIndex = this.turn + 1;  // Adjust to correctly reference losing player
            
            // Correct calculation for the other player (if two players, the other index is simply 1 - this.turn)
            const correctWinningPlayerIndex = 1 - this.turn;  // Adjusts for a two-player game to find the other player
        
            const winMessage = document.querySelector('#winMessage');
            winMessage.innerText = `Player ${losingPlayerIndex} loses the game due to too many collisions. Player ${correctWinningPlayerIndex + 1} wins!`;
            winMessage.style.display = 'block';
            return;  // Stop further processing
          }          
        }
        if (this.isInFinishLine(car.position)) {
            console.log(`Player ${this.turn + 1} in finish line bounds.`);
            if (!this.finishLineCrossed[this.turn]) {
                this.finishLineCrossed[this.turn] = true;
                //console.log(`Player ${this.turn + 1} crossed the finish line initially.`);
                if (this.finishLineCrossed.every(Boolean)) {
                    this.raceStarted = true;
                    this.dynamicMinX = 70; // Change minX for the active race phase
                    this.dynamicMaxX = 200; // Change maxX to a new limit for the race phase
                    console.log("Race has officially started!");
                }
            } else if (this.raceStarted) {
                this.gameOver = true;
                const winnerIndex = this.turn; // The current player wins because they crossed the finish line during the race.
                const loserIndex = 1 - this.turn; // Calculate the other player's index for a two-player game.
                const winMessage = document.querySelector('#winMessage');
                winMessage.innerText = `Player ${winnerIndex + 1} has won the race! Player ${loserIndex + 1} loses.`;
                winMessage.style.display = 'block';
                const canvas = document.querySelector('#c');
                canvas.removeEventListener('click', this.boundHandleCanvasClick);
            }
        }
        this.turn = (this.turn + 1) % this.players;
    }
  }

  isInFinishLine(pos, nextPos) {
    pos = pos.add(new Vector3(367, 0, 367));
    nextPos = nextPos.add(new Vector3(367, 0, 367));

    if (pos.x > 375 && nextPos.x <= 375) {
      if (nextPos.z > 20 && nextPos.z < 197) {
        return true;
      }
    }

    return false;
  }
}
