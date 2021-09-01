import Phaser from "phaser";

export default class DialogPlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager);
    }

    run(opts) {
        if (!opts) {
            opts = {};
        }

        this.currentScene = this.game.scene.scenes[0];
        this.borderThickness = opts.borderThickness || 3;
        this.borderColor = opts.borderColor || 0x907748;
        this.borderAlpha = opts.borderAlpha || 1;
        this.windowAlpha = opts.windowAlpha || 0.8;
        this.windowColor = opts.windowColor || 0x303030;
        this.windowHeight = opts.windowHeight || 150;
        this.padding = opts.padding || 32;
        this.closeBtnColor = opts.closeBtnColor || 'darkgoldenrod';
        this.dialogSpeed = opts.dialogSpeed || 3;

        this.eventCounter = 0;
        this.visible = true;
        // this.text;
        // this.dialog;
        // this.graphics;
        // this.closeBtn;

        this._createWindow();
    }

    _getGameWidth() {
        return this.game.config.width;
    }

    _getGameHeight() {
        return this.game.config.height;
    }

    _calculateWindowDimensions(width, height) {
        const x = this.padding;
        const y = height - this.windowHeight - this.padding;
        const rectWidth = width - (this.padding * 2);
        const rectHeight = this.windowHeight;
        return {
            x, y, rectHeight, rectWidth,
        };
    }

    _createInnerWindow(x, y, rectWidth, rectHeight) {
        this.graphics.fillStyle(this.windowColor, this.windowAlpha);
        this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1);
    }

    _createOuterWindow(x, y, rectWidth, rectHeight) {
        this.graphics.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha);
        this.graphics.strokeRect(x, y, rectWidth, rectHeight);
    }

    _createCloseModalButton() {
        this.closeBtn = this.currentScene.make.text({
            x: this._getGameWidth() - this.padding - 14,
            y: this._getGameHeight() - this.windowHeight - this.padding + 3,
            text: 'X',
            style: {
                font: 'bold 12px Arial',
                fill: this.closeBtnColor,
            },
        });

        this.closeBtn.setInteractive();
        this.closeBtn.on('pointerover', () => {
            this.closeBtn.setTint(0xff0000);
        });

        this.closeBtn.on('pointerout', () => {
            this.closeBtn.clearTint();
        });

        this.closeBtn.on('pointerdown', () => {
            this.toggleWindow();
        });
    }

    _createCloseModalButtonBorder() {
        const x = this._getGameWidth() - this.padding - 20;
        const y = this._getGameHeight() - this.windowHeight - this.padding;

        this.graphics.strokeRect(x, y, 20, 20);
    }

    toggleWindow() {
        this.visible = !this.visible;
        if (this.timedEvent) this.timedEvent.remove();
        if (this.text) {
            this.text.visible = this.visible;
            this.text.destroy();
        }
        if (this.graphics) this.graphics.visible = this.visible;
        if (this.closeBtn) this.closeBtn.visible = this.visible;
    }

    setText(text, animate) {
        this.eventCounter = 0;
        this.dialog = text.split('');

        if (this.timedEvent) this.timedEvent.remove();

        let tempText = animate ? '' : text;

        this._setText(tempText);
        if (animate) {
            this.timedEvent = this.currentScene.time.addEvent({
                delay: 100 - this.dialogSpeed * 30,
                callback: this._animateText,
                callbackScope: this,
                loop: true,
            });
        }
    }

    _animateText() {
        this.eventCounter++;
        this.text.setText(this.text.text + this.dialog[this.eventCounter - 1]);
        console.log(this.text.getBounds().height);
        if (
            this.eventCounter === this.dialog.length
            || this.text.getBounds().height >= this.windowHeight - 25
        ) {
            this.timedEvent.remove();
        }
    }

    _setText(text) {
        if (this.text) this.text.destroy();

        const x = this.padding + 10;
        const y = this._getGameHeight() - this.windowHeight - this.padding + 10;

        this.text = this.currentScene.make.text({
            x,
            y,
            text,
            style: {
                font: "20px",
                wordWrap: {
                    width: this._getGameWidth() - this.padding * 2 - 25,
                },
            },
        });
    }

    _createWindow() {
        const gameWidth = this._getGameWidth();
        const gameHeight = this._getGameHeight();
        const dimensions = this._calculateWindowDimensions(gameWidth, gameHeight);
        this.graphics = this.currentScene.add.graphics();

        this._createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
        this._createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
        this._createCloseModalButton();
        this._createCloseModalButtonBorder();
    }
}