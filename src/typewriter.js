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
        dialogModalPlugin.setText("AETL studio chính thức ra mắt và đạt được doanh thu hàng nghìn tỉ đồng từ game đầu tay, LOCKED ROOM. AETL studio chính thức ra mắt và đạt được doanh thu hàng nghìn tỉ đồng từ game đầu tay, LOCKED ROOM. AETL studio chính thức ra mắt và đạt được doanh thu hàng nghìn tỉ đồng từ game đầu tay, LOCKED ROOM. AETL studio chính thức ra mắt và đạt được doanh thu hàng nghìn tỉ đồng từ game đầu tay, LOCKED ROOM. AETL studio chính thức ra mắt và đạt được doanh thu hàng nghìn tỉ đồng từ game đầu tay, LOCKED ROOM.AETL studio chính thức ra mắt và đạt được doanh thu hàng nghìn tỉ đồng từ game đầu tay, LOCKED ROOM.AETL studio chính thức ra mắt và đạt được doanh thu hàng nghìn tỉ đồng từ game đầu tay, LOCKED ROOM.AETL studio chính thức ra mắt và đạt được doanh thu hàng nghìn tỉ đồng từ game đầu tay, LOCKED ROOM.AETL studio chính thức ra mắt và đạt được doanh thu hàng nghìn tỉ đồng từ game đầu tay, LOCKED ROOM", true);
    }

    update() {}
}
