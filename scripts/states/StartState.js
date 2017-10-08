var StartState = function (game) {

}
StartState.prototype = {
    preload: function () {
        game.load.bitmapFont('marioFont', 'assets/font/mario_font.png', 'assets/font/mario_font.fnt');
        game.load.image('tiles', 'assets/map/tiles.png');
        game.load.image('logo', 'assets/images/logo.png');
        game.load.tilemap('map', 'assets/map/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.atlas('mapElement', 'assets/map/tiles.png', 'assets/map/tiles.json');
        game.load.atlas('enemies', 'assets/images/enemies/enemies.png', 'assets/images/enemies/enemies.json');
        game.load.atlas('mario', 'assets/images/mario/mario.png', 'assets/images/mario/mario.json');
        game.load.image('wall1', 'assets/images/world/wall_crash_01.png');
        game.load.image('wall2', 'assets/images/world/wall_crash_02.png');
        game.load.audio('bump', 'assets/sounds/bump.mp3');
        game.load.audio('coin_collect', 'assets/sounds/coin_collect.mp3');
        game.load.audio('die', 'assets/sounds/die.mp3');
        game.load.audio('flagpole', 'assets/sounds/flagpole.mp3');
        game.load.audio('game_over', 'assets/sounds/game_over.mp3');
        game.load.audio('jump', 'assets/sounds/jump.mp3');
        game.load.audio('kick', 'assets/sounds/kick.mp3');
        game.load.audio('powerup', 'assets/sounds/powerup.mp3');
        game.load.audio('stageClear', 'assets/sounds/stage_clear.mp3');
        game.load.audio('stomp', 'assets/sounds/stomp.mp3');
        game.load.audio('timeout', 'assets/sounds/timeout.mp3');
        game.load.audio('wall_crash', 'assets/sounds/wall_crash.mp3');
        game.load.audio('theme', 'assets/sounds/theme.mp3');

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

        this.mario = game.add.sprite(32, 200, 'mario', 'mario_idle_01');
        this.mario.anchor.setTo(0.5);
        var startLabel = game.add.bitmapText(game.width / 2, game.height / 2 + 30, "marioFont", "Press spacebar to play", 15);
        startLabel.anchor.setTo(0.5);

        this.logo = game.add.sprite(game.width / 2, 80, 'logo');
        this.logo.anchor.setTo(0.5);
        this.startButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    update: function () {
        game.physics.arcade.collide(this.mario.sprite, this.map.mapLayers['ground']);
        game.physics.arcade.collide(this.mario.sprite, this.map.mapLayers['collide']);

        if (this.startButton.isDown ) {
            game.state.start("Info");
        }
    }
}