import Phaser from "phaser";

export default class BagPlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager);
        this.currentScene = this.game.scene.scenes[0];
    }

    preload(bag) {
        this.currentScene.load.image("bag", bag);
    }

    run(opts = {}) {
        this.borderThickness = opts.borderThickness || 3;
        this.borderColor = opts.borderColor || 0x907748;
        this.borderAlpha = opts.borderAlpha || 1;
        this.windowAlpha = opts.windowAlpha || 0.8;
        this.windowColor = opts.windowColor || 0x303030;
        this.windowHeight = opts.windowHeight || 150;
        this.closeBtnColor = opts.closeBtnColor || 'darkgoldenrod';
        this.dialogPadding = opts.dialogPadding || 20;

        this.width = 300;
        this.height = 200;
        this.scale = opts.scale || 0.1;
        this.alpha = opts.alpha || 0.5;
        this.padding = opts.padding || 50;
        this.lines = [];

        this.isOpened = false;
        this.items = [];

        this.bag = this._createBag();
        this._createEvent();
    }

    _getGameWidth() {
        return this.game.config.width;
    }

    _getGameHeight() {
        return this.game.config.height;
    }

    _toggleWindow() {
        this.isOpened = !this.isOpened;
        const bag = this.bag;

        if (this.isOpened) {
            bag.alpha = 1;
            this._showItem();
        } else {
            bag.alpha = this.alpha;
        }

        if (!this.isOpened) {
            this._clearObject(this.choicePointer);
            this._clearObject(this.title);
            this.lines.forEach(line => this._clearObject(line));
        }

        if (this.graphics) this.graphics.visible = this.isOpened;
        if (this.closeBtn) this.closeBtn.visible = this.isOpened;
    }

    _calculateWindowDimensions(width, height) {
        const rectWidth = width;
        const rectHeight = height;

        const x = (this._getGameWidth() - width) / 2;
        const y = (this._getGameHeight() - height) / 2;
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

    _createCloseModalButton(x, y, width) {
        this.closeBtn = this.currentScene.make.text({
            x: x + width - this.dialogPadding,
            y: y + this.dialogPadding / 2,
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
            this._toggleWindow();
        });
    }

    _createDescription(x, y, width, height) {
        const title = "Items";
        const xText = x + this.dialogPadding / 2;
        const yText = y + this.dialogPadding / 2;
        this.title = this.currentScene.make.text({
            x: xText,
            y: yText,
            text: title,
            style: {
                font: "14px",
                wordWrap: {
                    width: this.width - this.dialogPadding,
                },
            },
        });

        const titleHeight = this.title.getBounds().height;

        const line1 = this.currentScene.add.line(
            x + width / 2,
            yText + titleHeight + this.dialogPadding / 2,
            0, 0, width, 0,
            this.borderColor,
        );
        this.lines.push(line1);

        if (this.items.length > 0) {
            const line2 = this.currentScene.add.line(
                x + width / 2,
                y + height / 2,
                0, height - (titleHeight + this.dialogPadding) * 2 + this.borderThickness / 2, 0, 0,
                this.borderColor,
            );

            const line3 = this.currentScene.add.line(
                x + width / 2,
                y + height - titleHeight - this.dialogPadding,
                0, 0, width, 0,
                this.borderColor,
            );

            this.lines.push(line2);
            this.lines.push(line3);
        }
    }

    _clearObject(object) {
        if (object) {
            object.visible = this.isOpened;
            object.destroy();
        }
    }

    _createWindow() {
        const dimensions = this._calculateWindowDimensions(this.width, this.height);
        this.graphics = this.currentScene.add.graphics();

        this._createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
        this._createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
        this._createCloseModalButton(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
        this._createDescription(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
    }

    _createBag() {
        const gameWidth = this._getGameWidth();
        const bag = this.currentScene.add.image(
            gameWidth - this.padding,
            this.padding,
            "bag",
        ).setInteractive();
        bag.scale = this.scale;
        bag.alpha = this.alpha;

        return bag;
    }

    _createEvent() {
        const bag = this.bag;

        bag.on("pointerover", () => {
            bag.alpha = 1;
        });

        bag.on("pointerout", () => {
            if (!this.isOpened) {
                bag.alpha = this.alpha;
            }
        });

        bag.on("pointerdown", () => {
            this._toggleWindow();
        });
    }

    _showItem() {
        this._createWindow();
    }

    _createDialog() {

    }

    addItem(item) {
        /*
         * item format
        {
            image,
            canCombine,
            activeFunc,
        }
        */
        this.items.push(item);
    }
}
