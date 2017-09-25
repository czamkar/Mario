var Goomba = function (x, y,game) {

    this.sprite = game.add.sprite(x, y, 'enemies', 'goomba_01');
    this.sprite.animations.add('walk', Phaser.Animation.generateFrameNames('goomba_', 0, 2, '', 2), 30, true);
    this.sprite.animations.play('walk',2, true);
    this.sprite.anchor.setTo(0.5);
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    
    this.sprite.body.allowGravity  = false;
//	this.sprite.body.immovable = true;
    this.sprite.body.velocity.x = 50 ;
    this.sprite.body.bounce.x = 1;
}