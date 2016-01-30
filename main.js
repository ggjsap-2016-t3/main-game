enchant();

var CELL_LENGTH = 32;

window.onload = function() {
  var core = new Core(350, 320);
  core.fps = 30;
  core.preload("chara1.png");
  core.preload("map0.png");

  core.onload = function() {
    var mob = Class.create(Sprite, {

      move: function(vec) {
        this.x += vec[0];
        this.y += vec[1];
      }

      getAround: function(map) {
        var [x, y] = this.getCoordinate();
        var around_cells = [];
        if (this.y > 0) {
          around_cells.push(map[x][y - 1]);
        }
        if (this.x > 0) {
          around_cells.push(maps[x - 1][y]);
        }
        if (this.x < maps[0].length() - 1) {
          around_cells.push(maps[x + 1][y]);
        }
        if (this.y < maps.length() - 1) {
          around_cells.push(maps[x][y + 1]);
        }
      }
    });

    var bear = new Sprite(32, 32);
    bear.image = core.assets["chara1.png"];
    bear.x = CELL_LENGTH;
    bear.y = CELL_LENGTH;

    var left = 20;
    var leftLabel = new Label(left);
    leftLabel.x = 330;
    leftLabel.y = 10;

    bear.addEventListener('enterframe', function() {
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

      if (map.checkTile(this.x, this.y) == 14) {
        leftLabel.text = "成";
        sendRank("user", 1, left);
        core.stop();
      }
      if (left == 0) {
        leftLabel.text = "死";
        core.stop();
      }
    });


    var map = new Map(CELL_LENGTH, CELL_LENGTH); // Map(セルの高さ, セルの幅)
    map.image = core.assets['map0.png'];
    map.loadData(
      [
        [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
        [7, 13, 0, 0, 0, 0, 0, 0, 0, 7],
        [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
        [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
        [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
        [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
        [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
        [7, 0, 0, 0, 0, 0, 0, 0, 0, 7],
        [7, 0, 0, 0, 0, 0, 0, 0, 14, 7],
        [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
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
    core.rootScene.addChild(bear);
  };
  core.start();
};

function sendRank(uname, stage, left){
    if (window.JSON){
        if (uname===undefined){
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
