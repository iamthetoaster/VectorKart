import Car from "./Car-Just-Vectors.js";
import Vector3 from '../src/state-objects/Vector3.js'
import assert from 'node:assert/strict'


//check velocity
function checkVelocity(car, expected, turn){
    try {
        assert(car.velocity.x == expected.x);
    }
    catch (err){
        throw "Turn " + turn + ": Wrong Velocity x value";
    }
    console.log("Turn " + turn + ": Correct Velocity x value");
    
    //check velocity y value
    try {
        assert(car.velocity.y == expected.y);
    }
    catch (err){
        throw "Turn " + turn + ": Wrong Velocity y value";
    }
    console.log("Turn " + turn + ": Correct Velocity y value");
    
    //check velocity y value
    try {
        assert(car.velocity.z == expected.z);
    }
    catch (err){
        throw "Turn " + turn + ": Wrong Velocity z value";
    }
    console.log("Turn " + turn + ": Correct Velocity z value");

    console.log("");

}


//check position
function checkPosition(car, expected, turn){
    try {
        assert(car.position.x == expected.x);
    }
    catch (err){
        throw "Turn " + turn + ": Wrong Position x value";
    }
    console.log("Turn " + turn + ": Correct Position x value");
    
    //check position y value
    try {
        assert(car.position.y == expected.y);
    }
    catch (err){
        throw "Turn " + turn + ": Wrong Position y value";
    }
    console.log("Turn " + turn + ": Correct Position y value");
    
    //check position y value
    try {
        assert(car.position.z == expected.z);
    }
    catch (err){
        throw "Turn " + turn + ": Wrong Position z value";
    }
    console.log("Turn " + turn + ": Correct Position z value");

    console.log("");

}

//Test Starts
const car = new Car(new Vector3(0, 0, 0));

//Turn 1 -> get initial start
car.acceleration.setComponents(5, 0, 10);
car.step();

checkVelocity(car, new Vector3(5, 0, 10), 1);
checkPosition(car, new Vector3(5, 0, 10), 1);

//Turn 2 -> increase velcocity in both directions
car.acceleration.setComponents(10, 0, 5);
car.step();

checkVelocity(car, new Vector3(15, 0, 15), 2);
checkPosition(car, new Vector3(20, 0, 25), 2);

//Turn 3 -> decrease x to go backwards
car.acceleration.setComponents(-25, 0, 5);
car.step();

checkVelocity(car, new Vector3(-10, 0, 20), 3);
checkPosition(car, new Vector3(10, 0, 45), 3);

//Turn 4 -> decrease z to go up
car.acceleration.setComponents(5, 0, -45);
car.step();

checkVelocity(car, new Vector3(-5, 0, -25), 4);
checkPosition(car, new Vector3(5, 0, 20), 4);

//Turn 5 -> get back to start
car.acceleration.setComponents(0, 0, 5);
car.step();

checkVelocity(car, new Vector3(-5, 0, -20), 5);
checkPosition(car, new Vector3(0, 0, 0), 5);

