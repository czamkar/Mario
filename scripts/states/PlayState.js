var PlayState = function (game) {

}
PlayState.prototype = {

    create: function () {
        this.theme = game.add.audio('theme');
        this.theme.loop = true;
        this.theme.play();

        game.stage.backgroundColor = "#6888ff";
        this.map = new Map(game);
        this.mushrooms = game.add.group();

        this.flags = game.add.group();

        this.map.map.createFromObjects('walls', 19, 'mapElement', 'flag_04', true, false, this.flags);
        this.map.map.createFromObjects('walls', 12, 'mapElement', 'flag_03', true, false, this.flags);


        this.flagPole = game.add.group();
        this.flagPole.enableBody = true
        this.map.map.createFromObjects('walls', 32, 'mapElement', 'flag_01', true, false, this.flagPole);
        this.flagPole.forEach(function (a) {
            a.body.allowGravity = false;
            a.body.immovable = true;
            a.body.setSize(16, 16, 0, 0);
        }, this);

        this.walls = game.add.group();
        this.walls.enableBody = true;
        this.map.map.createFromObjects('walls', 8, 'mapElement', 'block_01', true, false, this.walls);
        this.walls.forEach(function (a) {
            a.body.allowGravity = false;
            a.body.immovable = true;
            a.body.setSize(16, 16, 0, 0);
        }, this);

        this.PrizeBox = new PrizeBox(game);
        this.PrizeBoxGroup = game.add.group();
        this.PrizeBoxGroup.enableBody = true;
        this.PrizeBox.createPrizeBox();
        this.labels = new Labels(game, this.map);
        this.mario = new Mario(16 * 3, 200, game);

        this.goombas = game.add.group();
        this.goombas.enableBody = true;
        this.goom = new Goomba(game);
        this.goom.createGoomba();
        //Goomasy między rurami
        this.goombas.children[0].body.velocity.x = -30;
        this.goombas.children[1].body.velocity.x = -30;
        this.goombas.children[2].body.velocity.x = -30;
        this.goombas.children[3].body.velocity.x = -30;
        this.goombas.children[12].body.velocity.x = -30;
        this.goombas.children[13].body.velocity.x = -30;

        this.koopa = new Koopa(1700, 200, game);

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
        if (this.mario.sprite.y > 260) {
            game.level.lives--;
            if (game.level.lives == 0) {
                game.state.start("Over");
            } else {
                game.state.start("Info");
            }
        }
        if (this.timeTotal <= 0) {
            game.state.start("Time");
        }

        this.enemiesToAccelerate(this.mario.sprite.x);
        if (this.koopa.sprite.x > (this.mario.sprite.x + game.width / 2 + 16) && this.koopa.sprite.frameName == "koopa_dead") {
            this.koopa.sprite.kill();
        } else if (this.koopa.sprite.x < (this.mario.sprite.x - game.width / 2 - 16) && this.koopa.sprite.frameName == "koopa_dead") {
            this.koopa.sprite.kill();
        }
        game.physics.arcade.collide(this.mario.sprite, this.map.mapLayers['ground']);

        game.physics.arcade.collide(this.koopa.sprite, this.map.mapLayers['collide']);
        game.physics.arcade.collide(this.mario.sprite, this.walls, this.marioWallHit, null, this);
        game.physics.arcade.collide(this.mario.sprite, this.flagPole, this.marioGrabFlag, null, this);
        game.physics.arcade.collide(this.goombas, this.map.mapLayers['ground']);
        game.physics.arcade.collide(this.goombas, this.map.mapLayers['collide']);
        game.physics.arcade.collide(this.goombas, this.walls);
        game.physics.arcade.collide(this.goombas, this.PrizeBoxGroup);
        game.physics.arcade.collide(this.goombas);

        game.physics.arcade.collide(this.koopa.sprite, this.map.mapLayers['ground']);
        if (!this.mario.sprite.objectMario.inviolable) {
            game.physics.arcade.collide(this.mario.sprite, this.goombas, this.marioGommbaHit, null, this);
            game.physics.arcade.collide(this.mario.sprite, this.koopa.sprite, this.marioKoopaHit, null, this);
        } else {

            game.time.events.add(Phaser.Timer.QUARTER * 2, function () {

                var marioAlhpa = game.add.tween(this.mario.sprite).to({
                    alpha: [0.3, 1]
                }, 200, Phaser.Easing.Linear.None, true, 0).repeat(10);
                marioAlhpa.onComplete.add(function () {
                    console.log('koniec repeat')
                    this.mario.sprite.alpha = 1;
                    this.mario.sprite.objectMario.inviolable = false;
                }, this, true);

            }, this);
        }
        game.physics.arcade.collide(this.mario.sprite, this.PrizeBoxGroup, this.marioPrizeBoxHit, null, this);
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
        if (!this.mario.sprite.objectMario.onFlag) {
            if (this.jumpButton.isDown && game.time.now > this.timerJump && (this.mario.sprite.body.blocked.down || this.mario.sprite.body.touching.down)) {
                this.mario.sprite.frameName = "mario_jump";
                this.mario.sprite.body.velocity.y = -260;

                var music = game.add.audio('jump');

                music.play();
                this.timerJump = game.time.now + 750;
            }
            if (!this.mario.sprite.body.blocked.down && !this.mario.sprite.body.touching.down && !this.mario.sprite.objectMario.frozen) {
                if (!this.mario.sprite.objectMario.size) {

                    this.mario.sprite.frameName = "mario_jump";
                } else {
                    this.mario.sprite.frameName = "mario_big_jump";
                }
                this.mario.controls("jump");
            } else if (this.mario.sprite.body.touching.down && this.mario.sprite.body.blocked.down && !this.mario.sprite.objectMario.frozen) {
                if (!this.mario.sprite.objectMario.size) {

                    this.mario.sprite.frameName = "mario_jump";
                } else {
                    this.mario.sprite.frameName = "mario_big_jump";
                }
                this.mario.controls("jump");
            } else {
                this.mario.controls("");
            }
        }
    },
    test: function (a, b) {
        console.log('koniec');
        console.log(b);
        if (b.index === 4) {
            this.mario.sprite.animations.stop();
            if (!this.mario.sprite.objectMario.size) {
                this.mario.sprite.frameName = 'mario_idle_01';
            } else {
                this.mario.sprite.frameName = 'mario_idle_02';
            }

            var marioAlhpa2 = game.add.tween(this.mario.sprite).to({
                alpha: 0
            }, 1000, Phaser.Easing.Linear.None, true, 0);
            marioAlhpa2.onComplete.add(function () {
                game.state.start("End");
            }, this, true);
        }
        game.physics.arcade.collide(this.goombas, b, this.wallGoombaHit, null, this);
    },
    addPoints: function (points, sprite) {
        console.log(sprite.key);
        if (sprite.key == "mapElement") {

            var point = game.add.bitmapText(sprite.x + 8, sprite.y - 16, "marioFont", points, 10);
        } else {

            var point = game.add.bitmapText(sprite.x, sprite.y, "marioFont", points, 10);
        }

        point.anchor.setTo(0.5, 0.5);
        var tween_points = game.add.tween(point).to({
            y: point.y - 20
        }, 150, Phaser.Easing.None, true);
        tween_points.onComplete.add(function () {
            point.kill();
        }, this, true);
        game.level.points += points;
        if (game.level.points < 1000) {
            this.labels.pointsText.text = "000" + game.level.points;
        } else if (game.level.points < 10000) {
            this.labels.pointsText.text = "00" + game.level.points;
        } else if (game.level.points < 100000) {
            this.labels.pointsText.text = "0" + game.level.points;
        } else if (game.level.points < 1000000) {
            this.labels.pointsText.text = game.level.points;
        }

    },
    enemiesToAccelerate: function (marioX) {
        if (marioX > 950 && marioX < 951) {

            this.goombas.children[4].body.velocity.x = -30;
            this.goombas.children[5].body.velocity.x = -30;
        } else if (marioX > 1380 && marioX < 1390) {
            this.koopa.sprite.body.velocity.x = -30;
        } else if (marioX > 1344 && marioX < 1350) {

            this.goombas.children[6].body.velocity.x = -30;
            this.goombas.children[7].body.velocity.x = -30;
        } else if (marioX > 1590 && marioX < 1595) {

            this.goombas.children[8].body.velocity.x = -30;
            this.goombas.children[9].body.velocity.x = -30;
        } else if (marioX > 1622 && marioX < 1625) {

            this.goombas.children[10].body.velocity.x = -30;
            this.goombas.children[11].body.velocity.x = -30;
        }
    },
    marioGrabFlag: function (a, b) {
        a.objectMario.frozen = true;
        a.animations.stop();
        if (!a.objectMario.size) {

            a.frameName = 'mario_stop';
        } else {

            a.frameName = 'mario_big_stop';
        }
        a.x += 8;
        a.scale.x = -1;
        console.log(b);
        this.flagPole.forEach(function (a) {
            a.body.destroy();
        });
        if (!this.mario.sprite.objectMario.onFlag) {
            a.body.velocity.setTo(0);
            a.body.allowGravity = false;
            var marioTween = game.add.tween(a).to({
                y: 192
            }, 2000, Phaser.Easing.None, true);
            var tween = game.add.tween(this.flags.children[0]).to({
                y: 168
            }, 2000, Phaser.Easing.None, true);
            var tween2 = game.add.tween(this.flags.children[1]).to({
                y: 168
            }, 2000, Phaser.Easing.None, true, );
            // var tween3 = game.add.tween(a).to({
            //     y: 168
            // }, 2000, Phaser.Easing.None, true, );
            marioTween.onComplete.add(function () {
                a.scale.x = 1;
                a.x += 13;
                game.time.events.add(Phaser.Timer.SECOND * 1, this.marioWalk, this);
            }, this, true);
            // tween2.onComplete.add(function () {
            //     a.animations.play('walk');
            //     a.body.velocity.x = 120;
            // }, this, true);
        }
        this.mario.sprite.objectMario.onFlag = true;

    },
    marioWalk: function () {
        this.mario.sprite.body.allowGravity = true;
        this.mario.sprite.body.velocity.x = 120;
        if (!this.mario.sprite.objectMario.size) {
            this.mario.sprite.frameName = 'mario_walk_02';
            this.mario.sprite.animations.play('walkSmall', 15, true);
        } else {

            this.mario.sprite.frameName = 'mario_big_walk_02';
            this.mario.sprite.animations.play('walkBig', 15, true);
        }

    },
    wallGoombaHit: function (a, b) {
        b.animations.stop();
        b.scale.y = -1;
        b.body.destroy();
        // var tweenGoombaDie = game.add.tween(b).to({
        //     x: [b.x + 15,b.x + 30 , b.x + 45,  b.x + 70],
        //     y: [b.y - 20, b.y - 30, b.y + 70, b.y + 150]
        // }, 500, Phaser.Easing.None, true, );
        var tweenGoombaDie = game.add.tween(b).to({
            x: [b.x + 15, b.x + 30, b.x + 45, b.x + 70],
            y: [b.y - 20, b.y - 30, b.y + 70, b.y + 150],
        }, 1000, Phaser.Easing.Quadratic.Out, true).interpolation(function (v, k) {
            return Phaser.Math.bezierInterpolation(v, k);
        });

        tweenGoombaDie.onComplete.add(function () {

            b.kill();
        }, this, true);

    },
    marioWallHit: function (a, b) {
        game.physics.arcade.collide(this.goombas, b, this.wallGoombaHit, null, this);


        if (a.body.touching.up && b.body.touching.down && !a.objectMario.size) {
            var tween = game.add.tween(b).to({
                y: b.y - 4
            }, 200, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
        } else if (a.body.touching.up && b.body.touching.down && a.objectMario.size) {
            var wallCrash1 = game.add.sprite(b.x + 8, b.y, 'wall2');
            wallCrash1.anchor.setTo(0.5);
            var wallCrash2 = game.add.sprite(b.x + 8, b.y, 'wall1');
            wallCrash2.anchor.setTo(0.5);
            var wallCrash3 = game.add.sprite(b.x + 8, b.y, 'wall2');
            wallCrash3.anchor.setTo(0.5);
            var wallCrash4 = game.add.sprite(b.x + 8, b.y, 'wall1');
            wallCrash4.anchor.setTo(0.5);
 
            var tween11 = game.add.tween(wallCrash1).to({
                x: [b.x - 15, b.x - 30, b.x - 45, b.x - 70],
                y: [b.y - 20, b.y - 30, b.y + 70, b.y + 150],
            }, 1000, Phaser.Easing.Quadratic.Out, true).interpolation(function (v, k) {
                return Phaser.Math.bezierInterpolation(v, k);
            });
     
            tween11.onComplete.add(function () {
                wallCrash1.kill();
            }, this, true);
            var tween22 = game.add.tween(wallCrash2).to({
                x: [b.x - 15, b.x - 30, b.x - 45, b.x - 70],
                y: [b.y - 40, b.y - 50, b.y + 60, b.y + 140],
            }, 1000, Phaser.Easing.Quadratic.Out, true).interpolation(function (v, k) {
                return Phaser.Math.bezierInterpolation(v, k);
            });
            tween22.onComplete.add(function () {
                wallCrash2.kill();
            }, this, true);
            var tween33 = game.add.tween(wallCrash3).to({
                x: [b.x + 15, b.x + 30, b.x + 45, b.x + 70],
                y: [b.y - 20, b.y - 30, b.y + 70, b.y + 150],
            }, 1000, Phaser.Easing.Quadratic.Out, true).interpolation(function (v, k) {
                return Phaser.Math.bezierInterpolation(v, k);
            });
            tween33.onComplete.add(function () {
                wallCrash3.kill();
            }, this, true);
            var tween44 = game.add.tween(wallCrash4).to({
                x: [b.x + 15, b.x + 30, b.x + 45, b.x + 70],
                y: [b.y - 40, b.y - 50, b.y + 60, b.y + 140],
            }, 1000, Phaser.Easing.Quadratic.Out, true).interpolation(function (v, k) {
                return Phaser.Math.bezierInterpolation(v, k);
            });
            tween44.onComplete.add(function () {
                wallCrash4.kill();
            }, this, true);
 
            var music = game.add.audio('wall_crash');

            music.play();
            b.destroy();
            var points = 50;
            game.level.points += points;
            if (game.level.points < 1000) {
                this.labels.pointsText.text = "000" + game.level.points;
            } else if (game.level.points < 10000) {
                this.labels.pointsText.text = "00" + game.level.points;
            } else if (game.level.points < 100000) {
                this.labels.pointsText.text = "0" + game.level.points;
            } else if (game.level.points < 1000000) {
                this.labels.pointsText.text = game.level.points;
            }
        }
    },
    marioMushroomHit: function (a, b) {
        this.addPoints(1000, b);
        a.objectMario.frozen = true;
        b.body.destroy();
        this.mushroom.alive = false;
        var music = game.add.audio('powerup');

        music.play();
        b.kill();
    },
    marioKoopaHit: function (a, b) {
        if (a.body.touching.down) {
            if (b.frameName != 'koopa_dead') {
                a.body.velocity.y = -150;
                b.body.velocity.setTo(0, 0);
                b.anchor.setTo(0.5, 0.5);
                b.animations.stop();
                b.frameName = "koopa_dead";
                b.y = b.y - 8;
                b.body.setSize(16, 16, 0, 8);

                game.time.events.add(Phaser.Timer.HALF * 2, function () {


                    // b.kill();
                }, this);
            } else {
                b.body.allowGravity = true;
                a.body.velocity.y = -150;
                a.body.velocity.x = 0;
                var site;
                if (a.x + 8 <= b.x) {
                    game.time.events.add(Phaser.Timer.QUARTER * 0.1, function () {


                        b.body.velocity.x = 130;
                        // b.kill();
                    }, this);

                } else if (a.x + 8 > b.x) {
                    game.time.events.add(Phaser.Timer.QUARTER * 0.1, function () {


                        b.body.velocity.x = -130;
                        // b.kill();
                    }, this);
                }


            }
        }
        if (a.body.touching.right || a.body.touching.left) {
            console.log(a);
            if (b.frameName != 'koopa_dead') {
                console.log('b');
                if (a.objectMario.size) {
                    a.y -= 1;
                    if (b.body.velocity.x > 0) {
                        b.scale.x = 1;
                        b.body.velocity.x = -30;
                    } else {
                        b.scale.x = -1;
                        b.body.velocity.x = 30;
                    }
                    a.objectMario.small();
                } else {
                    game.level.lives--;
                    if (game.level.lives == 0) {
                        game.state.start("Over");
                    } else {
                        game.state.start("Info");
                    }
                }
            } else {
                console.log('b1');
                if (b.body.velocity.x !== 0) {
                    if (a.body.touching.right) {
                        b.body.velocity.x = 130;
                    } else if (a.body.touching.left) {
                        b.body.velocity.x = -130;
                    }
                } else {
                    if (a.objectMario.size) {

                        if (b.body.deltaX > 0) {

                            b.body.velocity.x = -50;
                        } else {

                            b.body.velocity.x = -50;
                        }
                        // a.objectMario.size = false;
                    } else {
                        game.level.lives--;
                        if (game.level.lives == 0) {
                            game.state.start("Over");
                        } else {
                            game.state.start("Info");
                        }
                    }
                }
            }
        }

    },
    marioGommbaHit: function (a, b) {
        if (a.body.touching.down) {
            //a.body.bounce.y = 4;
            a.body.velocity.y = -150;
            b.body.velocity.x = 0;

            b.animations.stop();
            b.frameName = "goomba_dead";
            this.addPoints(100, b);
            var music = game.add.audio('stomp');

            music.play();
            b.body.destroy();
            game.time.events.add(Phaser.Timer.HALF * 1, function () {

                // a.body.bounce.y = 0;
                b.kill();

            }, this);

        }
        if (a.body.touching.right || a.body.touching.left) {
            console.log(a.objectMario.size);
            if (a.objectMario.size) {

                console.log(b.body.velocity.x);
                if (b.body.velocity.x > 0) {

                    b.body.velocity.x = -50;
                } else {

                    b.body.velocity.x = 50;
                }
                a.y -= 1;
                a.body.setSize(11, 16, 2, 0);
                a.body.velocity.x = 0;
                a.objectMario.inviolable = true;
                a.objectMario.size = false;
                a.objectMario.small();
            } else {
                this.goombas.forEachAlive(function (a) {
                    a.body.velocity.setTo(0);
                }, this);
                this.mario.sprite.objectMario.alive = false;
                console.log('nope');
                var music = game.add.audio('die');

                music.play();
                this.mario.sprite.frameName = 'mario_dead';
                this.mario.sprite.objectMario.die();
                music.onStop.add(playInfo, this);
                this.mario.sprite.body.velocity.setTo(0, 0);

                function playInfo() {

                    game.level.lives--;
                    if (game.level.lives == 0) {
                        game.state.start("Over");
                    } else {
                        game.state.start("Info");
                    }
                    this.mario.sprite.objectMario.alive = true;
                }
            }
        }
    },
    marioPrizeBoxHit: function (a, b) {
        console.log(b);

        if (a.body.touching.up && b.body.touching.down) {
            b.animations.stop();
            b.frameName = 'prize_box_hit';
            var check = function () {
                if (b.x === 336 && !a.objectMario.size) {
                    return false;
                } else if (b.x === 1248 && !a.objectMario.size) {
                    return false;
                } else if (b.x === 1744 && b.y === 80 && !a.objectMario.size) {
                    return false;
                } else {
                    return true;
                }
            };
            if (check()) {
                var coin = game.add.sprite(b.x + 2, b.y - 16, 'mapElement', 'prize_box_coin_03');
                coin.animations.add('coin', Phaser.Animation.generateFrameNames('prize_box_coin_', 0, 3, '', 2), 30, true);
                coin.animations.play('coin', 15, true);
                var tween2 = game.add.tween(coin).to({
                    y: coin.y - 30
                }, 200, Phaser.Easing.None, true, 0, 0, true);
                tween2.onComplete.add(function () {
                    game.level.coins++;
                    if (game.level.coins < 10) {
                        this.labels.coinText.text = "0" + game.level.coins;
                    } else {
                        this.labels.coinText.text = game.level.coins;
                    }
                    var music = game.add.audio('coin_collect');

                    music.play();
                    coin.kill();
                }, this, true);

                var tween = game.add.tween(b).to({
                    y: b.y - 4
                }, 200, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
                tween.onComplete.add(function () {
                    this.addPoints(200, b);
                    // console.log(this.map.map.getTile(b.x/16, b.y/16, this.map.mapLayers['collide']).x, this.map.map.getTile(b.x/16, b.y/16, this.map.mapLayers['collide']).y);
                    this.map.map.removeTile(b.x / 16, b.y / 16, this.map.mapLayers['collide']);
                    this.map.map.putTile(43, this.map.mapLayers['collide'].getTileX(b.x), this.map.mapLayers['collide'].getTileY(b.y), this.map.mapLayers['collide']);

                    b.kill();
                }, this, true);


            } else {
                this.mushroom = game.add.sprite(b.x, b.y, 'mapElement', 'mashroom');

                game.physics.arcade.enable(this.mushroom);
                this.mushroom.body.bounce.x = 1;
                this.mushroom.body.setSize(16, 16, 0, 0);
                this.mushroom.alive = false;
                this.mushrooms.add(this.mushroom);
                var tween2 = game.add.tween(this.mushroom).to({
                    y: this.mushroom.y - 20
                }, 200, Phaser.Easing.Out, true, 0, 0, false);
                tween2.onComplete.add(function () {
                    this.mushroom.alive = true;
                    this.mushroom.y -= 2;
                    this.mushroom.body.velocity.x = 40;
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
        // console.log(this.mario.sprite.y);
        // console.log(this.koopa.body.velocit.x);
        // console.log(this.koopa.body.velocit.y);
        // console.log(this.koopa.sprite.width);




        game.debug.text('Mario  y:  ' + this.mario.sprite.y, 32, 88);
        // game.debug.text('koppa velo x:  ' + this.koopa.sprite.x, 32, 108);

        // game.debug.text('Mario velo y:  ' + (this.mario.sprite.x + game.width / 2 + 16), 32, 148);
        // game.debug.text('Mario velo y:  ' + (this.mario.sprite.x - game.width / 2 + 16), 32, 168);
        // game.debug.cameraInfo(game.camera, 32, 32);
        if (this.mushroom) {
            game.debug.body(this.mushroom);
        }
        this.walls.forEach(function (a) {
            game.debug.body(a);
        }, this);
        this.flagPole.forEach(function (a) {
            game.debug.body(a);
        }, this);
        // this.flags.forEach(function (a) {
        //     game.debug.body(a);
        // }, this);
        // console.log(this.goombas);
        // game.debug.spriteInfo(this.mario.sprite, 32, 32);
        // game.debug.body(this.mario.sprite);
        // game.debug.body(this.koopa.sprite);
        // game.debug.bodyInfo(this.koopa.sprite, 16, 32);
        // game.debug.bodyInfo(this.goombas.children[5], 16, 128);
        // game.debug.bodyInfo(this.walls.children[0], 16, 32);
        // game.debug.bodyInfo(this.goombas.children[0], 16, 32);
    }
}