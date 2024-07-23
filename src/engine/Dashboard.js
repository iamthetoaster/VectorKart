const MAX_OFFTRACKS = 3;

class Dashboard {
  constructor(parentNode, cars) {
    this.parent = parentNode;
    this.cars = cars;
    this.carDashes = [];

    for (let index = 0; index < cars.length; index++) {
      const carDash = Dashboard.makeElement('div', 'car-dash', `player-${index + 1}-dash`);

      const warning = Dashboard.addField(carDash, 'warning hidden');
      warning.textContent = 'Off-track!';

      const title = Dashboard.makeElement('h2', 'car-dash-title');
      title.textContent = `Player ${index + 1}`;
      carDash.append(title);

      Dashboard.addField(carDash, 'speed', `speed-${index + 1}`);
      Dashboard.addField(carDash, 'angle', `angle-${index + 1}`);
      Dashboard.addField(carDash, 'max-speed', `max-speed-${index + 1}`);
      Dashboard.addField(carDash, 'offtracks', `offtrack-${index + 1}`);

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
        title: carDash.querySelector('.car-dash-title'),
        warning: carDash.querySelector('.warning'),
        speed: carDash.querySelector('.speed'),
        angle: carDash.querySelector('.angle'),
        maxSpeed: carDash.querySelector('.max-speed'),
        offtracks: carDash.querySelector('.offtracks'),
      };

      dash.title.classList.remove('warning');
      dash.speed.textContent = `Speed: ${car.getSpeed().toFixed(2)} m/s`;
      dash.angle.textContent = `Angle: ${car.getRotationDeg().toFixed(0)} deg`;
      dash.maxSpeed.textContent = `Max Speed: ${car.maxSpeed.toFixed(2)} m/s`;
      dash.offtracks.classList.remove('warning');
      dash.offtracks.textContent = `Off-tracks: ${car.collisionCount}/${MAX_OFFTRACKS}`;
    }
  }

  warnOffTrack(carIndex) {
    const carDash = this.carDashes[carIndex];
    const title = carDash.querySelector('.car-dash-title');
    const offtracks = carDash.querySelector('.offtracks');

    title.classList.add('warning');
    offtracks.classList.add('warning');
  };

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
    field.className = className; // Ensure the class is correctly set
    dash.append(field);

    return field;
  }
}

export default Dashboard;
