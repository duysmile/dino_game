import Phaser from "phaser";

const UP = -1;
const DOWN = 1;
const LEFT = -1;
const RIGHT = 1;
const MAX_SIZE = 3;

export const ACTION = {
    COMBINE: 'Combine',
    USE: 'Use',
};

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
        this.spaceSize = opts.spaceSize || 8;

        this.width = 300;
        this.height = 200;
        this.scale = opts.scale || 0.1;
        this.alpha = opts.alpha || 0.5;
        this.alphaItem = opts.alphaItem || 0.5;
        this.padding = opts.padding || 50;
        this.lines = [];

        this.isOpened = false;
        this.items = [];
        this.itemObjects = [];
        this.actionObjects = [];
        this.chooseItem = 0;
        this.chooseAction = 0;
        this.enteredItem = false;

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
            this._showBag();
        } else {
            bag.alpha = this.alpha;
        }

        if (!this.isOpened) {
            this._clearObject(this.choicePointer);
            this._clearObject(this.title);
            this.lines.forEach(line => this._clearObject(line));
            this.itemObjects.forEach(item => this._clearObject(item));
            if (this.currentImage) {
                this._clearObject(this.currentImage);
            }
            if (this.actionObjects.length > 0) {
                this.actionObjects.forEach(action => this._clearObject(action));
            }

            this.actionObjects = [];
            this.itemObjects = [];
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

    _createWindow(dimensions) {
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

    _showBag() {
        const dimensions = this._calculateWindowDimensions(this.width, this.height);
        this._createWindow(dimensions);
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            this.itemObjects.push(this._displayItem(dimensions, item, i));
            if (i === 0) {
                this._initializePointer(
                    dimensions.x + this.padding / 2 - this.spaceSize,
                    dimensions.y + this.padding + this.spaceSize,
                );
            }
        }

        this._setChooseItem(this.chooseItem);
    }

    _initializePointer(x, y) {
        if (this.choicePointer != null) {
            this.choicePointer.destroy();
        }
        this.choicePointer = this.currentScene.add.polygon(x, y, [0, 0, 0, 15, 8, 8], 0xffffff);
    }

    _displayItem(dimensions, item, index) {
        const x = dimensions.x;
        const y = dimensions.y;

        const text = this.currentScene.make.text({
            x: x + this.padding / 1.5,
            y: y + this.padding + index * (14 + this.padding / 2),
            text: item.name,
            style: {
                font: "14px",
            },
        });

        text.alpha = this.alphaItem;

        return text;
    }

    _setChooseItem(direction) {
        if (this.currentImage) {
            this._clearObject(this.currentImage);
        }
        const oldX = this.choicePointer.x;
        const oldY = this.choicePointer.y;

        let step = direction * 14;
        step += direction * this.padding / 2;

        this.choicePointer.setPosition(oldX, oldY + step);

        const item = this.items[this.chooseItem];
        const itemObj = this.itemObjects[this.chooseItem];
        itemObj.alpha = 1;
        this._showInfoItem(item);
    }

    _showInfoItem(item) {
        if (this.actionObjects.length > 0) {
            this.actionObjects.forEach(action => this._clearObject(action));
        }

        const { x, y, rectHeight, rectWidth } = this._calculateWindowDimensions(this.width, this.height);

        this.currentImage = this.currentScene.add.image(
            x + rectWidth * 1.5 / 2,
            y + rectHeight / 2,
            item.image,
        );

        this.actionObjects = item.actions.map((action, index) => {
            const text = this.currentScene.make.text({
                x: x + this.padding / 1.5 + index * rectWidth / 2,
                y: y + rectHeight - this.padding / 2,
                text: action.name,
                style: {
                    font: "14px",
                },
            });
            text.alpha = this.alphaItem;
            return text;
        });
    }

    _setChooseAction(direction) {
        const dimensions = this._calculateWindowDimensions(this.width, this.height);
        const oldX = this.choicePointer.x;
        const oldY = this.choicePointer.y;

        this.actionObjects[this.chooseAction].alpha = 1;
        this.choicePointer.setPosition(
            oldX + direction * dimensions.rectWidth / 2,
            oldY,
        );
    }

    _movePointerToBottom() {
        const {
            x,
            y,
            rectHeight: height,
        } = this._calculateWindowDimensions(this.width, this.height);

        this.choicePointer.setPosition(
            x + this.padding / 2 - this.spaceSize,
            y + height - 14 - this.spaceSize / 2,
        );
    }

    _movePointerToList(index) {
        const dimensions = this._calculateWindowDimensions(this.width, this.height);
        const x = dimensions.x + this.padding / 2 - this.spaceSize;
        let y = dimensions.y + this.padding + this.spaceSize;

        let step = index * 14;
        step += index * this.padding / 2;
        y += step

        this.choicePointer.setPosition(x, y);
    }

    checkIsOpen() {
        return this.isOpened;
    }

    addItem(item) {
        /*
         * item format
        {
            name,
            image,
            actions: [
                {
                    name: COMBINE,
                    handler: () => {}
                },
                {
                    name: USE,
                    handler: () => {}
                },
            ]
        }
        */
        if (this.items.length === MAX_SIZE) {
            return;
        }
        this.items.push(item);
    }

    runEvents(keys) {
        if (!this.isOpened) {
            return;
        }

        if (
            !this.enteredItem
            && (
                Phaser.Input.Keyboard.JustDown(keys.down)
                || Phaser.Input.Keyboard.JustDown(keys.up)
            )
        ) {
            let direction = keys.down.isDown ? DOWN : UP;
            const temp = this.chooseItem + direction;
            if (temp < 0 || temp > this.items.length - 1) {
                return;
            }
            this.itemObjects[this.chooseItem].alpha = this.alphaItem;
            this.chooseItem = temp;

            this._setChooseItem(direction);
        }

        if (
            this.enteredItem
            && (
                Phaser.Input.Keyboard.JustDown(keys.left)
                || Phaser.Input.Keyboard.JustDown(keys.right)
            )
        ) {
            let direction = keys.left.isDown ? LEFT : RIGHT;
            const temp = this.chooseAction + direction;
            const item = this.items[this.chooseItem];
            if (temp < 0 || temp > item.actions.length - 1) {
                return;
            }
            this.actionObjects[this.chooseAction].alpha = this.alphaItem;
            this.chooseAction = temp;

            this._setChooseAction(direction);
        }

        if (this.enteredItem && Phaser.Input.Keyboard.JustDown(keys.esc)) {
            this.enteredItem = !this.enteredItem;
            this._movePointerToList(this.chooseItem);
            this.actionObjects[this.chooseAction].alpha = this.alphaItem;
        }

        if (Phaser.Input.Keyboard.JustDown(keys.enter)) {
            if (this.enteredItem) {
                this._movePointerToList(this.chooseItem);
            } else {
                this._movePointerToBottom();
                this.chooseAction = 0;
                this._setChooseAction(0);
            }
            this.enteredItem = !this.enteredItem;
        }
    }
}
