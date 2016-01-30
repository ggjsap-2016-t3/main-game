var Robo = Class.create({
    initialize: function(initialBattery, initialPositionX, initialPositionY, core_ref, map_ref){
        this.sprite = new Sprite(32, 32);
        this.sprite.image = core_ref.assets["./resources/robo.png"];
        this.sprite.x = initialPositionX;
        this.sprite.y = initialPositionY;
        this.sprite.left = initialBattery;
        this.sprite.cntHittedArrowKey = 0;
        this.sprite.hittedArrowKey = "";

        this.sprite.addEventListener('enterframe', function() {
            if (core_ref.frame % 3 == 0) {
                if (core_ref.input.up) {
                    if (this.cntHittedArrowKey % 2 == 0){
                        this.frame = 3 + 1;
                    } else if (this.cntHittedArrowKey % 2 == 1){
                        this.frame = 3 + 2;
                    }
                    this.hittedArrowKey = "up"
                    this.cntHittedArrowKey += 1;
                } else if (core_ref.input.down) {
                    if (this.cntHittedArrowKey % 2 == 0) {
                        this.frame = 0 + 1;
                    } else if (this.cntHittedArrowKey % 2 == 1) {
                        this.frame = 0 + 2;
                    }
                    this.hittedArrowKey = "down"
                    this.cntHittedArrowKey += 1;
                } else if (core_ref.input.left) {
                    if (this.cntHittedArrowKey % 2 == 0) {
                        this.frame = 6 + 1;
                    } else if (this.cntHittedArrowKey % 2 == 1) {
                        this.frame = 6 + 2;
                    }
                    this.hittedArrowKey = "left"
                    this.cntHittedArrowKey += 1;
                } else if (core_ref.input.right) {
                    if (this.cntHittedArrowKey % 2 == 0) {
                        this.frame = 9 + 1;
                    } else if (this.cntHittedArrowKey % 2 == 1) {
                        this.frame = 9 + 2;
                    }
                    this.hittedArrowKey = "right"
                    this.cntHittedArrowKey += 1;
                } else {
                    if (this.hittedArrowKey == "up"){
                        this.frame = 3;
                    } else if (this.hittedArrowKey == "down") {
                        this.frame = 0;
                    } else if (this.hittedArrowKey == "left") {
                        this.frame = 6;
                    } else if (this.hittedArrowKey == "right"){
                        this.frame = 9;
                    }
                }
            }

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
                core_ref.assets["./resources/gameover.mp3"].play();
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
