var Util = require('./Util.js');

var Bot = {
  animateFrame: function(bot, elapsedTime) {
    // console.log('animateFrame for bot:', bot.guid);
    var BotClass = Util.getBotClassByBotType(bot.type);
    if (BotClass.animateFrame) {
      BotClass.animateFrame(bot, elapsedTime);
    }
  },

  accelerateBot: function(bot, direction) {
    var BotClass = Util.getBotClassByBotType(bot.type);
    if (BotClass.ACCELERATION) {
      bot.acceleration = direction == 'f' ? BotClass.ACCELERATION : -BotClass.ACCELERATION;
    }

    // var angle = direction == 'f' ? bot.heading : bot.heading - Math.PI;
    // var vector = Util.getMovementVector(angle);
    // var BotClass = Util.getBotClassByBotType(bot.type);
    // if (BotClass.ACCELERATION) {
    //   bot.acceleration = {
    //     x: vector.x * BotClass.ACCELERATION,
    //     y: vector.y * BotClass.ACCELERATION
    //   };
    // }
  },

  decelerateBot: function(bot) {
    var BotClass = Util.getBotClassByBotType(bot.type);
    if (BotClass.ACCELERATION) {
      bot.acceleration = 0;
      // bot.acceleration = {
      //   x: 0,
      //   y: 0
      // };
    }
  },

  findBotByGuid: function(bots, guid) {
    for (var i=0; i < bots.length; i++) {
      if (bots[i].guid == guid) {
        return bots[i];
      }
    }
    return null;
  },

  findBotsInBounds: function(bots, bounds) {
    var botsInBounds = [];
    for (var i=0; i < bots.length; i++) {
      if (bots[i].location.x + bots[i].size.width / 2 >= bounds.left
        && bots[i].location.x - bots[i].size.width / 2 <= bounds.right
        && bots[i].location.y + bots[i].size.height / 2 >= bounds.bottom
        && bots[i].location.y - bots[i].size.height / 2 <= bounds.top) {
        botsInBounds.push(bots[i]);
      }
    }
    return botsInBounds;
  },

  rotateBot: function(bot, direction) {
    var BotClass = Util.getBotClassByBotType(bot.type);
    if (!BotClass.ROTATION_SPEED) {
      return;
    }
    var rotation = BotClass.ROTATION_SPEED;
    if (direction == 'cc') {
      rotation = -rotation;
    }
    bot.rotation = rotation;
  },

  stopRotatingBot: function(bot) {
    bot.rotation = 0;
  }
};

module.exports = Bot;