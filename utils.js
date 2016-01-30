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
