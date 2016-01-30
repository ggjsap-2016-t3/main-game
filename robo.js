var Robo = Class.create({
    initialize: function(initialBattery, initialPositionX, initialPositionY, core_ref, map_ref){
        this.sprite = new Sprite(32, 32);
        this.sprite.image = core_ref.assets["./resources/robo.png"];
        this.sprite.x = initialPositionX;
        this.sprite.y = initialPositionY;
        this.sprite.left = initialBattery;

        this.sprite.addEventListener('enterframe', function() {
            this.frame = this.age % 3;

            if (core_ref.frame % 5 == 0) {
                if (core_ref.input.right && !map_ref.hitTest(this.x + CELL_LENGTH, this.y)) {
                    this.x += CELL_LENGTH;
                    this.left -= 1;
                }
                if (core_ref.input.left && !map_ref.hitTest(this.x - CELL_LENGTH, this.y)) {
                    this.x -= CELL_LENGTH;
                    this.left -= 1;
                }
                if (core_ref.input.down && !map_ref.hitTest(this.x, this.y + CELL_LENGTH)) {
                    this.y += CELL_LENGTH;
                    this.left -= 1;
                }
                if (core_ref.input.up && !map_ref.hitTest(this.x, this.y - CELL_LENGTH)) {
                    this.y -= CELL_LENGTH;
                    this.left -= 1;
                }
            }

            var gameFinishScene = new Scene();
            var gameClearSprite = new Sprite(160, 128);
            var gameOverSprite = new Sprite(160, 128);
            gameClearSprite.image = core_ref.assets["./resources/gameclear.png"];
            gameOverSprite.image = core_ref.assets["./resources/gameover.png"];

            if (this.left == 0) {
                gameFinishScene.backgroundColor = 'black';
                gameOverSprite.x = CELL_LENGTH*5.5;
                gameOverSprite.y = CELL_LENGTH*6;
                gameFinishScene.addChild(gameOverSprite);
                
                core_ref.assets["./resources/ggj16_ritual.ogg"].volume = 0;
                core_ref.assets["./resources/gameover.mp3"].play();
                core_ref.pushScene(gameFinishScene);
                core_ref.stop();
            }

            if (map_ref.checkTile(this.x, this.y) == 3) {
                gameFinishScene.backgroundColor = 'gray';
                gameClearSprite.x = CELL_LENGTH*5.5;
                gameClearSprite.y = CELL_LENGTH*6;
                gameClearSprite.frame = 1;
                gameFinishScene.addChild(gameClearSprite);

                core_ref.assets["./resources/ggj16_ritual.ogg"].volume = 0;
                core_ref.assets["./resources/ggj16_ending.ogg"].play();
                core_ref.assets["./resources/ggj16_ritual.ogg"].volume = 0;
                core_ref.pushScene(gameFinishScene);
                var uname = document.getElementById("uname").value;
                sendRank(uname, this.left);
                core_ref.stop();
            }
        });
        core_ref.rootScene.addChild(this.sprite);
    },

    left: function(){
        return this.sprite.left;
    }
});
