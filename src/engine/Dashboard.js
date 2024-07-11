class Dashboard {
    constructor(parentNode, cars) {
        this.parent = parentNode;
        this.cars = cars;
        this.carDashes = [];

        const makeElement = function(type, className=null, id=null) {
            const element = document.createElement(type);
            if (className) {
                element.className = className;
            }
            if (id) {
                element.id = id;
            }

            return element;
        }

        const makeField = function(dash, className=null, id=null) {
            const field = makeElement("p", className, id);
            dash.appendChild(field);

            return field;
        }

        for (let i = 0; i < cars.length; i++) {
            const carDash = makeElement("div", "car-dash",
                `player-${i + 1}-dashboard`);
            makeField(carDash, "speed");
            makeField(carDash, "angle");
            makeField(carDash, "max-speed");

            this.carDashes.push(carDash);
        }

    }

    attach() {
        for (let carDash of this.carDashes) {
            this.parent.appendChild(carDash);
        }
        this.update();
    }

    update() {
        for (let i = 0; i < this.carDashes.length; i++) {
            const statistics = {
                speed: this.carDashes[i].querySelector(".speed"),
                angle: this.carDashes[i].querySelector(".angle"),
                maxSpeed: this.carDashes[i].querySelector(".max-speed"),
            }

            statistics.speed.textContent = `Speed: ${this.cars[i].getSpeed()} m/s`;
            statistics.angle.textContent = `Angle: ${this.cars[i].getAngle()} deg`;
            statistics.maxSpeed.textContent = `Max Speed: ${this.cars[i].maxSpeed} m/s`;
        }
    }
}

export default Dashboard;