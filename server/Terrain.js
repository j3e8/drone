var baseTerrainTile = {
  type: 0,
  height: 0
};

var Terrain = {
  generateTerrain: function(size) {
    var terrain = [];
    for (var x=0; x < size.width; x++) {
      for (var y=0; y < size.height; y++) {
        if (!terrain[x]) {
          terrain[x] = [];
        }
        terrain[x][y] = baseTerrainTile;
      }
    }
  }
};

module.exports = Terrain;