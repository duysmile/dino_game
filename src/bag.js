import Phaser from "phaser";
import BagPlugin from "./plugins/bag";
import Bag from "./assets/bag.png";
import Key from "./assets/key.png";

export default class BagScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.bagPlugin = this.plugins.install('bag', BagPlugin, true);
        this.bagPlugin.preload(Bag);
        this.load.image("key", Key);
    }

    create() {
        this.bagPlugin.run();
        this.bagPlugin.addItem({
            image: "key",
            canCombine: false,
            activeFunc: () => {
                console.log('Run');
            },
        });
    }
}
