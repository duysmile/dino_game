import Phaser from "phaser";

export default class Typewriter extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {

    }

    create() {
        this.label = this.add.text(100, 100, '').setWordWrapWidth(500);
        this.typewriteTextWrapped("Xin chào anh em thiện lành, chúng mình hoàn thành đươc một phần nghìn của game rồi nè!");
    }

    typewriteText(text) {
        const length = text.length;

        let i = 0;
        this.time.addEvent({
            callback: () => {
                this.label.text += text[i];
                i++;
            },
            repeat: length - 1,
            delay: 50,
        });
    }

    typewriteTextWrapped(text) {
        const lines = this.label.getWrappedText(text);
        const wrappedText = lines.join('\n');

        this.typewriteText(wrappedText);
    }
}
