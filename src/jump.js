import Phaser from "phaser";

import JumpImg from "./assets/jump.png";
import JumpJson from "./assets/jump.json";

export default class Jump extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image("tiles", JumpImg);
        this.load.tilemapTiledJSON("map", JumpJson);
    }

    create() {
        const map = this.make.tilemap({ key: "map" });
        const tiles = map.addTilesetImage("0x72-industrial-tileset-32px-extruded", "tiles");

        map.createLayer("Background", tiles);
        this.groundLayer = map.createLayer("Ground", tiles);
        map.createLayer("Foreground", tiles);

        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Set up the arrows to control the camera
        const cursors = this.input.keyboard.createCursorKeys();
        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.5
        };

        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
        // Limit the camera to the map size
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.marker = this.add.graphics();
        this.marker.lineStyle(5, 0xffffff, 1);
        this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
        this.marker.lineStyle(3, 0xff4f78, 1);
        this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);

        // Help text that has a "fixed" position on the screen
        this.add.text(
            16,
            16,
            "Arrow keys to scroll\nLeft-click to draw tiles\nShift + left-click to erase",
            {
                font: "18px monospace",
                fill: "#000000",
                padding: {x:20, y:10},
                backgroundColor: "#ffffff",
            },
        ).setScrollFactor(0);
    }

    update(time, delta) {
        this.controls.update(delta);

        // Convert the mouse position to world position within the camera
        const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

        // Place the marker in world space, but snap it to the tile grid. If we convert world -> tile and
        // then tile -> world, we end up with the position of the tile under the pointer
        const pointerTileXY = this.groundLayer.worldToTileXY(worldPoint.x, worldPoint.y);
        const snappedWorldPoint = this.groundLayer.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);
        this.marker.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);

        // Draw or erase tiles (only within the groundLayer)
        if (this.input.manager.activePointer.isDown) {
            if (this.shiftKey.isDown) {
                this.groundLayer.removeTileAtWorldXY(worldPoint.x, worldPoint.y);
            } else {
                this.groundLayer.putTileAtWorldXY(353, worldPoint.x, worldPoint.y);
            }
        }
    }
}
