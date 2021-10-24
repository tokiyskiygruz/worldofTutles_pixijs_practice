PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const app = new PIXI.Application({
    width: 544,
    height: 320,
    backgroundColor: 0x000000,
});

const tileSize = 16
// const SCALE = 2

let map = {
    width: 17,
    height: 10,
    tiles: [
        21, 21, 21, 21, 21, 16, 21, 21, 21, 21,16, 21, 21, 21, 21, 21, 21,
        21, 21, 21, 21, 21, 16, 21, 21, 21, 21,16, 21, 21, 21, 21, 21, 21,
        21, 21, 21, 21, 16, 21, 21, 21, 21, 21,21, 16, 21, 21, 21, 21, 21,
        16, 16, 16, 16, 21, 21, 21, 21, 21, 21,21, 21, 16, 16, 16, 16, 16,
        21, 21, 21, 21, 21, 21, 21, 41, 41, 21,21, 21, 21, 21, 21, 21, 21,
        21, 21, 21, 21, 21, 21, 21, 41, 41, 21,21, 21, 21, 21, 21, 21, 21,
        16, 16, 16, 16, 21, 21, 21, 21, 21, 21,21, 21, 16, 16, 16, 16, 16,
        21, 21, 21, 21, 16, 21, 21, 21, 21, 21,21, 16, 21, 21, 21, 21, 21,
        21, 21, 21, 21, 21, 16, 21, 21, 21, 21,16, 21, 21, 21, 21, 21, 21,
        21, 21, 21, 21, 21, 16, 21, 21, 21, 21,16, 21, 21, 21, 21, 21, 21,
    ],
    collision: [
        1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
        0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
        0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
    ]
}
function testCollision(WorldX, WorldY) {
    let mapX = Math.floor(WorldX / 32)
    let mapY = Math.floor(WorldY / 32)
    return map.collision[mapY * map.width + mapX]
}
class Keyboard {
    constructor () {
      this.pressed = {};
    }
    
    watch (el) {
      el.addEventListener('keydown', (e) => {
        console.log(e.key)
        this.pressed[e.key] = true;
      });
      el.addEventListener('keyup', (e) => {
        this.pressed[e.key] = false;
      });
    }
}
  
document.body.appendChild( app.view );
app.view.setAttribute('tabindex', 0);
app.loader
    .add('tileset','assets/TankSprite.png')
    .add('bulletSprite', 'assets/bullet.png')
    .add('playerTankUp','assets/player_tank/tankup.png')
    .add('playerTankRight','assets/player_tank/tankright.png')
    .add('playerTankDown','assets/player_tank/tankdown.png')
    .add('playerTankLeft','assets/player_tank/tankleft.png')
    .load((loader, resources) => {
        let kb = new Keyboard();
        kb.watch(app.view);

        
        let tileTextures = [];
        let spriteWidth = 400
        let spriteHeight = 256
        let width = spriteWidth / tileSize
        let height = spriteHeight / tileSize
        for (let i=0; i < width * height; i++ ) {
            let x = i % width;
            let y = Math.floor(i / width)
            tileTextures[i] = new PIXI.Texture(
                resources.tileset.texture,
                new PIXI.Rectangle(x * tileSize, y * tileSize, tileSize, tileSize)
            );
        }

        let characterFrames = [
            new PIXI.Texture(resources.playerTankUp.texture), 
            new PIXI.Texture(resources.playerTankRight.texture), 
            new PIXI.Texture(resources.playerTankDown.texture),
            new PIXI.Texture(resources.playerTankLeft.texture), 
        ]
        let bulletImg = new PIXI.Texture(resources.bulletSprite.texture)
        const player = new PIXI.Sprite(characterFrames[0]);
        player.height = 32
        player.width = 32

        let background = new PIXI.Container()
        for (let y = 0; y < map.width; y++) {
            for(let x = 0; x < map.width; x++){
                let tile = map.tiles[y * map.width + x];
                let sprite = new PIXI.Sprite(tileTextures[tile]);
                sprite.x = x * tileSize
                sprite.y = y * tileSize
                background.addChild(sprite);
            }
        }

        let bullets = []
        function createBullet () {
            let bullet = new PIXI.Sprite(bulletImg)
            bullet.anchor.set(0.5)
            if (player.texture == characterFrames[0]) {
                bullet.x = character.x + 15.5
                bullet.y = character.y - 6.5
            }
            if (player.texture == characterFrames[1]) {
                bullet.x = character.x + 38
                bullet.y = character.y + 16
                bullet.rotation = 8
            }
            if (player.texture == characterFrames[2]) {
                bullet.x = character.x + 15.5
                bullet.y = character.y + 38
                bullet.rotation = 9.5
            }
            if (player.texture == characterFrames[3]) {
                bullet.x = character.x - 7
                bullet.y = character.y + 17
                bullet.rotation = -8
            }
            bullet.speed = 2
            app.stage.addChild(bullet)
            bullets.push(bullet)
            return bullet
        }

        app.stage.addChild(background)
        app.stage.addChild(player)

        background.scale.x = 2
        background.scale.y = 2
        let character = {
            x: 238, y: 270,
            vx: 0, vy: 0,
        }
        app.ticker.add(() => {
            player.x = character.x;
            player.y = character.y;

            if (kb.pressed.ArrowUp) {
                console.log(character)
                if (testCollision(character.x , character.y -2 ) && testCollision(character.x + player.width , character.y - 2)) 
                character.y -= 2
                player.texture = characterFrames[0]
            }
            if (kb.pressed.ArrowRight) {
                if (testCollision(character.x + 2 + player.width, character.y + player.height) && testCollision(character.x + 2 + player.width, character.y)) 
                character.x += 2
                player.texture = characterFrames[1]
            }
            if (kb.pressed.ArrowLeft) {
                if (testCollision(character.x - 2, character.y + player.height) && testCollision(character.x - 2, character.y))
                character.x -= 2
                player.texture = characterFrames[3]
            }
            if (kb.pressed.ArrowDown) {
                if (testCollision(character.x, character.y + 2 + player.height) && testCollision(character.x + player.width, character.y + 2 + player.height)) 
                character.y += 2
                player.texture = characterFrames[2]
            }
            if (kb.pressed.f) {
                createBullet()
            }

            for(let b=bullets.length-1; b>=0;b--){
                if (bullets[b].rotation == -8) {
                    bullets[b].position.x -= 2
                    if (!testCollision(bullets[b].position.x -2 , bullets[b].position.y)) {
                        bullets[b].dead = true
                    }
                }
                if (bullets[b].rotation == 9.5) {
                    bullets[b].position.y += 2
                    if (!testCollision(bullets[b].position.x, bullets[b].position.y + 2)) {
                        bullets[b].dead = true
                    }
                }
                if (bullets[b].rotation == 8) {
                    bullets[b].position.x += 2
                    if (!testCollision(bullets[b].position.x + 2 , bullets[b].position.y)) {
                        bullets[b].dead = true
                    }
                }
                if (bullets[b].rotation == 0) {
                    bullets[b].position.y -= 2
                    if (!testCollision(bullets[b].position.x , bullets[b].position.y - 2)) {
                        bullets[b].dead = true
                    }
                }
            }
            for (let b = 0; b < bullets.length; b++) {
                if (bullets[b].dead) {
                    app.stage.removeChild(bullets[b])
                }
            }
        });
})



