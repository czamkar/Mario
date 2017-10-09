var Labels = function (game, map) {
    this.map = map;
    this.createLabel();
}
Labels.prototype.createLabel = function () {
    this.marioLabel = game.add.bitmapText(8, 2, "marioFont", "MARIO", 12);
    this.marioLabel.fixedToCamera = true;

    if (game.level.points != 0) {
        if (game.level.points < 1000) {
            this.pointsText = game.add.bitmapText(8, 12, "marioFont", "000" + game.level.points, 12);
        } else if (game.level.points < 10000) {
            this.pointsText = game.add.bitmapText(8, 12, "marioFont", "00" + game.level.points, 12);
        } else if (game.level.points < 100000) {
            this.pointsText = game.add.bitmapText(8, 12, "marioFont","0" + game.level.points, 12);
        } else if (game.level.points < 1000000) {
            this.pointsText = game.add.bitmapText(8, 12, "marioFont", game.level.points, 12);
        }
    } else {
        this.pointsText = game.add.bitmapText(8, 12, "marioFont", "000000", 12);
    }

    this.pointsText.fixedToCamera = true;

    this.coin = game.add.sprite(70, 14, 'mapElement', 'prize_box_coin_01');
    this.coin.scale.y = 0.5;
    this.coin.fixedToCamera = true;

    this.x = game.add.bitmapText(78, 13, "marioFont", "x", 9);
    this.x.fixedToCamera = true;
    if (game.level.coins != 0) {
        this.coinText = game.add.bitmapText(86, 12, "marioFont", "0" + game.level.coins, 12);
    } else {
        this.coinText = game.add.bitmapText(86, 12, "marioFont", "00", 12);
    }
    this.coinText.fixedToCamera = true;

    this.worldLabel = game.add.bitmapText(140, 2, "marioFont", "WORLD", 12);
    this.worldLabel.fixedToCamera = true;

    this.worldText = game.add.bitmapText(150, 12, "marioFont", "1-1", 12);
    this.worldText.fixedToCamera = true;

    this.timeLabel = game.add.bitmapText(200, 2, "marioFont", "TIME", 12);
    this.timeLabel.fixedToCamera = true;

    this.time = game.add.bitmapText(206, 12, "marioFont", "", 12);
    this.time.fixedToCamera = true;
}