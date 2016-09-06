var Terrain = require('./Terrain');
var Util = require('./Util');
var Planet = {};

Planet.createPlanet = function() {
  var size = {
    width: 1000,
    height: 1000
  };
  return {
    guid: Util.createGuid(8),
    color: {
      r: 82,
      g: 204,
      b: 169
    },
    size: size,
    terrain: Terrain.generateTerrain(size)
  };
}

Planet.choosePlanet = function(planets) {
  return planets[Math.floor(planets.length * Math.random())];
}

module.exports = Planet;