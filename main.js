enchant();

var CELL_LENGTH = 32;

window.onload = function() {
    var core = new Core(350, 320);
    core.fps = 30;
    core.preload("./resources/robo.png");
    core.preload("./resources/map-tile.png");
    core.preload("./resources/number.png");
    core.preload("./resources/battery1.png");
    core.preload("./resources/battery2.png");
    core.preload("./resources/fog.png");

    core.onload = function() {
        var robo = new Sprite(32, 32);
        robo.image = core.assets["./resources/robo.png"];
        robo.x = CELL_LENGTH;
        robo.y = CELL_LENGTH;

        var left = 20;
        var leftLabel = new Label(left);
        leftLabel.x = 330;
        leftLabel.y = 10;

        robo.addEventListener('enterframe', function() {
            this.frame = this.age % 3;

            if (this.frame % 30 == 0) {
                if (core.input.right && !map.hitTest(this.x + CELL_LENGTH, this.y)) {
                    this.x += CELL_LENGTH;
                    left -= 1;
                }
                if (core.input.left && !map.hitTest(this.x - CELL_LENGTH, this.y)) {
                    this.x -= CELL_LENGTH;
                    left -= 1;
                }
                if (core.input.down && !map.hitTest(this.x, this.y + CELL_LENGTH)) {
                    this.y += CELL_LENGTH;
                    left -= 1;
                }
                if (core.input.up && !map.hitTest(this.x, this.y - CELL_LENGTH)) {
                    this.y -= CELL_LENGTH;
                    left -= 1;
                }
            }
            leftLabel.text = left;
            if (map.checkTile(this.x, this.y) == 3) {
                leftLabel.text = "成";
                core.stop();
            }
            if (left == 0) {
                leftLabel.text = "死";
                core.stop();
            }
        });

        var map = new Map(CELL_LENGTH, CELL_LENGTH); // Map(セルの高さ, セルの幅)
        map.image = core.assets['./resources/map-tile.png'];
        map.loadData(
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 2, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 3, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ]
        );
        map.collisionData =
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ]
        core.rootScene.addChild(map);
        core.rootScene.addChild(leftLabel);
        core.rootScene.addChild(robo);
    };
    core.start();
};

function sendRank(uname, stage, left){
    if (window.JSON){
        if (uname===undefined){
            uname = "test";
        }else if (uname==""){
            uname = "test";
        }
        if (stage===undefined){
            stage = 1;
        }
        if (left===undefined){
            left = 0;
        }
        var data = {
            user : uname,
            stage : stage,
            left : left
        };
        var jsonData = JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        var url = "/";
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send("result=" + jsonData);
        return true;
    }else{
        Console.log("JSON.stringify() is not supported.");
        return false;
    }
}
