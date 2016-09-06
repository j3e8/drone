app.component("botScripts", {
  bindings: {
    bots: '=',
    selectedBot: '=',
    onBotSwitch: '='
  },
  templateUrl: 'components/bot-scripts/bot-scripts.html',
  controller: function($scope, $element, $attrs) {
    this.scriptsAreDisplayed = undefined;
    this.toggleScriptsDisplay = function() {
      this.scriptsAreDisplayed = this.scriptsAreDisplayed ? false : true;
    }

    this.selectedTab = 'bots';
    this.selectTab = function(newTab) {
      this.selectedTab = newTab;
    }

    this.findBotOnMap = function(bot) {
      if (this.onBotSwitch) {
        this.onBotSwitch(bot);
      }
    }

    this.getDisplayType = function(botType) {
      switch (botType) {
        case 'home':
          return 'Home base';
        case 'drone':
          return 'Drone';
        case 'rover':
        default:
          return 'Rover';
      }
    }

    this.toggleStartScriptDialog = function(bot) {
      bot.startScriptDialogIsDisplayed = bot.startScriptDialogIsDisplayed ? false : true;
    }
  }
});