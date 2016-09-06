var app = angular.module("Drone", []);
function Map(htmlContainer) {
  var htmlCanvas = null;
  var scale = 35; // px / meter

  var planet = null;
  var center = null;
  var bots = [];
  var selectedBot = null;

  var resizeTimer = null;
  htmlCanvas = document.createElement("CANVAS");
  htmlContainer.appendChild(htmlCanvas);
  fillParent();

  window.addEventListener("resize", function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fillParent, 50);
  });

  this.getClickedBot = function(clientX, clientY) {
    var rect = htmlCanvas.getBoundingClientRect();
    var ptPx = {
      x: clientX - rect.left,
      y: clientY - rect.top
    };

    var env = this.getEnvironment();
    var pt = Renderer.pxCoordinateToWorld(env, ptPx);

    var clickedBot = bots.find(function(bot) {
      console.log(bot.location, bot.size);
      if (pt.x >= bot.location.x - bot.size.width / 2
        && pt.x <= bot.location.x + bot.size.width / 2
        && pt.y >= bot.location.y - bot.size.height / 2
        && pt.y <= bot.location.y + bot.size.height / 2) {
        return true;
      }
      return false;
    });

    return clickedBot;
  }

  this.getBounds = function() {
    if (!center) {
      return null;
    }

    var width = htmlCanvas.offsetWidth / scale;
    var height = htmlCanvas.offsetHeight / scale;

    return {
      left: center.x - width / 2,
      top: center.y + height / 2,
      right: center.x + width / 2,
      bottom: center.y - height / 2
    };
  }

  this.getWorldSize = function() {
    return {
      width: htmlCanvas.offsetWidth / scale,
      height: htmlCanvas.offsetHeight / scale
    };
  }

  this.getSelectedBot = function() {
    return selectedBot ? selectedBot : null;
  }

  this.selectBot = function(bot) {
    selectedBot = bot;
  }

  this.initializeMap = function(newSelectedBot, newPlanet) {
    selectedBot = newSelectedBot;
    planet = newPlanet;
    center = {
      x: newSelectedBot.location.x,
      y: newSelectedBot.location.y
    }
  }

  this.updateBotsInView = function(objectArray) {
    bots = objectArray;
  }

  this.updateCenter = function(location) {
    center = location;
  }

  this.getEnvironment = function() {
    var ctx = htmlCanvas.getContext("2d");
    var canvasWidth = htmlCanvas.width;
    var canvasHeight = htmlCanvas.height;
    return {
      ctx: ctx,
      scale: scale,
      bounds: this.getBounds(),
      canvasSize: {
        width: canvasWidth,
        height: canvasHeight
      },
      planet: planet
    };
  }

  function render() {
    if (!htmlCanvas || !center)
      return;

    var env = this.getEnvironment();
    
    env.ctx.clearRect(0, 0, env.canvasWidth, env.canvasHeight);

    TerrainRenderer.render(env);

    bots.forEach(function(bot) {
      switch (bot.type) {
        case 'home':
          Renderer.renderHome(env, bot);
          break;
        case 'rover':
          Renderer.renderRover(env, bot);
          break;
        default:
          break;
      }
    });
  }

  var lastFrame = new Date().getTime();
  function animateFrame() {
    var thisFrame = new Date().getTime();
    var elapsed = thisFrame - lastFrame;
    var fps = (1000 / elapsed).toFixed(1);
    
    render.call(this);

    var fpsEl = document.getElementById('fps');
    if (fpsEl) {
      fpsEl.innerHTML = fps;
    }
    
    lastFrame = thisFrame;
    _requestAnimationFrame.call(this);
  }
  
  function _requestAnimationFrame() {
    if (window.requestAnimationFrame)
      window.requestAnimationFrame(animateFrame.bind(this));
    else if (window.webkitRequestAnimationFrame)
      window.webkitRequestAnimationFrame(animateFrame.bind(this));
    else if (window.mozRequestAnimationFrame)
      window.mozRequestAnimationFrame(animateFrame.bind(this));
    else if (window.msRequestAnimationFrame)
      window.msRequestAnimationFrame(animateFrame.bind(this));
  }

  function fillParent() {
    htmlCanvas.width = htmlContainer.offsetWidth;
    htmlCanvas.height = htmlContainer.offsetHeight;
  }

  _requestAnimationFrame.call(this);
}
var Renderer = {};

Renderer.HOME_IMG = new Image();
Renderer.HOME_IMG.src = "assets/images/bots/home.svg";

Renderer.ROVER_IMG = new Image();
Renderer.ROVER_IMG.onload = function() {
  console.log(this.width);
  console.log(this.height);
};
Renderer.ROVER_IMG.src = "assets/images/bots/rover.png";

Renderer.DRONE_IMG = new Image();
Renderer.DRONE_IMG.src = "assets/images/bots/drone.svg";

Renderer.renderHome = function(env, home) {
  if (!env || !env.ctx || !home) {
    return;
  }
  var location = Renderer.worldCoordinateToPx(env, home.location);
  var size = Renderer.worldSizeToPx(env, home.size);
  env.ctx.beginPath();
  env.ctx.drawImage(Renderer.HOME_IMG, location.x - size.width/2, location.y - size.height/2, size.width, size.height);
  env.ctx.fill();
}

Renderer.renderRover = function(env, rover) {
  if (!env || !env.ctx || !rover) {
    return;
  }
  var location = Renderer.worldCoordinateToPx(env, rover.location);
  var size = Renderer.worldSizeToPx(env, rover.size);
  env.ctx.save();
  env.ctx.translate(location.x, location.y);
  env.ctx.rotate(rover.heading);
  env.ctx.drawImage(Renderer.ROVER_IMG, -size.width/2, -size.height/2, size.width, size.height);
  env.ctx.restore();
}

