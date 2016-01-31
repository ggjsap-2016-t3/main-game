var Enemy = Class.create({
    initialize: function(
        range, damage,
        core_ref, map_ref, robo_ref
    ){
        this.sprite = new Sprite(32, 32);
        this.sprite.image = core_ref.assets["./resources/enemy.png"];
        this.setPositionRandomly(map_ref);
        this.sprite.damage = damage;
        core_ref.rootScene.addChild(this.sprite);
        
        this.sprite.addEventListener('enterframe', function() {
            function roboDirectionY(robo, spriteY, range_){
                var dir = "none";
                if(
                        ( robo.sprite.y-spriteY ) * ( robo.sprite.y-spriteY )< range_*range_
                ){
                    if(spriteY<robo.sprite.y){
                        dir = "down";
                    }
                    if(robo.sprite.y<spriteY){
                        dir = "up";
                    }
                }
                return dir;

            }
            
            function roboDirectionX(robo, spriteX, range_){
                var dir = "none";
                if(
                        ( robo.sprite.x-spriteX ) * ( robo.sprite.x-spriteX )< range_*range_
                ){
                    if(spriteX<robo.sprite.x){
                        dir = "right";
                    }
                    if(robo.sprite.x<spriteX){
                        dir = "left";
                    }
                }
                return dir;
            }
            
            if (core_ref.frame % 10 == 0) {
                var moveVertically = false;
                if (
                    roboDirectionX(robo_ref, this.x, range*CELL_LENGTH)=="right" &&
                    !map_ref.hitTest(this.x + CELL_LENGTH, this.y)
                ){
                    this.x += CELL_LENGTH;
                    moveVertically = true;
                }
                else if(
                    roboDirectionX(robo_ref, this.x, range*CELL_LENGTH)=="left" &&
                    !map_ref.hitTest(this.x - CELL_LENGTH, this.y)
                ){
                    this.x -= CELL_LENGTH;
                    moveVertically = true;
                }

                if(
                    !moveVertically &&
                    roboDirectionY(robo_ref, this.y, range*CELL_LENGTH)=="down" &&
                    !map_ref.hitTest(this.x, this.y + CELL_LENGTH)
                ){
                    this.y += CELL_LENGTH;
                }
                else if(
                    !moveVertically &&
                    roboDirectionY(robo_ref, this.y, range*CELL_LENGTH)=="up" &&
                    !map_ref.hitTest(this.x, this.y - CELL_LENGTH)
                ){
                    this.y -= CELL_LENGTH;
                }
            }
           
            if (core_ref.frame % 10 == 0) {
                if(this.intersect(robo_ref.sprite)){
                    if(robo_ref.sprite.left>1){
                        robo_ref.sprite.left -= this.damage;
                        core_ref.assets["./resources/ggj16_se_hit.ogg"].play();
                    }
                }
            }
            
        });
    }, 
    
    setPositionRandomly: function(map){
        var isPlased = false;
        while (!isPlased) {
            this.sprite.x = CELL_LENGTH * Math.floor(Math.random()*15);
            this.sprite.y = CELL_LENGTH * Math.floor(Math.random()*15);
            if (map.collisionData[this.sprite.y/CELL_LENGTH][this.sprite.x/CELL_LENGTH] == 0) {
                isPlased = true;
            }
        }
    }
})
