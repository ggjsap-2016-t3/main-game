enchant();

var CELL_LENGTH = 32;

var Item = Class.create({
    initialize: function(level, core_ref, map_ref, robo_ref){
        this.level = level;

        this.sprite = new Sprite(32, 32);
        this.sprite.image = core_ref.assets["./resources/battery" + level + ".png"];
        this.setPositionRandomly(map_ref);
        core_ref.rootScene.addChild(this.sprite);
        this.sprite.addEventListener("enterframe", function(){
            if(this.frame == 0){
                if(this.intersect(robo_ref.sprite)){
                    this.frame += 1;
                    console.log(robo_ref.sprite.left);
                    robo_ref.sprite.left += level*4;

                    console.log(robo_ref.sprite.left);
                }
            }
        })
    },

    setPositionRandomly: function(map){
        var isPlased = false;
        while (!isPlased) {
            this.sprite.x = CELL_LENGTH * Math.floor(Math.random()*16);
            this.sprite.y = CELL_LENGTH * Math.floor(Math.random()*16);
            if (map.collisionData[this.sprite.y/CELL_LENGTH][this.sprite.x/CELL_LENGTH] == 0) {
                isPlased = true;
            }
        }
    }
});

var Robo = Class.create({
    initialize: function(initialBattery, initialPositionX, initialPositionY, core_ref, map_ref){
        this.sprite = new Sprite(32, 32);
        this.sprite.image = core_ref.assets["./resources/robo.png"];
        this.sprite.x = initialPositionX;
        this.sprite.y = initialPositionY;
        this.sprite.left = initialBattery;

        this.sprite.addEventListener('enterframe', function() {
            this.frame = this.age % 3;

            if (this.frame % 30 == 0) {
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
            gameFinishScene.backgroundColor = 'black';
            var finishMessage = new Label();

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
                finishMessage.text = "Game Clear!!";
                finishMessage.x = 216;
                finishMessage.y = 256;
                finishMessage.color = 'red';
                gameFinishScene.addChild(finishMessage);
                core_ref.pushScene(gameFinishScene);
                var uname = document.getElementById("uname");
                sendRank(uname, 1, left);
                core.stop();
            }
        });
        core_ref.rootScene.addChild(this.sprite);
    },

    left: function(){
        return this.sprite.left;
    }
})

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
    }
})

window.onload = function() {
    var core = new Core(512, 512);
    core.fps = 30;
    core.preload("./resources/robo.png");
    core.preload("./resources/map-tile.png");
    core.preload("./resources/number.png");
    core.preload("./resources/battery1.png");
    core.preload("./resources/battery2.png");
    core.preload("./resources/fog.png");
    core.preload("./resources/ggj16_ritual.ogg");

    core.onload = function() {
        if(core.assets["./resources/ggj16_ritual.ogg"].src){
            core.assets["./resources/ggj16_ritual.ogg"].play();
            core.assets["./resources/ggj16_ritual.ogg"].src.loop = true;
        }

        core.rootScene.onenterframe = function() {
            if(!core.assets["./resources/ggj16_ritual.ogg"].src){
                core.assets["./resources/ggj16_ritual.ogg"].play();
            }
        };

        // var robo = new Sprite(32, 32);
        // robo.image = core.assets["./resources/robo.png"];
        // robo.x = CELL_LENGTH;
        // robo.y = CELL_LENGTH;

        var left = 80;
        var leftLabel = new Label(left);
        leftLabel.x = 330;
        leftLabel.y = 10;


        var map = new Map(CELL_LENGTH, CELL_LENGTH); // Map(セルの高さ, セルの幅)
        map.image = core.assets['./resources/map-tile.png'];
        map.loadData(
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
                [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
                [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
                [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
                [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
                [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
                [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ]
        );

        map.collisionData = [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
                [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
                [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
                [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
                [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
                [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
                [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ];

        core.rootScene.addChild(map);
        core.rootScene.addChild(leftLabel);

        var robo = new Robo(20, CELL_LENGTH, CELL_LENGTH, core, map);

        var item1 = new Item(1, core, map, robo);
        var item2 = new Item(2, core, map, robo);
        var item3 = new Item(1, core, map, robo);
        var item4 = new Item(2, core, map, robo);

        var getNumberOfSteps = function(map) {
            // 二次元配列で表現されたあなたのゲームのマップデータ
            var yourSquares = map.collisionData;

            // インスタンス生成
            var ps = new PathSearcher();

            // あなたのマップデータを取り込み
            ps.load(yourSquares, function(collision){
                if (collision != 1) {
                    return false; // falseを返すと進入不可として認識される
                };
                return 1;
            });

            // 移動経路探索
            ps.search([1, 1], CELL_LENGTH * CELL_LENGTH);

            // 結果インスタンス取得
            var result = ps.getResult();

            // 結果インスタンスを操作してデータを取得
            // result.hasPathData(終点座標); // 終点に到達できるかを判定する
            // result.getPathData(終点座標); // 終点に到達できるならその情報を返す
            // result.getStepIndexes(終点座標); // 終点に到達できるなら経路の座標マップを返す
            // return result.hasPathData(終点座標);
            // console.log(result.hasData);
            return result.hasPath([CELL_LENGTH - 1, CELL_LENGTH - 1]);
        };
        console.log(getNumberOfSteps(map));

        // var ui = new UI(core, robo);
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
