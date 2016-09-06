var fs = require('fs');
var Bot = require('./Bot.js');
var Planet = require('./Planet.js');
var Player = require('./Player.js');
var Worker = require('webworker-threads').Worker;

var FRAME_DURATION = 60;
var animationCallback = null;
var writeToFileInterval;


var players = [];
var planets = [];
var workers = [];


var Game = {};

Game.start = function(callback) {
  animationCallback = callback;
  setTimeout(animateFrame, FRAME_DURATION);

  console.log("reading players from file");
  fs.readFile('data/players.json', (err, data) => {
    if (data) {
      players = JSON.parse(data);
    }
    console.log("read " + players.length + " players from file");
  });

  console.log("reading planets from file");
  fs.readFile('data/planets.json', (err, data) => {
    if (data) {
      planets = JSON.parse(data);
    }
    console.log("read " + planets.length + " planets from file");
    if (!planets.length) {
      planets.push(Planet.createPlanet());
    }
  });

  writeToFileInterval = setInterval(saveServerState, 20000);
}

Game.botBelongsToPlayer = function(botGuid, playerGuid) {
  var player = players.find((player) => player.guid == playerGuid);
  if (player) {
    var bot = player.bots.find((bot) => bot.guid == botGuid);
    if (bot) {
      return true;
    }
  }
  return false;
}

Game.createPlayer = function(username, password) {
  var newPlanet = Planet.choosePlanet(planets);
  var player = Player.createPlayer(username, password, newPlanet);
  players.push(player);
  console.log('player created', player);
  return player;
}

Game.findBotByGuid = function(guid) {
  for (var i=0; i < players.length; i++) {
    var bot = Bot.findBotByGuid(players[i].bots, guid);
    if (bot) {
      return bot;
    }
  }
  return null;
}

Game.findPlanetByGuid = function(guid) {
  return planets.find((planet) => planet.guid == guid);
}

Game.findPlayerByGuid = function(playerGuid) {
  var player = players.find(function(pl) {
    return pl.guid == playerGuid;
  });
  return player;
}

Game.getBotOwner = function(botGuid) {
  for (var i=0; i < players.length; i++) {
    var bot = players[i].bots.find((bot) => bot.guid == botGuid);
    if (bot) {
      return players[i];
    }
  }
  return null;
}

Game.getBotsInBounds = function(bounds) {
  // TODO: we're going to need then planetGuid here in addition to the bounds
  var bots = [];
  for (var i=0; i < players.length; i++) {
    var playerBots = Bot.findBotsInBounds(players[i].bots, bounds);
    if (playerBots && playerBots.length) {
      bots = bots.concat(playerBots);
    }
  }
  return bots;
}

Game.getTerrainInBounds = function(bounds) {
  // TODO: This clearly needs a planetGuid in the params in order to work
  var terrainInView = [];
  return terrainInView;
}

Game.startScript = function(playerGuid, botGuid, scriptFilename) {
  var worker = workers.find((worker) => worker.playerGuid == playerGuid);
  if (!worker) {
    worker = {
      playerGuid: playerGuid,
      worker: new Worker('./workers/BotLogicWorker.js')
    };
    workers.push(worker);
  }

  worker.postMessage('startscript', scriptFilename);
}




function saveServerState() {
  fs.writeFile('data/players.json', JSON.stringify(players), function() {});
  fs.writeFile('data/planets.json', JSON.stringify(planets), function() {});
}

var lastFrame = new Date().getTime();
function animateFrame() {
  var thisFrame = new Date().getTime();
  var elapsedTime = (thisFrame - lastFrame) / 1000; // in seconds

  players.forEach(function(player) {
    Player.animateFrame(player, elapsedTime);
  });

  if (animationCallback) {
    animationCallback();
  }
  
  lastFrame = thisFrame;
  setTimeout(animateFrame, FRAME_DURATION);
}

module.exports = Game;





/*
var Drone = require('./Drone.js');

var FRAME_DURATION = 60;

function Game() {
  var RUNNING = 1;
  var PAUSED = 2;
  var READY = 0;
  var LOADING = -1;

  var animationCallback = null;
  var gameStatus = LOADING;
  var drones = [];
  
  this.addDrone = function(name, droneDefinition) {
    var drone = new Drone(droneDefinition, generateStartLocation());
    drones.push(drone);
  }
  
  this.countDrones = function() {
    return drones.length;
  }
  
  this.start = function(callback) {
    gameStatus = RUNNING;
    animationCallback = callback;
  }
  
  function generateStartLocation() {
    var location;
    do {
      location = {
        x: Math.random() * 600,
        y: Math.random() * 300
      };
    } while (distanceToClosestDrone(location) < 50);
    return location;
  }

  function distanceToClosestDrone(location) {
    var minSqDist = undefined;
    drones.forEach(function(drone) {
      var droneLocation = drone.getLocation();
      var sqDist = (droneLocation.x - location.x)*(droneLocation.x - location.x) + (droneLocation.y - location.y)*(droneLocation.y - location.y);
      if (minSqDist === undefined || sqDist < minSqDist) {
        minSqDist = sqDist;
      }
    });
    return Math.sqrt(minSqDist);
  }

  // var cyclesPerSecond = 10;
  // function performCycle() {
  //   drones.forEach(function(drone) {
  //     drone.animateFrame();
  //   });
  // }
  
  var lastFrame = new Date().getTime();
  // var lastCycle = new Date().getTime();
  function animateFrame() {
    var thisFrame = new Date().getTime();

    drones.forEach(function(drone) {
      drone.animateFrame();
    });

    // if (gameStatus == RUNNING && thisFrame - lastCycle >= 1000 / cyclesPerSecond) {
      // performCycle();
      // lastCycle = thisFrame;
    // }
    
    if (animationCallback) {
      animationCallback();
    }
    
    lastFrame = thisFrame;
    setTimeout(animateFrame, FRAME_DURATION);
  }
  
  setTimeout(animateFrame, FRAME_DURATION);
};
*/
