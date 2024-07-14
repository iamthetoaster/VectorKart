class Dashboard {
  constructor(parentNode, cars) {
    this.parent = parentNode;
    this.cars = cars;
    this.carDashes = [];

    for (let index = 0; index < cars.length; index++) {
      const carDash = Dashboard.makeElement('div', 'car-dash',
        `player-${index + 1}-dashboard`);
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
      const statistics = {
        speed: this.carDashes[index].querySelector('.speed'),
        angle: this.carDashes[index].querySelector('.angle'),
        maxSpeed: this.carDashes[index].querySelector('.max-speed'),
      };

      statistics.speed.textContent = `Speed: ${this.cars[index].getSpeed()} m/s`;
      statistics.angle.textContent = `Angle: ${this.cars[index].rotation} deg`;
      statistics.maxSpeed.textContent = `Max Speed: ${this.cars[index].maxSpeed} m/s`;
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
