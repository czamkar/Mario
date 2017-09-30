var StartState = function (game) {

}
StartState.prototype = {
    preload: function () {
        game.load.bitmapFont('marioFont', 'assets/font/mario_font.png', 'assets/font/mario_font.fnt');
        game.load.image('tiles', 'assets/map/tiles.png');
        game.load.tilemap('map', 'assets/map/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.atlas('mapElement', 'assets/map/tiles.png', 'assets/map/tiles.json');
        game.load.atlas('enemies', 'assets/images/enemies/enemies.png', 'assets/images/enemies/enemies.json');
        game.load.atlas('mario', 'assets/images/mario/mario.png', 'assets/images/mario/mario.json');
        game.load.image('wall1', 'assets/images/world/wall_crash_01.png');
        game.load.image('wall2', 'assets/images/world/wall_crash_02.png');
        //6888ff  kolor nieba
    },
    create: function () {
        game.level = {
            points: 00,
            lives: 3,
            coins: 0
        }
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.windowConstraints.bottom = "layout";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 250;
        game.stage.backgroundColor = "#6888ff";

        this.map = new Map(game);
        
        this.walls = game.add.group();
        this.walls.enableBody = true;
        this.map.map.createFromObjects('walls', 8, 'mapElement', 'block_01', true, false, this.walls);
        this.walls.forEach(function (a) {
            a.body.allowGravity = false;
            a.body.immovable = true;
            a.body.setSize(16, 16, 0, 0);
        }, this);

        this.PrizeBox = new PrizeBox(game);
        this.PrizeBox.createPrizeBox();

        this.labels = new Labels(game, this.map);

        this.mario = new Mario(30, 200, game);

        var startLabel = game.add.bitmapText(game.width / 2, game.height / 2 + 30, "marioFont", "Press spacebar to play", 15);
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