var Util = require('./Util.js');
var Rover = require('./Rover.js');
var Home = require('./Home.js');
var Bot = require('./Bot.js');
var db = require('./lib/MySQLDatabase.js');

var Player = {
  animateFrame: function(player, elapsedTime) {
    // console.log('animateFrame: ', player.username);
    player.bots.forEach(function(bot) {
      Bot.animateFrame(bot, elapsedTime);
    });
  },

  authenticatePlayer: function(username, password, guid) {
    return new Promise(function(resolve, reject) {
      var sql = '';
      if (guid) {
        sql = `SELECT guid FROM users
          WHERE username='${username}'
          AND guid='${guid}'`;
      }
      else {
        sql = `SELECT guid FROM users
          WHERE username='${username}'
          AND password=MD5('${password}')`;
      }
      db.query(sql
      , function(err, rows) {
        if (err) {
          reject();
          return;
        }
        if (rows && rows.length) {
          resolve(rows[0].guid);
        }
        else {
          reject();
        }
      });
    });
  },

  doesPlayerExist: function(username) {
    return new Promise(function(resolve, reject) {
      var sql = `SELECT guid FROM users WHERE username='${username}'`;
      db.query(sql
      , function(err, rows) {
        if (err) {
          reject();
          return;
        }
        if (!rows || !rows.length) {
          resolve(false);
        }
        else {
          resolve(rows[0].guid);
        }
      });
    });
  },

  createPlayer: function(username, password, planet) {
    var playerGuid = Util.createGuid(8);
    Player.savePlayer(playerGuid, username, password);
    var home = Home.createHome(planet);
    var firstRover = Rover.createRover();
    firstRover.location = {
      planetGuid: home.location.planetGuid,
      x: home.location.x - 3,
      y: home.location.y - 1.68
    };
    firstRover.heading = Math.PI * 1.16666;
    return {
      guid: playerGuid,
      home: home,
      bots: [
        home,
        firstRover
      ],
      username: username
    };
  },

  savePlayer: function(guid, username, password) {
    return new Promise(function(resolve, reject) {
      db.query(`
        INSERT INTO users
        (guid, username, password)
        values('${guid}', '${username}', MD5('${password}'))`
      , function(err, result) {
        if (err) {
          reject();
          return;
        }
        resolve(result.insertId);
      });
    });
  }
}
module.exports = Player;