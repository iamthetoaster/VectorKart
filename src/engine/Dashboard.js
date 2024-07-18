const LAP_TOTAL = 3;

class Dashboard {
  constructor(parentNode, cars) {
    this.parent = parentNode;
    this.cars = cars;
    this.carDashes = [];
    this.winner = 0;

    this.announcer = Dashboard.makeElement('h1', undefined, 'announcer');
    this.announcer.textContent = 'Ready, Set, GO!!!';

    for (let index = 0; index < cars.length; index++) {
      const carDash = Dashboard.makeElement('div', 'car-dash',
        `player-${index + 1}-dash`);

      const title = Dashboard.makeElement('h2', 'car-dash-title');
      title.textContent = `Player ${index + 1}`;
      carDash.append(title);

      Dashboard.addField(carDash, 'lap');
      Dashboard.addField(carDash, 'speed');
      Dashboard.addField(carDash, 'angle');
      Dashboard.addField(carDash, 'max-speed');

      this.carDashes.push(carDash);
    }
  }

  attach() {
    this.parent.append(this.announcer);
    for (const carDash of this.carDashes) {
      this.parent.append(carDash);
    }
    this.update();
  }

  update() {
    for (let index = 0; index < this.carDashes.length; index++) {
      const carDash = this.carDashes[index];
      const car = this.cars[index];

      const dash = {
        lap: carDash.querySelector('.lap'),
        speed: carDash.querySelector('.speed'),
        angle: carDash.querySelector('.angle'),
        maxSpeed: carDash.querySelector('.max-speed'),
      };

      dash.lap.textContent = `Lap ${car.lap || 1}/${LAP_TOTAL}`;
      dash.speed.textContent = `Speed: ${car.getSpeed().toFixed(2)} m/s`;
      dash.angle.textContent = `Angle: ${car.getRotationDeg().toFixed(0)} deg`;
      dash.maxSpeed.textContent = `Max Speed: ${car.maxSpeed.toFixed(2)} m/s`;
    }

    if (this.winner > 0) {
      this.announcer.textContent = `Player ${this.winner} wins!`;
    }
  }

  static makeElement(type, className, id) {
    const element = document.createElement(type);
    if (className) {
      element.className = className;
    }
    if (id) {
      element.id = id;
    }

    return element;
  }

  static addField(dash, className, id) {
    const field = Dashboard.makeElement('p', className, id);
    dash.append(field);

    return field;
  }
}

export default Dashboard;
