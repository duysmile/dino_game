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

        const text = "AETL studio chính thức ra mắt và đạt được doanh thu hàng nghìn tỉ đồng từ game đầu tay, LOCKED ROOM. AETL studio chính thức ra mắt và đạt được doanh thu hàng nghìn tỉ đồng từ game đầu tay, LOCKED ROOM. AETL studio chính thức ra mắt và đạt được doanh thu hàng nghìn tỉ đồng từ game đầu tay, LOCKED ROOM.";
        const choices = [
            "OK ngon",
            "Not ok but ngon",
        ];
        this.dialogModalPlugin.setText(
            text,
            choices,
            true,
        );

        const { X, Z, UP, DOWN, ENTER } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = this.input.keyboard.addKeys({
            x: X,
            z: Z,
            up: UP,
            down: DOWN,
            enter: ENTER,
        });

    }

    update() {
        const keys = this.keys;

        this.dialogModalPlugin.runEvent(keys);

        if (keys.enter.isDown && !this.dialogModalPlugin.checkExist()) {
            console.log(this.dialogModalPlugin.getAnswer());
        }
    }
}
