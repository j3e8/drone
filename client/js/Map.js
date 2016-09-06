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