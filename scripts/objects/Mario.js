var Mario = function (x, y, game) {

    this.sprite = game.add.sprite(x, y, 'sMario', 'mario_idle');
    this.sprite.animations.add('right', Phaser.Animation.generateFrameNames('mario_walk_', 0, 3, '', 2), 30, true);
    this.sprite.animations.add('jump', Phaser.Animation.generateFrameNames('mario_jump', 0, 3, '', 2), 30, true);
    //this.sprite.animations.add('sMario', Phaser.Animation.generateFrameNames('Bman_S_f', 0, 7, '', 2), 30, true);
    this.sprite.anchor.setTo(0.5);

    this.facing = "idle";

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    game.camera.follow(this.sprite);

    this.cursors = game.input.keyboard.createCursorKeys();

    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;

    // this.sprite.body.bounce.y = 0.2;
}
Mario.prototype.controls = function (value) {
    if (this.cursors.right.isDown) {
        this.sprite.body.velocity.x = 100;
        if (this.facing != 'right') {
            this.sprite.scale.x = 1;
            if(value != "jump")
            this.sprite.animations.play('right');
            this.facing = 'right';
        }
    } else if (this.cursors.left.isDown ) {
        this.sprite.body.velocity.x = -100;
        if (this.facing != 'left') {
            this.sprite.scale.x = -1;
            if(value != "jump")
            this.sprite.animations.play('right');

            this.facing = 'left';
        }
    } else {
        if (this.facing != 'idle') {
            this.sprite.animations.stop();
           
            this.sprite.body.velocity.x = 0;
        }
        if(value != "jump")
      this.sprite.frameName = "mario_idle";
        this.facing = 'idle';

    }
}