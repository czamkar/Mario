var Goomba = function (game) {
    this.goombaArray = [{
        x: 396,
        y: 200
    }, {
        x: 668,
        y: 200
    }, {
        x: 890,
        y: 200
    }, {
        x: 860,
        y: 200
    }, {
        x: 1360,
        y: 65
    }, {
        x: 1396,
        y: 65
    }, {
        x: 1576,
        y: 200
    }, {
        x: 1596,
        y: 200
    }, {
        x: 1830,
        y: 200
    }, {
        x: 1850,
        y: 200
    }, {
        x: 2050,
        y: 200
    }, {
        x: 2070,
        y: 200
    }, {
        x: 2820,
        y: 200
    }, {
        x: 2848,
        y: 200
    }]
}
Goomba.prototype.createGoomba = function () {
    for (var index = 0; index < this.goombaArray.length; index++) {
        this.sprite = game.add.sprite(this.goombaArray[index].x, this.goombaArray[index].y, 'enemies', 'goomba_01');
        this.sprite.animations.add('walk', Phaser.Animation.generateFrameNames('goomba_', 0, 2, '', 2), 30, true);
        this.sprite.animations.play('walk', 2, true);
        this.sprite.anchor.setTo(0.5);


        if (game.state.states.Play.goombas) {
            game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
            this.sprite.body.immovable = false;
            this.sprite.body.allowGravity = true;
            this.sprite.body.bounce.x = 1;
            this.sprite.body.maxVelocity.x = 30;
            game.state.states.Play.goombas.add(this.sprite);
        }
    }
}