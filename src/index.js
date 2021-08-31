import Phaser from 'phaser';
import AtlasImg from './assets/atlas.png';
import Atlas from './assets/atlas.json';
import Typewriter from './typewriter';
import BagScene from './bag';
import Pokemon from './pokemon';
import Jump from './jump';

import ScalePlugin from 'phaser3-rex-plugins/plugins/scale-plugin.js';
import DialogPlugin from './plugins/dialog';


const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Typewriter,
    backgroundColor: "#1d212d",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false,
        },
    },
    plugins: {
        global: [
            {
                key: 'rexScale',
                plugin: ScalePlugin,
                start: true
            },
        ]
    },
};

const game = new Phaser.Game(config);
