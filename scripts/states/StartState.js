var StartState = function (game) {

}
StartState.prototype = {
    preload: function () {
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //   game.scale.setMinMax(400, 320, 960, 540);
        game.load.bitmapFont('marioFont', 'assets/font/mario_font.png', 'assets/font/mario_font.fnt');
        game.load.image('tiles', 'assets/map/tiles.png');
        game.load.tilemap('map', 'assets/map/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.atlas('sMario', 'assets/images/mario/smallMario.png', 'assets/images/mario/smallMario.json');
        game.load.atlas('mapElement', 'assets/map/tiles.png', 'assets/map/tiles.json');
        //6888ff  kolor nieba
    },
    create: function () {
        game.level = {
            points: 00,
            lives: 3,
            coins: 0,
           
        }
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 250;
        game.stage.backgroundColor = "#6888ff";
        this.map = new Map();
        this.labels = new Labels(game, this.map);
  
        this.mario = new Mario(30, 200, game);

        var startLabel = game.add.bitmapText(320, 180, "marioFont", "Press spacebar to play", 18);
        startLabel.anchor.setTo(0.5);


        this.startButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    update: function () {
        this.mario.controls();
        game.physics.arcade.collide(this.mario.sprite, this.map.mapLayers['ground']);
        game.physics.arcade.collide(this.mario.sprite, this.map.mapLayers['collide']);

        if (this.startButton.isDown || this.mario.sprite.x > 200) {
            game.state.start("Info");
        }
    }
}