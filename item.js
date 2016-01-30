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
                    this.frame -= 1;
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
