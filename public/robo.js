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

            var gameFinishScene = new Scene();
            var gameClearSprite = new Sprite(160, 128);
            var gameOverSprite = new Sprite(160, 128);
            gameClearSprite.image = core_ref.assets["./resources/gameclear.png"];
            gameOverSprite.image = core_ref.assets["./resources/gameover.png"];
            var replayButton = new Entity();
                replayButton.width = CELL_LENGTH * 2;
                replayButton.height = CELL_LENGTH * 0.8;
                replayButton._element = document.createElement('input');
                replayButton._element.id = 'replay';
                replayButton._element.type = 'image';
                replayButton._element.accesskey = "r";
                replayButton._element.src = "./resources/replay.png";
                replayButton._element.addEventListener('click', function() {
                    document.getElementById('uname').remove();
                    document.getElementById('uname-send').remove();
                    document.getElementById('replay').remove();
                    window.location.href = './index.html';
                });

            if (this.left <= 0) {
                gameFinishScene.backgroundColor = 'black';
                gameOverSprite.x = CELL_LENGTH*5.5;
                gameOverSprite.y = CELL_LENGTH*6;
                gameFinishScene.addChild(gameOverSprite);

                replayButton.x = CELL_LENGTH * 7;
                replayButton.y = CELL_LENGTH * 12;
                gameFinishScene.addChild(replayButton);

                core_ref.assets["./resources/ggj16_ritual.ogg"].volume = 0;
                core_ref.assets["./resources/gameover.mp3"].play();
                core_ref.pushScene(gameFinishScene);
                core_ref.stop();
            }

            if (map_ref.checkTile(this.x, this.y) == 3) {
                var scoreSprite = new Sprite(40*2, 8*2);
                scoreSprite.image = core_ref.assets["./resources/score.png"];
                scoreSprite.x = CELL_LENGTH*6;
                scoreSprite.y = CELL_LENGTH;
                gameFinishScene.addChild(scoreSprite);

                var digitSprites = [new Sprite(16, 16), new Sprite(16, 16)];
                digitSprites[0].image = core_ref.assets["./resources/number.png"];
                digitSprites[1].image = core_ref.assets["./resources/number.png"];

                digitSprites[0].x = CELL_LENGTH*9;
                digitSprites[0].y = CELL_LENGTH;

                digitSprites[1].x = CELL_LENGTH*9+CELL_LENGTH/2;
                digitSprites[1].y = CELL_LENGTH;

                digitSprites[0].frame = this.left/10;
                digitSprites[1].frame = this.left%10;

                gameFinishScene.addChild(digitSprites[0]);
                gameFinishScene.addChild(digitSprites[1]);

                gameFinishScene.backgroundColor = 'gray';
                gameClearSprite.x = CELL_LENGTH*5.5;
                gameClearSprite.y = CELL_LENGTH*2.5;
                gameClearSprite.frame = 1;
                gameFinishScene.addChild(gameClearSprite);

                var staffSprite = new Sprite(87, 72);
                staffSprite.image = core_ref.assets["./resources/staff.png"];
                staffSprite.x = CELL_LENGTH*7;
                staffSprite.y = CELL_LENGTH*8.5;
                gameFinishScene.addChild(staffSprite);

                function cookieLoad(){
                    var cookies = document.cookie.replace(' ', '').split(';')
                    var userName;
                    $.each(cookies, function(i, cookie) {
                        if (cookie.split("=")[0] == "userName") {
                            userName = cookie.split("=")[1];
                        } else {
                            userName = "";
                        }
                    });
                    return userName;
                }
                var userName = cookieLoad();

                var unameInput = new Entity();
                unameInput.width = CELL_LENGTH * 4;
                unameInput.height = CELL_LENGTH * 0.8;
                unameInput.x = CELL_LENGTH * 6;
                unameInput.y = CELL_LENGTH * 11.5;
                unameInput._element = document.createElement('input');
                unameInput._element.type = 'text';
                unameInput._element.id = 'uname';
                unameInput._element.value = userName;
                unameInput._element.placeholder = "YOUR NAME";

                var unameSendButton = new Entity();
                unameSendButton.width = CELL_LENGTH * 2;
                unameSendButton.height = CELL_LENGTH * 0.8;
                unameSendButton.x = CELL_LENGTH * 7;
                unameSendButton.y = CELL_LENGTH * 13;
                unameSendButton._element = document.createElement('input');
                unameSendButton._element.id = 'uname-send';
                unameSendButton._element.type = 'image';
                unameSendButton._element.src = './resources/ok.png';

                var left = this.left;
                unameSendButton._element.addEventListener('click', function() {
                    var uname = document.getElementById("uname").value;
                    sendRank(uname, left);
                    document.getElementById('uname').remove();
                    document.getElementById('uname-send').remove();
                    document.getElementById('replay').remove();
                    setTimeout(function(){
                        window.location.href = "./ranking";
                    }, 1000);
                });
                replayButton.x = CELL_LENGTH * 7;
                replayButton.y = CELL_LENGTH * 14;

                gameFinishScene.addChild(unameInput);
                gameFinishScene.addChild(unameSendButton);
                gameFinishScene.addChild(replayButton);

                core_ref.assets["./resources/ggj16_ritual.ogg"].volume = 0;
                core_ref.assets["./resources/ggj16_ending.ogg"].play();
                core_ref.assets["./resources/ggj16_ritual.ogg"].volume = 0;
                core_ref.pushScene(gameFinishScene);

                core_ref.stop();
            }
        });
        core_ref.rootScene.addChild(this.sprite);
    },

    left: function(){
        return this.sprite.left;
    }
});
