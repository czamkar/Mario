var PlayState = function (game) {

}
PlayState.prototype = {

    create: function () {
        game.stage.backgroundColor = "#6888ff";
        this.map = new Map(game);
        this.PrizeBox = new PrizeBox(game);
        this.PrizeBoxGroup = game.add.group();  
        this.PrizeBox.createPrizeBox();
        this.labels = new Labels(game, this.map);
        this.mario = new Mario(30, 200, game);

        this.labels.time.text = "400";
        this.timeTotal = 400;
        this.time = game.time.create(false);
        this.time.loop(1000, this.updateCounter, this);
        this.time.start();
        console.log(this.map);
        this.map.mapLayers['collide'].debug = true;

        this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.timerJump = 0;

        game.physics.arcade.gravity.y = 250;
    },
    update: function () {
        game.physics.arcade.collide(this.mario.sprite, this.map.mapLayers['ground']);
        game.physics.arcade.collide(this.mario.sprite,  this.PrizeBoxGroup, this.d, null, this);
        game.physics.arcade.collide(this.mario.sprite, this.map.mapLayers['collide'], this.c, null, this);
       
        if (this.jumpButton.isDown && game.time.now > this.timerJump && this.mario.sprite.body.blocked.down) {
            this.mario.sprite.frameName = "mario_jump";
            this.mario.sprite.body.velocity.y = -150;
            this.timerJump = game.time.now + 750;
        }
        if(!this.mario.sprite.body.blocked.down){
            this.mario.sprite.frameName = "mario_jump";
        }else{
            this.mario.controls();
        }
    },
    d: function(a,b){
        console.log(b);
    },
    c: function (a, b) {
        console.log(this.map.map.getTile(b.x, b.y, this.map.mapLayers['collide']).worldX, this.map.map.getTile(b.x, b.y, this.map.mapLayers['collide']).worldY);
        console.log(this.map.map.getTile(b.x, b.y, this.map.mapLayers['collide']).index);
        if (this.map.map.getTile(b.x, b.y, this.map.mapLayers['collide']).index === 8) {
            if (a.body.blocked.up)
                this.map.map.removeTile(b.x, b.y, this.map.mapLayers['collide']);
        } else if(this.map.map.getTile(b.x, b.y, this.map.mapLayers['collide']).index === 43){
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