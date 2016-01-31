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

            if (this.left == 0) {
                gameFinishScene.backgroundColor = 'black';
                gameOverSprite.x = CELL_LENGTH*5.5;
                gameOverSprite.y = CELL_LENGTH*6;
                gameFinishScene.addChild(gameOverSprite);

                var replayButton = new Entity();
                replayButton.width = CELL_LENGTH * 2;
                replayButton.height = CELL_LENGTH * 0.8;
                replayButton.x = CELL_LENGTH * 7;
                replayButton.y = CELL_LENGTH * 12;
                replayButton._element = document.createElement('input');
                replayButton._element.id = 'replay';
                replayButton._element.type = 'image';
                replayButton._element.accesskey = "r";
                replayButton._element.src = "./resources/replay.png";
                replayButton._element.addEventListener('click', function() {
                    window.location.href = './index.html';
                });
                gameFinishScene.addChild(replayButton);

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

                function cookieLoad(){
                    var retCookie = new Array();
                    var allcookies = document.cookie;
                    if (allcookies!=''){
                        var cokies = allcookies.split(';');
                        for (i=0; i<cookies.length; i++){
                            var cookie = cookies[i].split('=');
                            retCookie[cookie[0]] = decodeURIComponent(cookie[1]);
                        }
                    }
                    return retCookie;
                }
                var userName = cookieLoad["userName"];

                var unameInput = new Entity();
                unameInput.width = CELL_LENGTH * 4;
                unameInput.height = CELL_LENGTH * 0.8;
                unameInput.x = CELL_LENGTH * 6;
                unameInput.y = CELL_LENGTH * 13;
                unameInput._element = document.createElement('input');
                unameInput._element.type = 'text';
                unameInput._element.id = 'uname';
                unameInput._element.placeholder = cookieLoad["userName"] || "YOUR NAME";

                var unameSendButton = new Entity();
                unameSendButton.width = CELL_LENGTH * 2;
                unameSendButton.height = CELL_LENGTH * 0.8;
                unameSendButton.x = CELL_LENGTH * 7;
                unameSendButton.y = CELL_LENGTH * 14;
                unameSendButton._element = document.createElement('input');
                unameSendButton._element.id = 'uname-send';
                unameSendButton._element.type = 'image';
                unameSendButton._element.src = '/resources/ok.png';

                var left = this.left;
                unameSendButton._element.addEventListener('click', function() {
                    var uname = document.getElementById("uname").value;
                    sendRank(uname, left);
                    document.getElementById('uname').remove();
                    document.getElementById('uname-send').remove();
                    setTimeout(function(){
                        window.location.href = "/ranking";
                    }, 1000);
                });

                gameFinishScene.addChild(unameInput);
                gameFinishScene.addChild(unameSendButton);

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
