app.controller("MapPage", ["$scope", function($scope) {
  $scope.signInIsDisplayed = false;
  $scope.signUpIsDisplayed = true;
  $scope.outputIsDisplayed = undefined;
  $scope.username = null;

  $scope.user = {};
  var socket = io.connect('http://localhost:3000');

  var mapContainer = document.getElementById('map');
  var map = new Map(mapContainer);

  if (localStorage.username && localStorage.guid) {
    socket.emit('authenticate', {
      username: localStorage.username,
      guid: localStorage.guid
    });
  }

  var keysDown = [];
  window.addEventListener("keydown", function(event) {
    if (keysDown.indexOf(event.keyCode) < 0) {
      keysDown.push(event.keyCode);
      handleKeyDown(event.keyCode);
    }
  });

  mapContainer.addEventListener("click", function(event) {
    var clickedBot = map.getClickedBot(event.clientX, event.clientY);
    if (clickedBot) {
      $scope.selectBot(clickedBot);
    }
  });

  function handleKeyDown(keyCode) {
    // console.log("keydown", keyCode);
    var bot = map.getSelectedBot();
    switch(keyCode) {
      case 37: // left
        socket.emit('rotatebot', 'cc');
        break;
      case 38: // up
        socket.emit('acceleratebot', 'f');
        break;
      case 39: // right
        socket.emit('rotatebot', 'c');
        break;
      case 40: // down
        socket.emit('acceleratebot', 'r');
        break;
    }
  };

  window.addEventListener("keyup", function(event) {
    var idx = keysDown.indexOf(event.keyCode);
    if (idx >= 0) {
      keysDown.splice(idx, 1);
      handleKeyUp(event.keyCode);
    }
  });

  function handleKeyUp(keyCode) {
    // console.log("keyup", keyCode);
    var bot = map.getSelectedBot();
    switch(keyCode) {
      case 37: // left
        socket.emit('stoprotatingbot', 'cc');
        break;
      case 38: // up
        socket.emit('deceleratebot');
        break;
      case 39: // right
        socket.emit('stoprotatingbot', 'c');
        break;
      case 40: // down
        socket.emit('deceleratebot');
        break;
    }
  };

  $scope.getSelectedBot = function() {
    return map.getSelectedBot();
  }

  $scope.toggleOutputDisplay = function() {
    $scope.outputIsDisplayed = $scope.outputIsDisplayed ? false : true;
  }

  $scope.showSignIn = function() {
    $scope.signInIsDisplayed = true;
    $scope.signUpIsDisplayed = false;
  }

  $scope.showSignUp = function() {
    $scope.signInIsDisplayed = false;
    $scope.signUpIsDisplayed = true;
  }

  $scope.signUp = function() {
    socket.emit('createuser', {
      username: $scope.username,
      password: $scope.password
    });
  }

  socket.on("createduser", function(msg) {
    $scope.user = msg.user;
    $scope.planet = msg.planet;
    rememberUsername($scope.user.username, $scope.user.guid);
    $scope.signInIsDisplayed = false;
    $scope.signUpIsDisplayed = false;
    map.initializeMap($scope.user.home, $scope.planet);
    map.updateBotsInView($scope.user.bots);
    var firstRover = findBotTypeInBots('rover', $scope.user.bots);
    $scope.selectBot(firstRover);
    $scope.$apply();
  });

  function rememberUsername(username, guid) {
    localStorage.setItem('username', username);
    localStorage.setItem('guid', guid);
  }

  function findBotTypeInBots(botType, bots) {
    for (var i=0; i < bots.length; i++) {
      if (bots[i].type == botType) {
        return bots[i];
      }
    }
    return null;
  }

  $scope.selectBot = function(bot) {
    map.selectBot(bot);
    socket.emit("updateviewport", {
      bot: bot,
      size: map.getWorldSize()
    });
  }

  socket.on("updateviewport", function(msg) {
    // console.log('updateviewport', msg);
    map.updateCenter(msg.center);
    map.updateBotsInView(msg.bots);
    updateOutput(msg);
  });

  function updateOutput(content) {
    var formattedContent = JSON.stringify(content, null, "\t");
    document.getElementById('output').innerHTML = formattedContent;
  }

  $scope.signIn = function() {
    socket.emit('authenticate', {
      username: $scope.username,
      password: $scope.password
    });
  }

  socket.on("authenticated", function(msg) {
    $scope.user = msg.user;
    $scope.planet = msg.planet;
    console.log(msg);
    rememberUsername($scope.user.username, $scope.user.guid);
    $scope.signInIsDisplayed = false;
    $scope.signUpIsDisplayed = false;
    map.initializeMap($scope.user.home, $scope.planet);
    map.updateBotsInView($scope.user.bots);
    $scope.selectBot($scope.user.home);
    $scope.$apply();
  });

}]);