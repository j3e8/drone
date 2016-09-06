var $$__Bot = {};

$$__Bot.broadcastMessage = function(msg) {
  self.postMessage({
    messageType: 'broadcast',
    message: msg
  });
}

$$__Bot.chat = function(msg) {
  self.postMessage({
    messageType: 'chat',
    message: msg
  });
}
