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
