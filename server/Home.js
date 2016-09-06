var Util = require('./Util.js');
var Planet = require('./Planet.js');

var Home = {
  ACCELERATION: 0.05, // meters per second
  MAX_VELOCITY: 1, // meters per second

  createHome: function(planet) {
    return {
      guid: Util.createGuid(8),
      type: 'home',
      name: "Unnamed Home Base",
      size: {
        width: 4.5,
        height: 4.14705
      },
      location: {
        planetGuid: planet.guid,
        x: Math.random() * planet.size.width,
        y: Math.random() * planet.size.height
      }
    };
  }
};

module.exports = Home;