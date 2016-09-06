var validChars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'];

var Util = {
  createGuid: function(length) {
    var guid = '';
    for (var i=0; i<length; i++) {
      var randIndex = Math.floor(Math.random() * validChars.length);
      guid += validChars[randIndex];
    }
    return guid;
  },

  getBotClassByBotType: function(botType) {
    var BotClass = null;
    switch(botType) {
      case 'home':
        BotClass = require('./Home.js');
        break;
      case 'rover':
        BotClass = require('./Rover.js');
        break;
    }
    return BotClass;
  },

   getMovementVector: function(angle) {
    while (angle >= Math.PI * 2) {
      angle -= Math.PI * 2;
    }
    while (angle < 0) {
      angle += Math.PI * 2;
    }
    var v = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
    if (angle >= 0 && angle < Math.PI/2) {
      v.x = Math.abs(v.x);
      v.y = Math.abs(v.y);
    }
    else if (angle >= Math.PI/2 && angle < Math.PI) {
      v.x = -Math.abs(v.x);
      v.y = Math.abs(v.y);
    }
    else if (angle >= Math.PI && angle < 3*Math.PI/2) {
      v.x = -Math.abs(v.x);
      v.y = -Math.abs(v.y);
    }
    else {
      v.x = Math.abs(v.x);
      v.y = -Math.abs(v.y);
    }
    return v;
  }

};

module.exports = Util;