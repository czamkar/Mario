var PrizeBox = function (game) {
    this.listPrizeBox = [{
            x: 256,
            y: 144
        },
        {
            x: 336,
            y: 144
        },
        {
            x: 368,
            y: 144
        },
        {
            x: 352,
            y: 80
        },
        {
            x: 1024,
            y: 128
        },
        {
            x: 1248,
            y: 144
        },
        {
            x: 1504,
            y: 144
        },
        {
            x: 1504,
            y: 80
        },
        {
            x: 1616,
            y: 144
        },
        {
            x: 1696,
            y: 144
        },
        {
            x: 1744,
            y: 144
        },
        {
            x: 1792,
            y: 144
        },
        {
            x: 1744,
            y: 80
        },
        {
            x: 2080,
            y: 80
        },
        {
            x: 2064,
            y: 80
        },
        {
            x: 2720,
            y: 144
        }

    ];
}
PrizeBox.prototype.createPrizeBox = function () {
    for (var index = 0; index < this.listPrizeBox.length; index++) {
        var box = game.add.tileSprite(this.listPrizeBox[index].x, this.listPrizeBox[index].y, 16, 16, 'mapElement', 'prize_box_01');

        box.animations.add('animateBox', Phaser.Animation.generateFrameNames('prize_box_0', 0, 3, '', 1), 30, true);
        box.animations.play('animateBox', 3, true);
        if(game.state.states.Play.PrizeBoxGroup)
        {
            game.physics.enable(box, Phaser.Physics.ARCADE);
            box.body.immovable = true;
            box.body.allowGravity  = false;
        game.state.states.Play.PrizeBoxGroup.add(box);
        }
    }
}