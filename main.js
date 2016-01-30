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

        var left = 20;
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

        var ui = new UI(core, robo);
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

function mazeGenerator(h, w){
    function shuffle(array){
        var n = array.length, t, i;
        while (n){
            i = Math.floor(Math.random() * n--);
            t = array[n];
            array[n] = array[i];
            array[i] = t;
        }
        return array;
    }
    function gen(y,x){
        var directions = [0, 1, 2, 3];
        directions = shuffle(directions);

        for (i=0; i<4; i++){
            var d = directions[i];
            switch (d){
            case 0:
                if (y-2 <= 0){
                    continue;
                }
                if (maze[y-2][x]!=0){
                    maze[y-2][x]=0;
                    maze[y-1][x]=0;
                    gen(y-2, x);
                }
                break;
            case 1:
                if (x+2 >= w-1){
                    continue;
                }
                if (maze[y][x+2]!=0){
                    maze[y][x+2]=0;
                    maze[y][x+1]=0;
                    gen(y, x+2);
                }
                break;
            case 2:
                if (y+2 >= h-1){
                    continue;
                }
                if (maze[y+2][x]!=0){
                    maze[y+2][x]=0;
                    maze[y+1][x]=0;
                    gen(y+2, x);
                }
                break;
            case 3:
                if (x-2 <= 0){
                    continue;
                }
                if (maze[y][x-2]!=0){
                    maze[y][x-2]=0;
                    maze[y][x-1]=0;
                    gen(y, x-2);
                }
                break;
            }
        }
    }

    if (h===undefined){
        h = 9;
    }
    if (w===undefined){
        w = 9;
    }
    var maze = new Array(h);
    for (i=0; i<h; i++){
        maze[i] = new Array(w);
        for (j=0; j<w; j++){
            maze[i][j] = 1;
        }
    }

    gen(1,1);
    gen(h-2, w-2);
    gen((h-1)/2+1,(w-1)/2+1);

    return maze;
}
