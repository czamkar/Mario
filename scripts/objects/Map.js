var Map = function (game) {
    this.mapLayers = {};
    this.map = {};
    this.createMap();
}
Map.prototype.createMap = function () {
    this.map = game.add.tilemap('map');
    this.map.addTilesetImage('tiles');

    this.mapLayers['background'] = this.map.createLayer('background');
    this.mapLayers['ground'] = this.map.createLayer('ground');
    this.mapLayers['collide'] = this.map.createLayer('collide');
    // this.mapLayers['collision'] = this.map.createLayer('Collision');

    this.mapLayers['ground'].resizeWorld();

    this.map.setCollisionBetween(1, 47, true, this.mapLayers['ground']);
    this.map.setCollisionBetween(1, 47, true, this.mapLayers['collide']);
}