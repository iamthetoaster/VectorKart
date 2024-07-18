const LAP_TOTAL = 3;

class Dashboard {
  constructor(parentNode, cars) {
    this.parent = parentNode;
    this.cars = cars;
    this.carDashes = [];

    for (let index = 0; index < cars.length; index++) {
      const carDash = Dashboard.makeElement('div', 'car-dash',
        `player-${index + 1}-dashboard`);
      const title = Dashboard.addField(carDash, 'car-dash-title', 'span');
      title.textContent = `Player ${index + 1}`;
      Dashboard.addField(carDash, 'lap');
      Dashboard.addField(carDash, 'speed');
      Dashboard.addField(carDash, 'angle');
      Dashboard.addField(carDash, 'max-speed');

      this.carDashes.push(carDash);
    }
  }

  attach() {
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

      const lap = car.lap || 1;
      const speed = car.getSpeed().toFixed(2);
      const angle = car.getRotationDeg().toFixed(0);
      const maxSpeed = car.maxSpeed.toFixed(2);

      dash.lap.textContent = `Lap ${lap}/${LAP_TOTAL}`;
      dash.speed.textContent = `Speed: ${speed} m/s`;
      dash.angle.textContent = `Angle: ${angle} deg`;
      dash.maxSpeed.textContent = `Max Speed: ${maxSpeed} m/s`;
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

  static addField(dash, className, id, overrideType = 'p') {
    const field = Dashboard.makeElement(overrideType, className, id);
    dash.append(field);

    return field;
  }
}

export default Dashboard;
