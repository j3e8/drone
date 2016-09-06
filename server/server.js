var Player = require('./Player.js');
var Planet = require('./Planet.js');
var Bot = require('./Bot.js');
var Terrain = require('./Terrain.js');

const PORT = 3000;
var io = require('socket.io').listen(PORT);
var fs = require('fs');

var Game = require('./Game.js');
Game.start(updateViewports);

var connections = [];
io.on('connection', function(socket) {
  console.log('a user connected');
  var connection = {
    socket: socket
  };
  connections.push(connection);
  console.log(connections.length + " user(s) connected");

  socket.on('disconnect', function() {
    console.log('user disconnected');
    disconnectUser(socket);
    console.log(connections.length + " user(s) connected");
  });

  socket.on('createuser', function(msg) {
    console.log('creating user ', msg.username);
    Player.doesPlayerExist(msg.username)
    .then((playerGuid) => {
      if (!playerGuid) {
        var player = Game.createPlayer(msg.username, msg.password);
        connection.player = player;
        socket.emit('createduser', {
          user: connection.player,
          planet: Game.findPlanetByGuid(player.home.location.planetGuid)
        });
      }
      else {
        console.log('user exists');
        socket.emit('userexists');
      }
    });
  });

  socket.on('acceleratebot', function(direction) {
    if (connection.viewport && connection.viewport.bot) {
      var bot = Game.findBotByGuid(connection.viewport.bot.guid);
      if (bot) {
        console.log('acceleratebot');
        Bot.accelerateBot(bot, direction);
      }
    }
  });

  socket.on('rotatebot', function(direction) {
    if (connection.viewport && connection.viewport.bot) {
      var bot = Game.findBotByGuid(connection.viewport.bot.guid);
      if (bot) {
        console.log("rotateBot", direction);
        Bot.rotateBot(bot, direction);
      }
    }
  });

  socket.on('stoprotatingbot', function(direction) {
    if (connection.viewport && connection.viewport.bot) {
      var bot = Game.findBotByGuid(connection.viewport.bot.guid);
      if (bot) {
        console.log("stoprotatingbot", direction);
        Bot.stopRotatingBot(bot);
      }
    }
  });

  socket.on('deceleratebot', function() {
    if (connection.viewport && connection.viewport.bot) {
      var bot = Game.findBotByGuid(connection.viewport.bot.guid);
      if (bot) {
        Bot.decelerateBot(bot);
      }
    }
  });

  socket.on('authenticate', function(msg) {
    console.log('authenticate user', msg);
    Player.authenticatePlayer(msg.username, msg.password, msg.guid)
    .then(function(playerGuid) {
      var player = Game.findPlayerByGuid(playerGuid);
      connection.player = player;
      socket.emit('authenticated', {
        user: connection.player,
        planet: Game.findPlanetByGuid(player.home.location.planetGuid)
      });
    });
  });

  socket.on('locatebot', function(guid) {
    var bot = Game.findBotByGuid(guid);
    if (bot) {
      socket.emit('locatedbot', bot.location);
    }
  });

  socket.on('updateviewport', function(viewport) {
    console.log('client updated viewport');
    connection.viewport = {
      bot: Game.findBotByGuid(viewport.bot.guid),
      size: viewport.size
    };
  });

  socket.on('loadmybots', function() {
    socket.emit('loadmybots', connection.player.bots);
  });

  socket.on('startscript', function(msg) {
    var player = Game.getBotOwner(msg.botGuid);
    if (player.guid == connection.player.guid) {
      Game.startScript(player.guid, msg.botGuid, msg.scriptFilename);
      socket.emit('scriptstarted', msg);
    }
  });
});

function disconnectUser(socket) {
  var connection = null;
  for (var i=0; i<connections.length; i++) {
    if (connections[i].socket == socket) {
      connections.splice(i, 1);
      break;
    }
  }
}

function updateViewports() {
  for (var i=0; i<connections.length; i++) {
    if (connections[i].viewport && connections[i].viewport.bot) {
      var center = {
        x: connections[i].viewport.bot.location.x,
        y: connections[i].viewport.bot.location.y
      };
      var bounds = {
        left: center.x - connections[i].viewport.size.width / 2,
        right: center.x + connections[i].viewport.size.width / 2,
        bottom: center.y - connections[i].viewport.size.height / 2,
        top: center.y + connections[i].viewport.size.height / 2
      };
      connections[i].socket.emit('updateviewport', {
        center: center,
        bots: Game.getBotsInBounds(bounds), // TODO somehow we need to know the planet guid here
        terrain: Game.getTerrainInBounds(bounds) // TODO somehow we need to know the planet guid here
      });
    }
  }
}
