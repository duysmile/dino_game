import Phaser from "phaser";
import DialogPlugin from "./plugins/dialog";

export default class Typewriter extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {}

    create() {
        const dialogModalPlugin = this.plugins.install('dialogModal', DialogPlugin, true);

        dialogModalPlugin.run();
        dialogModalPlugin.setText("Hello world", true);
    }

    update() {}
}
