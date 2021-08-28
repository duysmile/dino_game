import Phaser from "phaser";

import JumpImg from "./assets/jump.png";
import JumpJson from "./assets/jump.json";
import PlayerImg from "./assets/player.png";
import SpikeImg from "./assets/spike.png";

import Player from "./player";
import MouseTileMarker from "./mouse-tile-marker";

export default class Jump extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image("spike", SpikeImg);
        this.load.image("tiles", JumpImg);
        this.load.tilemapTiledJSON("map", JumpJson);

        this.load.spritesheet("player", PlayerImg, {
            frameWidth: 32,
            frameHeight: 32,
            margin: 1,
            spacing: 2,
        });
    }

    create() {
        this.isPlayerDead = false;

        const map = this.make.tilemap({ key: "map" });
        const tiles = map.addTilesetImage("0x72-industrial-tileset-32px-extruded", "tiles");

        map.createLayer("Background", tiles);
        this.groundLayer = map.createLayer("Ground", tiles);
        map.createLayer("Foreground", tiles);

        const spawnPoint = map.findObject("Objects", obj => obj.name == "Spawn Point");

        this.player = new Player(this, spawnPoint.x, spawnPoint.y);

        this.groundLayer.setCollisionByProperty({ collides: true });
        this.physics.world.addCollider(this.player.sprite, this.groundLayer);

        this.spikeGroup = this.physics.add.staticGroup();
        this.groundLayer.forEachTile(tile => {
            if (tile.index == 77) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                const spike = this.spikeGroup.create(x, y, "spike");

                spike.rotation = tile.rotation;
                if (spike.angle == 0) {
                    spike.body.setSize(32, 6).setOffset(0, 26);
                } else if (spike.angle == -90) {
                    spike.body.setSize(6, 32).setOffset(26, 0);
                } else if (spike.angle == 90) {
                    spike.body.setSize(6, 32).setOffset(0, 0);
                }

                this.groundLayer.removeTileAt(tile.x, tile.y);
            }
        });

        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.marker = new MouseTileMarker(this, map);

        // const graphics = this.add
        //     .graphics()
        //     .setAlpha(0.75)
        //     .setDepth(20);
        // this.groundLayer.renderDebug(graphics, {
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        // });        // Help text that has a "fixed" position on the screen

        this.add.text(
            16,
            16,
            "Arrow keys to scroll\nLeft-click to draw tiles\nShift + left-click to erase",
            {
                font: "18px monospace",
                fill: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff",
            },
        ).setScrollFactor(0);
    }

    update(time, delta) {
        if (this.isPlayerDead) return;

        this.player.update();
        this.marker.update();

        // Draw or erase tiles (only within the groundLayer)
        const pointer = this.input.activePointer;
        const worldPoint = pointer.positionToCamera(this.cameras.main);
        if (pointer.isDown) {
            if (this.shiftKey.isDown) {
                this.groundLayer.removeTileAtWorldXY(worldPoint.x, worldPoint.y);
            } else {
                const tile = this.groundLayer.putTileAtWorldXY(6, worldPoint.x, worldPoint.y);
                tile.setCollision(true);
            }
        }

        if (
            this.player.sprite.y > this.groundLayer.height ||
            this.physics.world.overlap(this.player.sprite, this.spikeGroup)
        ) {
            this.isPlayerDead = true;

            const cam = this.cameras.main;
            cam.shake(100, 0.05);
            cam.fade(250, 0, 0, 0);

            this.player.freeze();
            this.marker.destroy();

            cam.once("camerafadeoutcomplete", () => {
                this.player.destroy();
                this.scene.restart();
            });
        }
    }
}
