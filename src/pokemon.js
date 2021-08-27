import Phaser from 'phaser';

import MapImg from './assets/tuxmon-sample-32px-extruded.png';
import Map from './assets/test-map.json';

import AtlasImg from './assets/atlas.png';
import Atlas from './assets/atlas.json';

import Star from './assets/star.png';

let cursors;

export default class Pokemon extends Phaser.Scene {
    constructor() {
        super();
        this.controls = null;
    }

    preload() {
        this.load.image("tiles", MapImg);
        this.load.tilemapTiledJSON("map", Map);
        this.load.image("star", Star);

        // An atlas is a way to pack multiple images together into one texture. I'm using it to load all
        // the player animations (walking left, walking right, etc.) in one image. For more info see:
        //  https://labs.phaser.io/view.html?src=src/animation/texture%20atlas%20animation.js
        // If you don't use an atlas, you can do the same thing with a spritesheet, see:
        //  https://labs.phaser.io/view.html?src=src/animation/single%20sprite%20sheet.js
        this.load.atlas("atlas", AtlasImg, Atlas);
    }

    create() {
        const map = this.make.tilemap({
            key: 'map',
            // tileWidth: 16,
            // tileHeight: 16,
        });
        const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createLayer("Below Player", tileset, 0, 0);
        const worldLayer = map.createLayer("World", tileset, 0, 0);
        const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);

        const key = map.createFromObjects("item", { key: "star" });

        // worldLayer.setCollisionBetween(12, 44);
        worldLayer.setCollisionByProperty({ collides: true });

        aboveLayer.setDepth(10);

        const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
        const keyItem = map.findObject("item", obj => obj.name === "key");
        console.log(keyItem);

        this.player = this.physics.add
            .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
            .setSize(30, 40)
            .setOffset(0, 24);

        this.physics.add.collider(this.player, key);

        this.physics.add.collider(this.player, worldLayer);

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

        this.input.keyboard.once("keydown-D", event => {
            // Turn on physics debugging to show player's hitbox
            this.physics.world.createDebugGraphic();

            // Create worldLayer collision graphic above the player, but below the help text
            const graphics = this.add
                .graphics()
                .setAlpha(0.75)
                .setDepth(20);
            worldLayer.renderDebug(graphics, {
                tileColor: null, // Color of non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
            });
        });

        const camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        cursors = this.input.keyboard.createCursorKeys();
        this.add
            .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
                font: "18px monospace",
                fill: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff"
            })
            .setScrollFactor(0)
            .setDepth(30);

    }

    update(time, delta) {
        let speed = 175;
        const prevVelocity = this.player.body.velocity.clone();

        if (cursors.space.isDown) {
            speed = 350;
        }

        // Stop any previous movement from the last frame
        this.player.body.setVelocity(0);

        // Horizontal movement
        if (cursors.left.isDown) {
            this.player.body.setVelocityX(-speed);
        } else if (cursors.right.isDown) {
            this.player.body.setVelocityX(speed);
        }

        // Vertical movement
        if (cursors.up.isDown) {
            this.player.body.setVelocityY(-speed);
        } else if (cursors.down.isDown) {
            this.player.body.setVelocityY(speed);
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        this.player.body.velocity.normalize().scale(speed);

        // Update the animation last and give left/right animations precedence over up/down animations
        if (cursors.left.isDown) {
            this.player.anims.play("misa-left-walk", true);
        } else if (cursors.right.isDown) {
            this.player.anims.play("misa-right-walk", true);
        } else if (cursors.up.isDown) {
            this.player.anims.play("misa-back-walk", true);
        } else if (cursors.down.isDown) {
            this.player.anims.play("misa-front-walk", true);
        } else {
            this.player.anims.stop();

            // If we were moving, pick and idle frame to use
            if (prevVelocity.x < 0) this.player.setTexture("atlas", "misa-left");
            else if (prevVelocity.x > 0) this.player.setTexture("atlas", "misa-right");
            else if (prevVelocity.y < 0) this.player.setTexture("atlas", "misa-back");
            else if (prevVelocity.y > 0) this.player.setTexture("atlas", "misa-front");
        }
    }
}
