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
    core.preload("./resources/batteryfont.png");

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
        var maze = mazeGenerator(15,15);
        maze[1][1] = 2;
        maze[13][13] = 3;
        map.loadData(maze);

        var collision = $.extend(true, {}, maze);
        collision[1][1] = 0;
        collision[13][13] = 0;
        map.collisionData = collision;

        core.rootScene.addChild(map);

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
            ps.search([1, 1], 15 * 15);

            // 結果インスタンス取得
            var result = ps.getResult();

            // 結果インスタンスを操作してデータを取得
            // result.hasPathData(終点座標); // 終点に到達できるかを判定する
            // result.getPathData(終点座標); // 終点に到達できるならその情報を返す
            // result.getStepIndexes(終点座標); // 終点に到達できるなら経路の座標マップを返す
            // return result.hasPathData(終点座標);
            // console.log(result.hasData);
            return result.hasPath([15 - 2, 15 - 2]);
        };
        console.log(getNumberOfSteps(map));

        // var ui = new UI(core, robo);
    };
    core.start();
};
