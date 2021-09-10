import Phaser from "phaser";
import BagPlugin from "./plugins/bag";
import { ACTION } from "./plugins/bag";
import Bag from "./assets/bag.png";
import Key from "./assets/key.png";
import Key2 from "./assets/key2.png";

export default class BagScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.bagPlugin = this.plugins.install('bag', BagPlugin, true);
        this.bagPlugin.preload(Bag);
        this.load.image("key", Key);
        this.load.image("key2", Key2);
    }

    create() {
        this.bagPlugin.run();
        this.bagPlugin.addItem({
            name: "Key",
            image: "key",
            actions: [
                {
                    name: ACTION.COMBINE,
                    handler: () => {
                        console.log('Combine');
                    },
                },
                {
                    name: ACTION.USE,
                    handler: () => {
                        console.log('Run');
                    },
                }
            ],
        });
        this.bagPlugin.addItem({
            name: "Another Key",
            image: "key2",
            actions: [
                {
                    name: ACTION.COMBINE,
                    handler: () => {
                        console.log('Combine');
                    },
                },
                {
                    name: ACTION.USE,
                    handler: () => {
                        console.log('Run');
                    },
                }
            ],
        });
        this.bagPlugin.addItem({
            name: "Another Key",
            image: "key2",
            canCombine: false,
            actions: [
                {
                    name: ACTION.USE,
                    handler: () => {
                        console.log('Run');
                    },
                }
            ],
        });

        const { X, Z, LEFT, RIGHT, UP, DOWN, ENTER, ESC } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = this.input.keyboard.addKeys({
            x: X,
            z: Z,
            up: UP,
            down: DOWN,
            left: LEFT,
            right: RIGHT,
            enter: ENTER,
            esc: ESC,
        });
    }

    update() {
        const keys = this.keys;

        this.bagPlugin.runEvents(keys);
    }
}
