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
    core.preload("./resources/gameclear.png");
    core.preload("./resources/gameover.png");
    core.preload("./resources/ggj16_ending.ogg");
    core.preload("./resources/getitem.mp3");
    core.preload("./resources/gameover.mp3");
    core.preload("./resources/enemy.png");
    core.preload("./resources/ggj16_se_hit.ogg");
    core.preload("./resources/staff.png");
    core.preload("./resources/score.png");

    core.keybind('H'.charCodeAt(0), 'left');
    core.keybind('J'.charCodeAt(0), 'down');
    core.keybind('K'.charCodeAt(0), 'up');
    core.keybind('L'.charCodeAt(0), 'right');

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
        var items = new Array();
        var enemys = new Array();

        for (i=0; i<2; i++){
            items.push(new Item(1, core, map, robo, 3));
            items.push(new Item(1, core, map, robo, 4));
            items.push(new Item(1, core, map, robo, 5));
            items.push(new Item(1, core, map, robo, 6));
        }
        for (i=0; i<2; i++){
            items.push(new Item(2, core, map, robo, 3));
            items.push(new Item(2, core, map, robo, 4));
            items.push(new Item(2, core, map, robo, 5));
            items.push(new Item(2, core, map, robo, 6));
        }
        for (i=0; i<4; i++){
            enemys.push(new Enemy(7, 4, core, map, robo));
        }

        rootSearch(map);
        var ui = new UI(core, robo);
    };
    core.start();
};
