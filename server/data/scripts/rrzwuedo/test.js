BotScripts.registerScript(function(Bot) {

  this.run = function() {
    Bot.chat('hello, world');
  }

  this.stop = function() {
    Bot.chat('goodbye, cruel world');
  }

});
