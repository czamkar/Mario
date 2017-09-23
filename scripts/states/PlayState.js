var PlayState = function (game) {

}
PlayState.prototype = {

    create: function () {
        game.stage.backgroundColor = "#6888ff";
        this.map = new Map(game);
        this.mushrooms = game.add.group();
        this.goombas = game.add.group();
        this.PrizeBox = new PrizeBox(game);
        this.PrizeBoxGroup = game.add.group();
        this.PrizeBox.createPrizeBox();
        this.labels = new Labels(game, this.map);
        this.mario = new Mario(30, 200, game);

        this.gomb = new Goomba(30 * 16, 200, game);
        this.goombas.add(this.gomb.sprite);
        this.gomb = new Goomba(32 * 16, 200, game);
        this.goombas.add(this.gomb.sprite);



        this.labels.time.text = "400";
        this.timeTotal = 400;
        this.time = game.time.create(false);
        this.time.loop(1000, this.updateCounter, this);
        this.time.start();
        console.log(this.map);
        // this.map.mapLayers['collide'].debug = true;

        this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.timerJump = 0;

        game.physics.arcade.gravity.y = 500;
    },
    update: function () {
        game.physics.arcade.collide(this.mario.sprite, this.map.mapLayers['ground']);
        game.physics.arcade.collide(this.goombas, this.map.mapLayers['ground']);
        game.physics.arcade.collide(this.goombas, this.map.mapLayers['collide']);
        game.physics.arcade.collide(this.goombas, this.goombas);
        game.physics.arcade.collide(this.mario.sprite, this.goombas, this.bum);
        game.physics.arcade.collide(this.mario.sprite, this.PrizeBoxGroup, this.d, null, this);
        game.physics.arcade.collide(this.mario.sprite, this.map.mapLayers['collide'], this.c, null, this);
        if (this.mushroom) {
            if (this.mushroom.alive) {
                game.physics.arcade.collide(this.mushrooms, this.map.mapLayers['collide']);
            }
            game.physics.arcade.collide(this.mushrooms, this.map.mapLayers['ground']);
            game.physics.arcade.overlap(this.mario.sprite, this.mushrooms, this.marioMushroomHit, null, this);
        }
        if (this.jumpButton.isDown && game.time.now > this.timerJump && this.mario.sprite.body.blocked.down) {
            this.mario.sprite.frameName = "mario_jump";
            this.mario.sprite.body.velocity.y = -260;
            this.timerJump = game.time.now + 750;
        }
        if (!this.mario.sprite.body.blocked.down) {
            this.mario.sprite.frameName = "mario_jump";
            this.mario.controls("jump");
        } else {
            this.mario.controls("");
        }
    },
    marioMushroomHit: function (a, b) {
        a.scale.y = 1.7;
        this.mushroom.alive = false;
        b.body.velocity.x = 0;
        b.kill();
    },
    bum: function (a, b) {
        if (a.body.touching.down) {
            b.body.velocity.x = 0;
            b.body.destroy();
            b.animations.stop();
            b.frameName = "goomba_dead";

        }
        if (a.body.touching.right || a.body.touching.left) {
            game.level.lives--;
            game.state.start("Info");
        }
    },
    d: function (a, b) {
        b.animations.stop();
        b.frameName = 'prize_box_hit';
        if (b.x !== 336) {
            var coin = game.add.sprite(b.x + 2, b.y - 16, 'mapElement', 'prize_box_coin_03');
            coin.animations.add('coin', Phaser.Animation.generateFrameNames('prize_box_coin_', 0, 3, '', 2), 30, true);
            coin.animations.play('coin', 3, false);
            var tween2 = game.add.tween(coin).to({
                y: coin.y - 30
            }, 300, Phaser.Easing.None, true, 0, 0, true);
            tween2.onComplete.add(function () {
                game.level.coins++;
                this.labels.coinText.text = "0" + game.level.coins;
                coin.kill();
            }, this, true);

            var tween = game.add.tween(b).to({
                y: b.y - 4
            }, 200, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
            tween.onComplete.add(function () {

                // console.log(this.map.map.getTile(b.x/16, b.y/16, this.map.mapLayers['collide']).x, this.map.map.getTile(b.x/16, b.y/16, this.map.mapLayers['collide']).y);
                this.map.map.removeTile(b.x / 16, b.y / 16, this.map.mapLayers['collide']);
                this.map.map.putTile(43, this.map.mapLayers['collide'].getTileX(b.x), this.map.mapLayers['collide'].getTileY(b.y), this.map.mapLayers['collide']);

                b.kill();
            }, this, true);


        } else {
            this.mushroom = game.add.sprite(b.x, b.y, 'mapElement', 'mashroom');

            game.physics.arcade.enable(this.mushroom);
            this.mushroom.body.bounce.x = 0.8;
            this.mushroom.body.setSize(12, 16, 1, 0);
            this.mushroom.alive = false;
            this.mushrooms.add(this.mushroom);
            var tween2 = game.add.tween(this.mushroom).to({
                y: this.mushroom.y - 20
            }, 200, Phaser.Easing.Out, true, 0, 0, false);
            tween2.onComplete.add(function () {
                this.mushroom.alive = true;
                this.mushroom.body.velocity.x = 50;
            }, this, true);


            var tween = game.add.tween(b).to({
                y: b.y - 4
            }, 200, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
            tween.onComplete.add(function () {

                // console.log(this.map.map.getTile(b.x/16, b.y/16, this.map.mapLayers['collide']).x, this.map.map.getTile(b.x/16, b.y/16, this.map.mapLayers['collide']).y);
                this.map.map.removeTile(b.x / 16, b.y / 16, this.map.mapLayers['collide']);
                this.map.map.putTile(43, this.map.mapLayers['collide'].getTileX(b.x), this.map.mapLayers['collide'].getTileY(b.y), this.map.mapLayers['collide']);

                b.kill();
            }, this, true);

        }

        // b.y -=10;

    },
    c: function (a, b) {
        // console.log(this.map.map.getTile(b.x, b.y, this.map.mapLayers['collide']).worldX, this.map.map.getTile(b.x, b.y, this.map.mapLayers['collide']).worldY);
        // console.log(this.map.map.getTile(b.x, b.y, this.map.mapLayers['collide']).index);
        if (this.map.map.getTile(b.x, b.y, this.map.mapLayers['collide']).index === 8) {
            if (a.body.blocked.up)
                this.map.map.removeTile(b.x, b.y, this.map.mapLayers['collide']);
        } else if (this.map.map.getTile(b.x, b.y, this.map.mapLayers['collide']).index === 43) {
            if (a.body.blocked.up)
                console.log('prize');
        }
    },
    updateCounter: function () {
        this.timeTotal--;
        this.labels.time.text = (this.timeTotal);

    },
    render: function () {
        // game.debug.spriteInfo(this.mario.sprite, 32, 32);
        game.debug.bodyInfo(this.mario.sprite, 16, 32);
    }
}