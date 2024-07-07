export class Car {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.position = { x: 0, y: 0 };
    }

    render() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }
}