var GameOver = function (game) {

}
GameOver.prototype = {

    create: function () {
        game.stage.backgroundColor = "#000000";
        this.labels = new Labels(game, null);
        var infoText = game.add.bitmapText(game.width / 2 - 40, game.height / 2 - 30, "marioFont", "WORLD 1-1", 15);
        //  var marioSpirte = game.add.sprite(game.width / 2 - 20, game.height / 2, 'mario', 'mario_idle_01');
        var x = game.add.bitmapText(game.width / 2 - 40, game.height / 2 - 4, "marioFont", "GAME OVER", 15);

        var timer = game.time.create(false);

        timer.loop(1000, this.nextState, this);

        timer.start();
    },
    nextState: function () {
        game.state.start("Start");
    },
    update: function () {


    },
}