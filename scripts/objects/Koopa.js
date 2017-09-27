var Koopa = function (x, y, game) {

    this.sprite = game.add.sprite(x, y-4, 'enemies', 'koopa_01');
    this.sprite.animations.add('walk', Phaser.Animation.generateFrameNames('koopa_', 0, 2, '', 2), 30, true);
    this.sprite.animations.play('walk', 2, true);
    this.sprite.anchor.setTo(0.5);
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.sprite.body.allowGravity = false;
    //	this.sprite.body.immovable = true;
    this.sprite.body.velocity.x = -30;
    this.sprite.body.bounce.x = 1;
}