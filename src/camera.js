import Phaser from 'phaser';

export default class Camera extends Phaser.Scene {
    constructor() {
        super();
        this.controls = null;
    }

    preload() {
        this.load.image("tiles", "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/tilesets/catastrophi_tiles_16_blue.png");
        this.load.tilemapCSV("map", "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/tilemaps/catastrophi_level3.csv");
    }

    create() {
        const map = this.make.tilemap({
            key: 'map',
            tileWidth: 16,
            tileHeight: 16,
        });

        const tileSet = map.addTilesetImage('tiles');
        const layer = map.createLayer(0, tileSet, 0, 0);

        const camera = this.cameras.main;

        const cursors = this.input.keyboard.createCursorKeys();
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
            camera,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.5,
        });

        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.add.text(16, 16, "Arrow keys to scroll", {
            font: '18px monospace',
            fill: '#ffffff',
            padding: { x: 20, y: 10 },
            backgroundColor: '#000000',
        }).setScrollFactor(0);
    }

    update(time, delta) {
        this.controls.update(delta);
    }
}
