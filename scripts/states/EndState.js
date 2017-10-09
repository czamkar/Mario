var EndState = function (game) {
    
    }
    EndState.prototype = {
    
        create: function () {
            game.stage.backgroundColor = "#000000";
            this.labels = new Labels(game, null);
            var infoText = game.add.bitmapText(game.width / 2 - 40, game.height / 2 - 30, "marioFont", "WORLD 1-1", 15);
            var x = game.add.bitmapText(game.width / 2 - 35, game.height / 2 - 4, "marioFont", "END GAME", 15);
    
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