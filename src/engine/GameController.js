import RenderEngine from './RenderEngine.js';
import Dashboard from './Dashboard.js';
import VectorRace from '../state-objects/VectorRace.js';
import Car from '../state-objects/Car.js';
import MapObject from '../state-objects/MapObject.js';
import Vector3 from '../state-objects/Vector3.js';

export default class GameController {
  constructor() {
    this.players = 2;
    this.turn = 0;
    this.cars = [];
    this.mapWidth = 100;
    this.mapHeight = 100;
    this.finishLineCrossed = [false, false]; // Track initial crossing for both players
    this.raceStarted = false; // To check if both players have crossed the finish line initially

    this.renderEngine = new RenderEngine(this);
    this.renderEngine.update(this.frameUpdate);
    this.renderEngine.init().then(() => this.start());

    this.boundHandleCanvasClick = this.handleCanvasClick.bind(this);
  }

  start() {
    this.vectorRace = new VectorRace(this);

    this.map = new MapObject(this.renderEngine, 'Circle', this.mapWidth, this.mapHeight);
    for (let index = 0; index < this.players; index++) {
      this.cars.push(new Car(new Vector3(100, 0, (index * 50) - 305), this.renderEngine.instantiateRenderObject('car')));
    }

    this.dashboard = new Dashboard(document.querySelector('#dashboard'), this.cars);
    this.dashboard.attach();

    const canvas = document.querySelector('#c');
    if (!Object.hasOwn(canvas.dataset, 'listenerAdded')) {
      canvas.addEventListener('click', this.boundHandleCanvasClick);
      canvas.dataset.listenerAdded = 'true';
    }

    const resetButton = document.querySelector('#reset-button');
    resetButton.addEventListener('click', this.resetGame);
  }

  resetGame = () => {
    this.cars.forEach(car => car.reset());
    this.finishLineCrossed = [false, false];
    this.raceStarted = false;
    this.gameOver = false;
    document.querySelector('#winMessage').style.display = 'none';
    document.querySelector('#winMessage').innerText = '';
    const canvas = document.querySelector('#c');
    canvas.removeEventListener('click', this.boundHandleCanvasClick);
    canvas.addEventListener('click', this.boundHandleCanvasClick);
    this.turn = 0;
  };

  frameUpdate = (time) => {
    if (!this.pt) this.pt = time;
    this.dt = time - this.pt;
    this.pt = time;
  };

  handleCanvasClick(event) {
    if (this.gameOver) return;

    const mouseWorldPosition = this.renderEngine.worldPosition(event.clientX, event.clientY);
    const car = this.cars[this.turn];
    //const targetPos = new Vector3(mouseWorldPosition[0], mouseWorldPosition[1], mouseWorldPosition[2]); 

    car.position = new Vector3(mouseWorldPosition[0], mouseWorldPosition[1], mouseWorldPosition[2]);

    //car.acceleration = targetPos.subtract(car.position).normalize().scalar_mult(100);
    //car.step();

    this.dashboard.update();

    // Log the player's new position for debugging
    console.log(`Turn: Player ${this.turn + 1}, Position: (${car.position.x}, ${car.position.y}, ${car.position.z})`);

    if (this.isInFinishLine(car.position)) {
      console.log(`Player ${this.turn + 1} in finish line bounds.`);
      if (!this.finishLineCrossed[this.turn]) {
        this.finishLineCrossed[this.turn] = true;
        //console.log(`Player ${this.turn + 1} crossed the finish line initially.`);
        if (this.finishLineCrossed.every(Boolean)) {
          this.raceStarted = true;
          console.log("Race has officially started!");
        }
      } else if (this.raceStarted) {
        this.gameOver = true;
        const winMessage = document.querySelector('#winMessage');
        winMessage.innerText = `Player ${this.turn + 1} has won the race!`;
        winMessage.style.display = 'block';
        //console.log(`Player ${this.turn + 1} has won the race! Game Over.`);
        const canvas = document.querySelector('#c');
        canvas.removeEventListener('click', this.boundHandleCanvasClick);
      }
    }

    this.turn = (this.turn + 1) % this.players;
  }

  isInFinishLine(position) {
    const inXBounds = position.x >= -150 && position.x <= 45;
    const inZBounds = position.z >= -370 && position.z <= -210;
    console.log(`Checking finish line: Position X=${position.x}, Z=${position.z}`);
    console.log(`In X bounds: ${inXBounds}, In Z bounds: ${inZBounds}`);

    return inXBounds && inZBounds;
  }

}
