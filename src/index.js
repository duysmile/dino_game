import Phaser from 'phaser';
import skyImg from './assets/sky.png';
import bombImg from './assets/bomb.png';
import dudeImg from './assets/Amelia_run_48x48.png';
import platformImg from './assets/platform.png';
import starImg from './assets/star.png';

import Camera from './camera';

const SKY = 'sky';
const BOMB = 'bomb';
const GROUND = 'ground';
const STAR = 'star';
const DUDE = 'dude';

class MyGame extends Phaser.Scene {
    constructor() {
        super();
        this.player = null;
        this.stars = null;
        this.score = 0;
        this.scoreText = '';
        this.bombs = null;
        this.gameOver = false;
    }

    preload() {
        this.load.image("tiles", "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/tilesets/super-mario-tiles.png");

        this.load.image(SKY, skyImg);
        this.load.image(BOMB, bombImg);
        this.load.image(GROUND, platformImg);
        this.load.image(STAR, starImg);
        this.load.spritesheet(DUDE, dudeImg, {
            frameWidth: 48,
            frameHeight: 96,
        });
    }

    create() {
        const level = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 2, 3, 0, 0, 0, 1, 2, 3, 0],
            [0, 5, 6, 7, 0, 0, 0, 5, 6, 7, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 14, 13, 14, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 14, 14, 14, 14, 14, 0, 0, 0, 15],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15],
            [35, 36, 37, 0, 11, 0, 0, 0, 15, 15, 15],
            [39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39]
        ];

        // When loading from an array, make sure to specify the tileWidth and tileHeight
        const map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
        const tiles = map.addTilesetImage("tiles");
        const layer = map.createLayer(0, tiles, 0, 0);

        // this.add.image(400, 300, SKY);

        const platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, GROUND).setScale(2).refreshBody();

        platforms.create(600, 400, GROUND);
        platforms.create(50, 250, GROUND);
        platforms.create(750, 220, GROUND);

        this.player = this.physics.add.sprite(100, 450, DUDE);

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(DUDE, { start: 12, end: 17 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: DUDE, frame: 23 }],
            frameRate: 20,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(DUDE, { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1,
        });

        this.player.body.setGravityY(300);
        this.physics.add.collider(this.player, platforms);

        this.stars = this.physics.add.group({
            key: STAR,
            repeat: 11,
            setXY: {
                x: 12,
                y: 0,
                stepX: 70,
            },
        });

        this.stars.children.iterate(child => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.stars, platforms);

        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000',
        });

        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBombs, null, this);
    }

    update() {
        const cursors = this.input.keyboard.createCursorKeys();

        if (cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-550);
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(child => {
                child.enableBody(true, child.x, 0, true, true);
            });

            const x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            const bomb = this.bombs.create(x, 16, BOMB);
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    hitBombs(player, bomb) {
        this.physics.pause();

        player.setTint(0xff0000);
        player.anims.play('turn');

        this.gameOver = true;
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Camera,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
};

const game = new Phaser.Game(config);
