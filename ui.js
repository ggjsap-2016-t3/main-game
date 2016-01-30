var UI = Class.create({
    initialize: function(core_ref, robo_ref){
        this.fogSprite = new Sprite(1024, 1024);
        this.fogSprite.image = core_ref.assets["./resources/fog.png"];
        this.fogSprite.x = -512+CELL_LENGTH/2+32;
        this.fogSprite.y = -512+CELL_LENGTH/2+32;
        core_ref.rootScene.addChild(this.fogSprite);
        this.fogSprite.addEventListener('enterframe', function() {
           this.x = -512+CELL_LENGTH/2 + robo_ref.sprite.x;
           this.y = -512+CELL_LENGTH/2 + robo_ref.sprite.y;
        });


        this.digitSprites = [new Sprite(16, 16), new Sprite(16, 16)];
        this.digitSprites[0].image = core_ref.assets["./resources/number.png"];
        this.digitSprites[1].image = core_ref.assets["./resources/number.png"];

        this.digitSprites[0].x = CELL_LENGTH*5.5;
        this.digitSprites[0].y = CELL_LENGTH;

        this.digitSprites[1].x = CELL_LENGTH*5.5+CELL_LENGTH/2;
        this.digitSprites[1].y = CELL_LENGTH;

        // for (var i=0; i < this.digitSprites; ++i) {
        //     this.digitSprites[i].addEventListener('enterframe', function() {
        //         // var digits = [0, 0];
        //         // digits[0] = robo_ref.left()/10;
        //         // digits[1] = robo_ref.left()%10;
        //         // this.frame = digits[i];
        //         this.frame = 2;
        //     });
        // }

        this.digitSprites[0].addEventListener('enterframe', function() {
            digit = robo_ref.left()/10;
            this.frame = digit;
        });

        this.digitSprites[1].addEventListener('enterframe', function() {
            digit = robo_ref.left()%10;
            this.frame = digit;
        });
        core_ref.rootScene.addChild(this.digitSprites[0]);
        core_ref.rootScene.addChild(this.digitSprites[1]);

        this.batteryFontSprite = new Sprite(56*2, 8*2);
        this.batteryFontSprite.image = core_ref.assets["./resources/batteryfont.png"];
        this.batteryFontSprite.x = CELL_LENGTH;
        this.batteryFontSprite.y = CELL_LENGTH;
        core_ref.rootScene.addChild(this.batteryFontSprite);

    }
});
