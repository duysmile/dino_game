import Phaser from "phaser";
import Bag from "./assets/bag.png";

export default class BagScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image("bag", Bag);
    }

    create() {
        const image = this.add.image(740, 50, "bag").setInteractive();
        image.scale = 0.1;

        image.on("pointerdown", () => {
            if (!this.dialog) {
                const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
                const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

                this.dialog = this.add.rectangle(screenCenterX, screenCenterY, 600, 400, 0xcccccc);


                this.plugins.get('rexScale').popup(this.dialog, 500)
                    .once('complete', () => {

                    }, this);
            }
        })

        // this.input.on('pointerdown', () => {
        //     if (this.dialog && !this.isClickBag) {
        //         this.plugins.get('rexScale').scaleDownDestroy(this.dialog, 500)
        //             .once('complete', function () { console.log('scaleDownDestroy') })
        //         this.dialog = undefined;
        //     }
        // })

        // this.input.on('pointerdown', function (pointer) {
        //     if (obj) {
        //         this.plugins.get('rexScale').scaleDownDestroy(obj, 500)
        //             .once('complete', function () { console.log('scaleDownDestroy') })
        //         obj = undefined;
        //     } else {
        //         obj = this.add.rectangle(pointer.x, pointer.y, 200, 200, 0x00bcd4);
        //         this.plugins.get('rexScale').popup(obj, 1000)
        //             .once('complete', function () { console.log('popup') })
        //     }
        // }, this);
    }

    createDialog(x, y, onClick) {

    }
}
