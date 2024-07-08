class Car {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.position = { x: 0, y: 0 };
    }

    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.render();
    }

    render() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }
}