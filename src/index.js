import Phaser from 'phaser';
import AtlasImg from './assets/atlas.png';
import Atlas from './assets/atlas.json';
import Typewriter from './typewriter';
import BagScene from './bag';
import Pokemon from './pokemon';

import ScalePlugin from 'phaser3-rex-plugins/plugins/scale-plugin.js';
import Jump from './jump';

const PLAYER = "player";
class MyGame extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.atlas(PLAYER, AtlasImg, Atlas);
        // this.load.spritesheet(PLAYER, AtlasImg, {
        //     frameWidth: 32,
        //     frameHeight: 42,
        // });
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player = this.physics.add.sprite(100, 100, PLAYER, "player-front")
            .setBounce(0.2)
            .setCollideWorldBounds(true);

        const anims = this.anims;
        anims.create({
            key: "misa-left-walk",
            frames: anims.generateFrameNames("atlas", { prefix: "misa-left-walk.", start: 0, end: 3, zeroPad: 3 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "misa-right-walk",
            frames: anims.generateFrameNames("atlas", { prefix: "misa-right-walk.", start: 0, end: 3, zeroPad: 3 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "misa-front-walk",
            frames: anims.generateFrameNames("atlas", { prefix: "misa-front-walk.", start: 0, end: 3, zeroPad: 3 }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: "misa-back-walk",
            frames: anims.generateFrameNames("atlas", { prefix: "misa-back-walk.", start: 0, end: 3, zeroPad: 3 }),
            frameRate: 10,
            repeat: -1
        });

    }

    update() {

        let speed = 175;
        const prevVelocity = this.player.body.velocity.clone();
        let isMoving = false;

        if (this.cursors.space.isDown) {
            speed += 75;
        }

        this.player.body.setVelocity(0);
        if (this.cursors.left.isDown) {
            isMoving = true;
            this.player.body.setVelocityX(-speed);
            this.player.anims.play("left-walk", true);
        } else if (this.cursors.right.isDown) {
            isMoving = true;
            this.player.body.setVelocityX(speed);
            this.player.anims.play("right-walk", true);
        } else if (this.cursors.up.isDown) {
            isMoving = true;
            this.player.body.setVelocityY(-speed);
            this.player.anims.play("back-walk", true);
        } else if (this.cursors.down.isDown) {
            isMoving = true;
            this.player.body.setVelocityY(speed);
            this.player.anims.play("front-walk", true);
        }

        if (!isMoving) {
            this.player.anims.stop();

            if (prevVelocity.x < 0) this.player.setTexture(PLAYER, "player-left");
            else if (prevVelocity.x > 0) this.player.setTexture(PLAYER, "player-right");
            else if (prevVelocity.y < 0) this.player.setTexture(PLAYER, "player-back");
            else if (prevVelocity.y > 0) this.player.setTexture(PLAYER, "player-front");
        }

    }

}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Jump,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    plugins: {
        global: [{
            key: 'rexScale',
            plugin: ScalePlugin,
            start: true
        }]
    },
};

const game = new Phaser.Game(config);
