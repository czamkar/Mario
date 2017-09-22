var Labels = function (game, map) {
    this.map = map;
    this.createLabel();
}
Labels.prototype.createLabel = function () {
    this.marioLabel = game.add.bitmapText(30, 10, "marioFont", "MARIO", 15);
    this.pointsText = game.add.bitmapText(30, 25, "marioFont", "000000", 15);
    this.coin = game.add.sprite(160, 23, 'mapElement', 'prize_box_coin_01');
    this.coin.scale.y = 0.7;
    this.x = game.add.bitmapText(174, 24, "marioFont", "x", 10);
    this.coinText = game.add.bitmapText(182, 20, "marioFont", "00", 15);
    this.worldLabel = game.add.bitmapText(450, 10, "marioFont", "WORLD", 15);
    this.worldText = game.add.bitmapText(460, 25, "marioFont", "1-1", 15);
    this.timeLabel = game.add.bitmapText(520, 10, "marioFont", "TIME", 15);
    this.time = game.add.bitmapText(520, 25, "marioFont", "", 15);
    this.time.fixedToCamera = true;
}