window.onload = function() {
    var core = new Core(512, 512);
    core.fps = 30;
    var resourcePath = "./resources"
    var assets =
        ["robo.png", "map-tile.png", "number.png", "battery1.png",
         "battery2.png", "fog.png", "ggj16_ritual.ogg", "batteryfont.png",
         "gameclear.png", "gameover.png", "ggj16_ending.ogg", "getitem.mp3",
         "gameover.mp3", "enemy.png"];
    for (i=0; i<assets.length; i++){
        console.log(resourcePath+"/"+assets[i]);
        core.preload(resourcePath+"/"+assets[i]);
    }
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

        var left = randomLeft();
        var leftLabel = new Label(left);
        leftLabel.x = 330;
        leftLabel.y = 10;

        var map = new Map(CELL_LENGTH, CELL_LENGTH); // Map(セルの高さ, セルの幅)
        map.image = core.assets['./resources/map-tile.png'];
        do{
            var maze = mazeGenerator(15,15);
            maze[1][1] = 2;
            maze[13][13] = 3;
            map.loadData(maze);

            var collision = $.extend(true, {}, maze);
            collision[1][1] = 0;
            collision[13][13] = 0;
            map.collisionData = collision;
        }while(!rootSearch(map));

        core.rootScene.addChild(map);

        var robo = new Robo(left, CELL_LENGTH, CELL_LENGTH, core, map);

        var item1 = new Item(1, core, map, robo);
        var item2 = new Item(2, core, map, robo);
        var item3 = new Item(1, core, map, robo);
        var item4 = new Item(2, core, map, robo);

        var enemy1 = new Enemy(7, 2, core, map, robo);
        var enemy2 = new Enemy(7, 2, core, map, robo);

        rootSearch(map);
        var ui = new UI(core, robo);
    };
    core.start();
};
