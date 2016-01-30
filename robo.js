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
            // leftLabel.text = left;
            // if (map.checkTile(this.x, this.y) == 3) {
            //     // leftLabel.text = "成";
            //     core.stop();
            // }

            var gameFinishScene = new Scene();
            gameFinishScene.backgroundColor = 'gray';
            var finishMessage = new Label();
            var gameClearSprite = new Sprite(160, 128);
            gameClearSprite.image = core_ref.assets["./resources/gameclear.png"];

            if (this.left == 0) {
                core_ref.assets["./resources/ggj16_ritual.ogg"].volume = 0;
                finishMessage.text = "Game Over...";
                finishMessage.x = 216;
                finishMessage.y = 256;
                finishMessage.color = 'red';
                gameFinishScene.addChild(finishMessage);
                core_ref.pushScene(gameFinishScene);
                core_ref.stop();
            }

            if (map_ref.checkTile(this.x, this.y) == 3) {
                gameClearSprite.x = CELL_LENGTH*5.5;
                gameClearSprite.y = CELL_LENGTH*6;
                gameClearSprite.frame = 1;
                gameFinishScene.addChild(gameClearSprite);

                core_ref.assets["./resources/ggj16_ritual.ogg"].volume = 0;
                core_ref.assets["./resources/ggj16_ending.ogg"].play();

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
