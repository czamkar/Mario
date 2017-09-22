var game = new Phaser.Game(Config.game_width, Config.game_height, Phaser.AUTO, "game");

game.state.add("Play", PlayState);
game.state.add("Start", StartState);
game.state.add("Info", InfoState);

game.state.start("Start");
