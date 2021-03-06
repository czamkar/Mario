var Mario = function (x, y, game) {
    this.sprite = game.add.sprite(x, y, 'mario', 'mario_idle_01');

    this.sprite.animations.add('walkSmall', Phaser.Animation.generateFrameNames('mario_walk_', 0, 3, '', 2), 30, true);
    this.sprite.animations.add('walkBig', Phaser.Animation.generateFrameNames('mario_big_walk_', 0, 3, '', 2), 30, true);
    this.sprite.animations.add('grow', ['mario_idle_01', 'mario_idle_01', 'mario_idle_02', 'mario_idle_01', 'mario_idle_02', 'mario_idle_02', 'mario_idle_01', 'mario_idle_02'], 15, false);

    this.sprite.anchor.setTo(0.5, 1);
    this.sprite.objectMario = this;
    this.size = false;
    this.alive = true;
    this.onFlag = false;
    this.facing = "idle";
    this.frozen = false;
    this.inviolable = false;
    this.anComplete = false;
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    game.camera.follow(this.sprite);

    this.cursors = game.input.keyboard.createCursorKeys();

    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;

    this.sprite.body.setSize(11, 16, 2, 0);

}
Mario.prototype.controls = function (value) {

    if (this.alive && !this.onFlag) {
        if (!this.frozen) {
            if (this.cursors.right.isDown) {
                this.sprite.body.velocity.x = 100;
                if (this.facing != 'right') {
                    this.sprite.scale.x = 1;
                    if (value != "jump") {
                        if (!this.size) {
                            this.sprite.frameName = "mario_walk_01";
                        } else {
                            this.sprite.frameName = "mario_big_walk_01";
                        }
                    }
                    if (!this.size) {
                        this.sprite.animations.play('walkSmall');
                    } else {
                        this.sprite.animations.play('walkBig');
                    }
                    this.facing = 'right';
                }
            } else if (this.cursors.left.isDown) {
                this.sprite.body.velocity.x = -100;
                if (this.facing != 'left') {
                    this.sprite.scale.x = -1;
                    if (value != "jump") {
                        if (!this.size) {
                            this.sprite.frameName = "mario_walk_01";
                        } else {
                            this.sprite.frameName = "mario_big_walk_01";
                        }
                    }
                    if (!this.size) {
                        this.sprite.animations.play('walkSmall');
                    } else {
                        this.sprite.animations.play('walkBig');
                    }

                    this.facing = 'left';
                }
            } else {
                if (this.facing != 'idle') {
                    this.sprite.animations.stop();
                    this.sprite.body.velocity.x = 0;
                }
                if (value != "jump") {
                    if (this.size) {
                        this.sprite.frameName = "mario_idle_02";
                    } else {
                        this.sprite.frameName = "mario_idle_01";
                    }
                }
                this.facing = 'idle';

            }
        } else {
            if (!this.anComplete) {
                this.growUp();
            }
        }
    }

}
Mario.prototype.growUp = function () {

    if (!this.size) {
        this.anComplete = true;

        this.sprite.frameName = "mario_idle_01";
        this.sprite.body.setSize(11, 32, 2, 0);
        this.sprite.body.allowGravity = false;
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        var anim = this.sprite.animations.play('grow');
        anim.delay = 100;
        anim.onComplete.add(animationStopped, this);
        anim.enableUpdate = true;
        anim.onComplete.add(animationStopped, this);

        function animationStopped(sprite, animation) {
            this.sprite.y -= 1;
            this.frozen = false;
            this.anComplete = false;
            this.sprite.body.allowGravity = true;
            this.sprite.frameName = "mario_idle_02";
        }

        this.size = true;
    } else {
        this.frozen = false;
        game.level.lives++;
    }
}
Mario.prototype.small = function () {
    this.frozen = true;
    this.anComplete = true;
    this.size = false;
    this.sprite.frameName = "mario_idle_02";
    this.sprite.body.setSize(11, 16, 2, 0);
    this.sprite.body.allowGravity = false;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    var anim = this.sprite.animations.play('grow');
    anim.delay = 100;
    anim.reverse = true;
    anim.onComplete.add(animationStopped, this);
    anim.enableUpdate = true;

    function animationStopped(sprite, animation) {
        this.sprite.y -= 1;
        this.frozen = false;
        this.anComplete = false;
        this.sprite.body.allowGravity = true;
        this.sprite.frameName = "mario_idle_01";
    }

}
Mario.prototype.die = function () {
    this.frozen = true;
    this.sprite.body.allowGravity = false;
    this.sprite.animations.stop();
    var tween = game.add.tween(this.sprite).to({
        y: [168, 260]
    }, 1000, Phaser.Easing.None, true);

}