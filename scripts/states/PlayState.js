var PlayState = function (game) {

}
PlayState.prototype = {

    create: function () {
        game.stage.backgroundColor = "#6888ff";
        this.map = new Map(game);
        this.mushrooms = game.add.group();

        this.walls = game.add.group();
        this.walls.enableBody = true;
        //createFromObjects(name, gid, key, frame, exists, autoCull, group, CustomClass, adjustY)


        this.map.map.createFromObjects('walls', 8, 'mapElement', 'block_01', true, false, this.walls);

        this.walls.forEach(function (a) {
            a.body.allowGravity = false;
            a.body.immovable = true;
            a.body.setSize(16, 16, 0, 0);
        }, this);
        this.goombas = game.add.group();
        this.PrizeBox = new PrizeBox(game);
        this.PrizeBoxGroup = game.add.group();
        this.PrizeBoxGroup.enableBody = true;
        this.PrizeBox.createPrizeBox();
        this.labels = new Labels(game, this.map);
        this.mario = new Mario(30, 200, game);

        this.gomb = new Goomba(30 * 16, 200, game);
        this.goombas.add(this.gomb.sprite);
        this.gomb = new Goomba(32 * 16, 200, game);
        this.goombas.add(this.gomb.sprite);

        console.log(this.walls);

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
        game.physics.arcade.collide(this.mario.sprite, this.walls, this.marioWallHit, null, this);
        game.physics.arcade.collide(this.goombas, this.map.mapLayers['ground']);
        game.physics.arcade.collide(this.goombas, this.map.mapLayers['collide']);
        game.physics.arcade.collide(this.goombas, this.goombas);
        game.physics.arcade.collide(this.mario.sprite, this.goombas, this.marioGommbaHit);
        game.physics.arcade.collide(this.mario.sprite, this.PrizeBoxGroup, this.d, null, this);
        game.physics.arcade.collide(this.mario.sprite, this.map.mapLayers['collide'], this.test, null, this);
        if (this.mushroom) {
            if (this.mushroom.alive) {
                game.physics.arcade.collide(this.mushrooms, this.map.mapLayers['collide']);
                game.physics.arcade.collide(this.mushrooms, this.walls);
                game.physics.arcade.collide(this.mushrooms, this.PrizeBoxGroup, this.test, null, this);
            }
            game.physics.arcade.collide(this.mushrooms, this.map.mapLayers['ground']);
            game.physics.arcade.overlap(this.mario.sprite, this.mushrooms, this.marioMushroomHit, null, this);
        }
        if (this.jumpButton.isDown && game.time.now > this.timerJump && (this.mario.sprite.body.blocked.down || this.mario.sprite.body.touching.down)) {
            this.mario.sprite.frameName = "mario_jump";
            this.mario.sprite.body.velocity.y = -260;
            this.timerJump = game.time.now + 750;
        }
        if (!this.mario.sprite.body.blocked.down && !this.mario.sprite.body.touching.down) {
            this.mario.sprite.frameName = "mario_jump";
            this.mario.controls("jump");
        } else if (this.mario.sprite.body.touching.down && this.mario.sprite.body.blocked.down) {
            this.mario.sprite.frameName = "mario_jump";
            this.mario.controls("jump");
        } else {
            this.mario.controls("");
        }
    },
    test: function (a,b) {
        console.log(b.worldX, b.worldY);
    },
    marioWallHit: function (a, b) {
        console.log(a.objectMario);
        console.log(b);
        if (a.body.touching.up && b.body.touching.down && !a.objectMario.size) {
            var tween = game.add.tween(b).to({
                y: b.y - 4
            }, 200, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
        } else if (a.body.touching.up && b.body.touching.down && a.objectMario.size) {
            var wallCrash1 = game.add.sprite(b.x+8, b.y, 'wall2');
            wallCrash1.anchor.setTo(0.5);
            var wallCrash2 = game.add.sprite(b.x+8, b.y, 'wall1');
            wallCrash2.anchor.setTo(0.5);
            var wallCrash3 = game.add.sprite(b.x+8, b.y, 'wall2');
            wallCrash3.anchor.setTo(0.5);
            var wallCrash4 = game.add.sprite(b.x+8, b.y, 'wall1');
            wallCrash4.anchor.setTo(0.5);
            
            // wallCrash1.scale.setTo(0.5);
            var tween2 = game.add.tween(wallCrash1).to( { angle: -180, y: wallCrash1.y-30, x: wallCrash1.x-15 }, 300, Phaser.Easing.Linear.None, true);
            tween2.onComplete.add(function () {
                var tween = game.add.tween(wallCrash1).to( { angle: -360,y: wallCrash1.y+120,x: wallCrash1.x-30}, 700, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function () {
                    wallCrash1.kill();
                }, this, true);
            }, this, true);
            var tween2 = game.add.tween(wallCrash3).to( { angle: -180, y: wallCrash3.y-10, x: wallCrash3.x-15 }, 300, Phaser.Easing.Linear.None, true);
            tween2.onComplete.add(function () {
                var tween = game.add.tween(wallCrash3).to( { angle: -360,y: wallCrash3.y+120,x: wallCrash3.x-30}, 700, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function () {
                    wallCrash3.kill();
                }, this, true);
            }, this, true);
            var tween2 = game.add.tween(wallCrash2).to( { angle: 180, y: wallCrash2.y-30, x: wallCrash2.x+15 }, 300, Phaser.Easing.Linear.None, true);
            tween2.onComplete.add(function () {
                var tween = game.add.tween(wallCrash2).to( { angle:90,y: wallCrash2.y+120,x: wallCrash2.x+45}, 700, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function () {
                    wallCrash2.kill();
                }, this, true);
            }, this, true);
            var tween2 = game.add.tween(wallCrash4).to( { angle: 180, y: wallCrash4.y-10, x: wallCrash4.x+15 }, 300, Phaser.Easing.Linear.None, true);
            tween2.onComplete.add(function () {
                var tween = game.add.tween(wallCrash4).to( { angle:90,y: wallCrash4.y+120,x: wallCrash4.x+45}, 700, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function () {
                    wallCrash4.kill();
                }, this, true);
            }, this, true);
            b.destroy();
        }
    },
    marioMushroomHit: function (a, b) {
        a.scale.y = 1.7;
        a.objectMario.size = true;
        this.mushroom.alive = false;
        b.body.velocity.x = 0;
        b.body.destroy();
        b.kill();
    },
    marioGommbaHit: function (a, b) {
        if (a.body.touching.down) {
            b.body.bounce.x = 1;
            b.body.velocity.x = 0;
            b.body.destroy();
            b.animations.stop();
            b.frameName = "goomba_dead";
            game.time.events.add(Phaser.Timer.SECOND * 1, function () {
                console.log("timer");
                b.kill();
            }, this);

        }
        if (a.body.touching.right || a.body.touching.left) {
            if (a.scale.y > 1) {
                a.scale.y = 1;
                if (b.body.deltaX > 0) {

                    b.body.velocity.x = 50;
                } else {

                    b.body.velocity.x = -50;
                }
            } else {
                game.level.lives--;
                game.state.start("Info");
            }
        }
    },
    d: function (a, b) {
        if (a.body.touching.up && b.body.touching.down) {
            console.log('----------------------------');
            console.log(a);
            console.log(b);
            console.log('----------------------------');
            b.animations.stop();
            console.log("prize");
            b.frameName = 'prize_box_hit';
            var  check = function(){
                if(b.x === 336)
               { return false;}
                else if(b.x === 1248)
                { return false;}
                else if(b.x === 1744 && b.y === 80)
                { return false;}
                else{
                    return true;
                }
            };
            if (check()) {
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
                this.mushroom.body.setSize(12, 16, 0, 0);
                this.mushroom.alive = false;
                this.mushrooms.add(this.mushroom);
                var tween2 = game.add.tween(this.mushroom).to({
                    y: this.mushroom.y - 20
                }, 200, Phaser.Easing.Out, true, 0, 0, false);
                tween2.onComplete.add(function () {
                    this.mushroom.alive = true;
                    this.mushroom.body.velocity.x = 30;
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
        }
        // b.y -=10;

    },
    updateCounter: function () {
        this.timeTotal--;
        this.labels.time.text = (this.timeTotal);

    },
    render: function () {
        if (this.mushroom) {
            game.debug.body(this.mushroom);
        }
        this.walls.forEach(function (a) {
            game.debug.body(a);
        }, this);
        this.PrizeBoxGroup.forEach(function (a) {
            game.debug.body(a);
        }, this);
        // console.log(this.goombas);
        // game.debug.spriteInfo(this.mario.sprite, 32, 32);
        game.debug.body(this.mario.sprite);
        // game.debug.bodyInfo(this.mario.sprite, 16, 32);
        // game.debug.bodyInfo(this.walls.children[0], 16, 32);
        // game.debug.bodyInfo(this.goombas.children[0], 16, 32);
    }
}