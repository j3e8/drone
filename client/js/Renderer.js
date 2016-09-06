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