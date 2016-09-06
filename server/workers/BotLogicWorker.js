self.importScripts('../data/scripts/Bot.js');

self.addEventListener('message', function(e) {
  switch (e.data.messageType) {
    case 'runscript':
      ƒn__runScriptOnBot(e.data.playerGuid, e.data.scriptFilename, e.data.botGuid);
      break;
    case 'stopscript':
      ƒn__stopScriptOnBot(e.data.botGuid);
      break;
    default:
      ƒn__sayHello();
      break;
  }
});

function ƒn__sayHello() {
  self.postMessage({
    messageType: 'chat',
    message: 'hello, everybot'
  });
}

var $__scripts = [];
function ƒn__runScriptOnBot(playerGuid, scriptFilename, newBotGuid) {
  var newLogic = ƒn__loadScriptFromFile(playerGuid, scriptFilename);

  var script = $__scripts.find((script) => script.botGuid == botGuid);
  if (script) {
    script.logic = newLogic;
  }
  else {
    script = {
      logic: newLogic,
      botGuid: newBotGuid
    };
    $__scripts.push(script);
  }
  ƒn__runLogicOnBot(script.logic, script.botGuid);
}

var $__parsedScripts = [];
var BotScripts = {
  registerScript: function(klass) {
    $__parsedScripts.push(new klass($$__Bot));
  }
}

function ƒn__loadScriptFromFile(playerGuid, scriptFilename) {
  console.log("ƒn__loadScriptFromFile");
  var folder = `../data/scripts/${playerGuid}`;
  var filename = `${folder}/${scriptFilename}`;
  console.log("importing script: " + filename);
  try {
    self.importScripts(filename);
  }
  catch (e) {
    console.log("ERROR IMPORTING SCRIPT!!!!");
  }
  console.log("script imported.");
  var logic = $__parsedScripts[$__parsedScripts.length - 1];
  console.log(logic);
  $__parsedScripts.pop();
  return logic;
}

function ƒn__stopScriptOnBot(botGuid) {
  var script = scripts.find((script) => script.botGuid == botGuid);
  if (script.logic && script.logic.stop) {
    script.logic.stop();
  }
  if (script) {
    $__scripts.splice($__scripts.indexOf(script), 1);
  }
}

function ƒn__runLogicOnBot(logic, botGuid) {
  console.log("ƒn__runLogicOnBot()");
  if (logic.run) {
    console.log("calling logic.run()");
    try {
      logic.run();
    }
    catch (e) {
      console.log("ERROR DURING RUN()");
      self.postMessage({
        messageType: 'error',
        message: "There was an error running your Bot script: " + e.message,
        botGuid: botGuid
      });
    }
  }
}
