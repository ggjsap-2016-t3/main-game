enchant();

var CELL_LENGTH = 32;

window.onload = function() {
  var core = new Core(320, 320);
  core.fps = 30;
  core.preload("chara1.png");
  core.preload("map0.png");

  core.onload = function() {
    var bear = new Sprite(32, 32);
    bear.image = core.assets["chara1.png"];
    bear.x = CELL_LENGTH;
    bear.y = CELL_LENGTH;

    bear.addEventListener('enterframe', function() {
      this.frame = this.age % 3;

      if (this.frame % 30 == 0) {
        if (core.input.right && !map.hitTest(this.x + CELL_LENGTH, this.y)) this.x += CELL_LENGTH;
        if (core.input.left && !map.hitTest(this.x - CELL_LENGTH, this.y)) this.x -= CELL_LENGTH;
        if (core.input.down && !map.hitTest(this.x, this.y + CELL_LENGTH)) this.y += CELL_LENGTH;
        if (core.input.up && !map.hitTest(this.x, this.y - CELL_LENGTH)) this.y -= CELL_LENGTH;

        if (map.checkTile(this.x, this.y) == 14) core.stop;
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
    core.rootScene.addChild(bear);
  };
  core.start();
};