Renderer.worldCoordinateToPx = function(env, coord) {
  return {
    x: (coord.x - env.bounds.left) * env.scale,
    y: (coord.y - env.bounds.bottom) * env.scale
  };
}

Renderer.pxCoordinateToWorld = function(env, coord) {
  return {
    x: env.bounds.left + coord.x / env.scale,
    y: env.bounds.bottom + coord.y / env.scale
  };
}

Renderer.worldSizeToPx = function(env, size) {
  return {
    width: size.width * env.scale,
    height: size.height * env.scale
  };
}
var TerrainRenderer = {};

TerrainRenderer.render = function(env) {
  if (!env.planet) {
    return;
  }
  var wholeBounds = TerrainRenderer.calculateWholeBounds(env.bounds, env.planet);
  var terrain = TerrainRenderer.generateTerrainArray(wholeBounds, env.planet);

  env.ctx.fillStyle = "rgb(" + env.planet.color.r + "," + env.planet.color.g + "," + env.planet.color.b + ")";
  env.ctx.fillRect(0, 0, env.canvasSize.width, env.canvasSize.height);

  TerrainRenderer.renderTerrain(env, terrain, wholeBounds);
}

TerrainRenderer.calculateWholeBounds = function(bounds, planet) {
  var wholeBounds = {
    left: Math.floor(bounds.left),
    right: Math.ceil(bounds.right),
    top: Math.ceil(bounds.top),
    bottom: Math.floor(bounds.bottom)
  };
  if (wholeBounds.left > 0) {
    wholeBounds.left--;
  }
  if (wholeBounds.bottom > 0) {
    wholeBounds.bottom--;
  }
  if (wholeBounds.right < planet.size.width - 1) {
    wholeBounds.right++;
  }
  if (wholeBounds.top < planet.size.height - 1) {
    wholeBounds.top++;
  }
  return wholeBounds;
}

TerrainRenderer.generateTerrainArray = function(wholeBounds, planet) {
  var terrain = [];
  for (var x=wholeBounds.left; x < wholeBounds.right; x++) {
    for (var y=wholeBounds.bottom; y < wholeBounds.top; y++) {
      if (!terrain[x]) {
        terrain[x] = [];
      }
      if (!terrain[x][y]) {
        terrain[x][y] = {};
      }
      terrain[x][y].pt = generateVertexFromCoordinate(x, y);
      terrain[x][y].color = generateColorFromCoordinate(x, y, planet.color);
    }
  }
  return terrain;
}

TerrainRenderer.renderTerrain = function(env, terrain, wholeBounds) {
  for (var x=wholeBounds.left; x < wholeBounds.right; x++) {
    for (var y=wholeBounds.bottom; y < wholeBounds.top; y++) {
      var tile = terrain[x][y];
      var tile_w = terrain[x-1] && terrain[x-1][y] ? terrain[x-1][y] : null;
      var tile_nw = terrain[x] && terrain[x][y-1] ? terrain[x][y-1] : null;
      var tile_ne = terrain[x+1] && terrain[x+1][y-1] ? terrain[x+1][y-1] : null;

      renderTriangle(env, tile, tile_w, tile_nw);
      renderTriangle(env, tile, tile_nw, tile_ne);
    }
  }
}

function renderTriangle(env, t1, t2, t3) {
  if (t1 && t2 && t3) {
    var color = {
      r: Math.floor((t1.color.r + t2.color.r + t3.color.r) / 3),
      g: Math.floor((t1.color.g + t2.color.g + t3.color.g) / 3),
      b: Math.floor((t1.color.b + t2.color.b + t3.color.b) / 3)
    };
    env.ctx.fillStyle = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
    env.ctx.beginPath();
    var pt1 = Renderer.worldCoordinateToPx(env, t1.pt);
    var pt2 = Renderer.worldCoordinateToPx(env, t2.pt);
    var pt3 = Renderer.worldCoordinateToPx(env, t3.pt);

    env.ctx.moveTo(pt1.x, pt1.y);
    env.ctx.lineTo(pt2.x, pt2.y);
    env.ctx.lineTo(pt3.x, pt3.y);
    env.ctx.closePath();
    env.ctx.fill();
  }
}

function generateVertexFromCoordinate(x, y) {
  var xoffset = pseudoRandomX(x, y) * 0.6 + 0.2;
  if (y % 2) {
    xoffset += 0.5;
  }
  var yoffset = pseudoRandomY(x, y) * 0.6 + 0.2;
  return {
    x: x + xoffset,
    y: y + yoffset
  };
}

function generateColorFromCoordinate(x, y, baseColor) {
  var VARIATION = 25;
  var v = pseudoRandomC(x, y, 99) * VARIATION;
  var color = {
    r: v + baseColor.r,
    g: v + baseColor.g,
    b: v + baseColor.b
  };
  if (color.r > 255) {
    color.r = 255;
  }
  if (color.g > 255) {
    color.g = 255;
  }
  if (color.b > 255) {
    color.b = 255;
  }
  return color;
}

function pseudoRandomC(x, y, z) {
  var a = (x + z) * (y + z) * z / 2.9;
  return (279470273 * a) % 4294967291 / 4294967291
}
function pseudoRandomX(x, y) {
  var a = x * x * y / 1.7;
  return (279470273 * a) % 4294967291 / 4294967291
}
function pseudoRandomY(x, y) {
  var a = x * y * y / 1.4;
  return (279470273 * a) % 4294967291 / 4294967291
}

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