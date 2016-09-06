var Util = require('./Util.js');

function applyAcceleration(bot, elapsedTime) {
  if (!bot.acceleration) {
    return;
  }

  if (Math.abs(bot.velocity) > Rover.MAX_VELOCITY) {
    return;
  }

  var newVelocity = bot.velocity + bot.acceleration * elapsedTime;
  if (Math.abs(newVelocity) > Rover.MAX_VELOCITY) {
    var sign = newVelocity < 0 ? -1 : 1;
    newVelocity = Rover.MAX_VELOCITY * sign;
  }
  bot.velocity = newVelocity;
}

function applyFriction(bot, elapsedTime) {
  if (bot.velocity == 0) {
    return;
  }

  if (Math.abs(bot.velocity) < Rover.FRICTION * elapsedTime) {
    bot.velocity = 0;
    return;
  }

  if (bot.velocity > 0) {
    bot.velocity -= Rover.FRICTION * elapsedTime;
  }
  else {
    bot.velocity += Rover.FRICTION * elapsedTime;
  }
}

function applyRotation(bot, elapsedTime) {
  var newHeading = bot.heading + bot.rotation * elapsedTime;
  if (newHeading >= Math.PI * 2) {
    newHeading -= Math.PI * 2;
  }
  else if (newHeading < 0) {
    newHeading += Math.PI * 2;
  }
  bot.heading = newHeading;
}

function applyVelocity(bot, elapsedTime) {
  var heading = bot.velocity > 0 ? bot.heading : bot.heading - Math.PI;
  var vector = Util.getMovementVector(heading);

  var newLocation = {
    x: bot.location.x + vector.x * Math.abs(bot.velocity) * elapsedTime,
    y: bot.location.y + vector.y * Math.abs(bot.velocity) * elapsedTime
  };
  bot.location = newLocation;
}

var Rover = {
  ACCELERATION: 8.0, // meters per second
  FRICTION: 1.5, // meters per second
  MAX_VELOCITY: 6.0, // meters per second
  ROTATION_SPEED: 1.5, // radians per second

  animateFrame: function(bot, elapsedTime) {
    applyAcceleration(bot, elapsedTime);
    applyFriction(bot, elapsedTime);
    applyRotation(bot, elapsedTime);
    applyVelocity(bot, elapsedTime);
  },

  createRover: function() {
    return {
      acceleration: 0,
      guid: Util.createGuid(8),
      heading: 0,
      name: "Unnamed Rover",
      rotation: 0,
      size: {
        width: 1.111,
        height: 1
      },
      type: 'rover',
      velocity: 0
    };
  }

};

module.exports = Rover;
