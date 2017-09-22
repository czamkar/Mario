var PlayState = function (game) {

}
PlayState.prototype = {

    create: function () {
        game.stage.backgroundColor = "#6888ff";
        this.map = new Map();
        this.labels = new Labels(game, this.map);
        this.mario = new Mario(30, 200, game);

        this.labels.time.text = "400";
        this.timeTotal = 400;
        this.time = game.time.create(false);
        this.time.loop(1000, this.updateCounter, this);
        this.time.start();
    },
    update: function () {
        this.mario.controls();
        game.physics.arcade.collide(this.mario.sprite, this.map.mapLayers['ground']);
        game.physics.arcade.collide(this.mario.sprite, this.map.mapLayers['collide']);
    },
    updateCounter: function () {
        this.timeTotal--;
        this.labels.time.text = (this.timeTotal);

    }
}