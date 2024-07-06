// Define the car object with properties and methods
const car = {
    element: document.getElementById('car'),
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    damping: 0.85, // Damping factor to stabilize velocity

    // Method to update the car's position
    updatePosition: function() {
        // Apply velocity to position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Apply damping to velocity
        this.velocity.x *= this.damping;
        this.velocity.y *= this.damping;

        // Stop the car if it's moving very slowly
        if (Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }

        this.render();
    },

    // Method to set the velocity based on the target click
    setVelocity: function(targetX, targetY) {
        // Calculate the difference between target and current position
        const dx = targetX - this.position.x;
        const dy = targetY - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 5; // Constant speed scale

        // Set velocity based on direction to target and constant speed
        this.velocity.x = (dx / distance) * speed;
        this.velocity.y = (dy / distance) * speed;
    },

    // Method to update the car's rendering on the page
    render: function() {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
    }
};

// Add an event listener for mouse clicks
document.addEventListener('click', function(event) {
    const mouseX = event.clientX - car.element.offsetWidth / 2;
    const mouseY = event.clientY - car.element.offsetHeight / 2;

    car.setVelocity(mouseX, mouseY);

    // Start or continue the movement
    if (!car.movementActive) {
        car.movementActive = true;
        moveContinuously();
    }
});

// Function to move the car continuously
function moveContinuously() {
    car.updatePosition();

    // Continue animating while the car has non-zero velocity
    if (car.velocity.x !== 0 || car.velocity.y !== 0) {
        requestAnimationFrame(moveContinuously);
    } else {
        car.movementActive = false; // Stop the animation loop when the car stops
    }
}