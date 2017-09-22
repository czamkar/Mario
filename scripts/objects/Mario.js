var Mario = function (x, y, game) {

    this.sprite = game.add.sprite(x, y, 'sMario', 'mario_idle');
    this.sprite.anchor.setTo(0.5);

    

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    game.camera.follow(this.sprite);

    this.cursors = game.input.keyboard.createCursorKeys();
    
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.bounce.y = 0.2;
}
Mario.prototype.controls = function(){
   
    if (this.cursors.right.isDown) {
        this.sprite.body.velocity.x = 100;
    } else if (this.cursors.left.isDown) {
        this.sprite.body.velocity.x = -100;
    }  else {
        this.sprite.body.velocity.x = 0;
    }
}