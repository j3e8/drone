var Util = require('./Util.js');

var Drone = {
  createDrone: function() {
    return {
      guid: Util.createGuid(8),
      name: "Unnamed Drone",
      size: {
        width: 1.5,
        height: 1.5
      },
      type: 'drone'
    };
  },


};

module.exports = Drone;


/*
function Drone(droneDefinition, startLocation) {
  var location = startLocation;

  var drone = {
    rotation: 0,
    rotationCallback: null,
    rotationQueue: [],
    movementCallback: null,
    movementQueue: []
  };

  var logic = droneDefinition;

  var droneSize = {
    width: 28.38,
    height: 25.08
  };

  var MAX_TANK_ROTATE_SPEED = 0.05; // radians per cycle
  var MAX_TANK_SPEED = 0.4; // px per cycle
  var MAX_TANK_REVERSE_SPEED = 0.3; // px per cycle

  var loadedImages = [];
  var isLoaded = false;
  function handleLoadedImage() {
    loadedImages.push(this);
    if (loadedImages.length == 1) {
      isLoaded = true;
    }
  }

  var droneImage = new Image();
  droneImage.onload = handleLoadedImage;
  droneImage.src = "drone.png";

  this.animateFrame = function() {
    if (drone.movementQueue && drone.movementQueue.length) {
      moveDrone(drone.movementQueue[0]);
      drone.movementQueue.splice(0, 1);
      if (!drone.movementQueue.length) {
        logic.isMoving = false;
        if (drone.movementCallback) {
          drone.movementCallback();
        }
      }
    }
    if (drone.rotationQueue && drone.rotationQueue.length) {
      rotateDrone(drone.rotationQueue[0]);
      drone.rotationQueue.splice(0, 1);
      if (!drone.rotationQueue.length) {
        logic.isRotating = false;
        if (drone.rotationCallback) {
          drone.rotationCallback();
        }
      }
    }
  }

  this.getLocation = function() {
    return {
      x: location.x,
      y: location.y
    };
  }

  this.executeLogic = function(method) {
    if (logic && logic[method]) {
      logic[method]();
    }
  }

  this.setGameData = function(gameData) {
    if (logic) {
      logic.Game = gameData;
    }
  }

  function moveDrone(distance) {
    var angleDroneIsFacing = drone.rotation - Math.PI / 2;
    var dx = Math.cos(angleDroneIsFacing) * distance;
    var dy = Math.sin(angleDroneIsFacing) * distance;

    location = {
      x: location.x + dx,
      y: location.y + dy
    };
  }

  function rotateDrone(angle) {
    drone.rotation += angle;
    if (drone.rotation >= Math.PI * 2) {
      drone.rotation -= Math.PI * 2;
    }
    else if (drone.rotation <= -Math.PI * 2) {
      drone.rotation += Math.PI * 2;
    }
  }





  var drone = this;

  logic.isRotating = false;
  logic.isMoving = false;

  logic.getMaxDroneRotateSpeed = function() { return MAX_TANK_ROTATE_SPEED; }
  logic.getMaxDroneSpeed = function() { return MAX_TANK_SPEED; }

  logic.rotate = function(angle, callback) {
    logic.isRotating = true;
    drone.rotationCallback = callback;
    drone.rotationQueue = [];

    while (angle > MAX_TANK_ROTATE_SPEED) {
      drone.rotationQueue.push(MAX_TANK_ROTATE_SPEED);
      angle -= MAX_TANK_ROTATE_SPEED;
    }
    while (angle < -MAX_TANK_ROTATE_SPEED) {
      drone.rotationQueue.push(-MAX_TANK_ROTATE_SPEED);
      angle += MAX_TANK_ROTATE_SPEED;
    }
    drone.rotationQueue.push(angle);
  }

  logic.move = function(distance, callback) {
    logic.isMoving = true;
    drone.movementCallback = callback;
    drone.movementQueue = [];

    while (distance > MAX_TANK_SPEED) {
      drone.movementQueue.push(MAX_TANK_SPEED);
      distance -= MAX_TANK_SPEED;
    }
    while (distance < -MAX_TANK_REVERSE_SPEED) {
      drone.movementQueue.push(-MAX_TANK_REVERSE_SPEED);
      distance += MAX_TANK_REVERSE_SPEED;
    }
    drone.movementQueue.push(distance);
  }

}

module.exports = Drone;*/