import Phaser from "phaser";
import DialogPlugin from "./plugins/dialog";

export default class Typewriter extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() { }

    create() {
        this.dialogModalPlugin = this.plugins.install('dialogModal', DialogPlugin, true);

        this.dialogModalPlugin.run();
        this.dialogModalPlugin.setText("AETL studio chính thức ra mắt và đạt được doanh thu hàng nghìn tỉ đồng từ game đầu tay, LOCKED ROOM. AETL studio chính thức ra mắt và đạt được doanh thu hàng nghìn tỉ đồng từ game đầu tay, LOCKED ROOM. AETL studio chính thức ra mắt và đạt được doanh thu hàng nghìn tỉ đồng từ game đầu tay, LOCKED ROOM.", true);

        const { X, Z } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = this.input.keyboard.addKeys({
            x: X,
            z: Z,
        });

    }

    update() {
        const keys = this.keys;

        if (
            this.dialogModalPlugin.checkExist()
            && !this.dialogModalPlugin.checkRun()
            && keys.z.isDown
        ) {
            this.dialogModalPlugin.continueText();
        }
    }
}
