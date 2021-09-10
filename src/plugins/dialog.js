import Phaser from "phaser";

const UP = -1;
const DOWN = 1;
export default class DialogPlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager);
    }

    run(opts) {
        if (!opts) {
            opts = { };
        }

        this.currentScene = this.game.scene.scenes[0];
        this.borderThickness = opts.borderThickness || 3;
        this.borderColor = opts.borderColor || 0x907748;
        this.borderAlpha = opts.borderAlpha || 1;
        this.windowAlpha = opts.windowAlpha || 0.8;
        this.windowColor = opts.windowColor || 0x303030;
        this.windowHeight = opts.windowHeight || 150;
        this.padding = opts.padding || 32;
        this.spaceSize = opts.spaceSize || 10;
        this.closeBtnColor = opts.closeBtnColor || 'darkgoldenrod';
        this.dialogSpeed = opts.dialogSpeed || 3;

        this.eventCounter = 0;
        this.visible = true;
        this.isRunningAnimate = false;
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

    _clearObject(object) {
        if (object) {
            object.visible = this.visible;
            object.destroy();
        }
    }

    toggleWindow() {
        this.visible = !this.visible;
        if (this.timedEvent) this.timedEvent.remove();
        this._clearObject(this.text);

        this._clearObject(this.instructionText);

        if (this.choiceText) {
            this.choiceText.forEach(this._clearObject.bind(this));
        }

        this._clearObject(this.choicePointer);

        if (this.graphics) this.graphics.visible = this.visible;
        if (this.closeBtn) this.closeBtn.visible = this.visible;
    }

    setText(text, choices) {
        this.eventCounter = 0;
        this.dialog = text.split('');
        this.choices = choices;

        if (this.timedEvent) this.timedEvent.remove();

        this.isRunningAnimate = true;

        this._setText('');
        this._setInstructionText();
        this.timedEvent = this.currentScene.time.addEvent({
            delay: 100 - this.dialogSpeed * 30,
            callback: this._animateText,
            callbackScope: this,
            loop: true,
        });
    }

    _setInstructionText() {
        this.instructionText = this.currentScene.make.text({
            x: this._getGameWidth() - this.padding - 50,
            y: this._getGameHeight() - this.padding - 20,
            text: 'Press Z',
            style: {
                font: 'bold 12px Arial',
                fill: this.closeBtnColor,
            },
        });
    }

    _setChoices() {
        this.isRunningAnimate = true;
        this.isShowChoice = true;
        this.answer = 0;

        const x = this.padding + 30;
        let y = this._getGameHeight() - this.windowHeight - this.padding + this.spaceSize;
        y += this.text.getBounds().height + this.spaceSize;

        let lastHeight = 0;
        this._initializePointer(x - 15, y + this.spaceSize);
        this.choiceText = this.choices.map(choice => {
            const temp = this.currentScene.make.text({
                x,
                y: y + lastHeight,
                text: choice,
                style: {
                    font: "20px",
                    wordWrap: {
                        width: this._getGameWidth() - this.padding * 2 - 25,
                    },
                },
            });

            lastHeight = temp.getBounds().height + this.spaceSize;
            return temp;
        });
    }

    _setAnswer(direction) {
        const oldX = this.choicePointer.x;
        const oldY = this.choicePointer.y;

        let step = direction * this.choiceText[this.answer - direction].getBounds().height;
        step += direction * this.spaceSize;

        this.choicePointer.setPosition(oldX, oldY + step);
    }

    _initializePointer(x, y) {
		if (this.choicePointer != null) {
			this.choicePointer.destroy();
		}
		this.choicePointer = this.currentScene.add.polygon(x, y, [0, 0, 0, 20, 10, 10], 0xffffff);
	}

    continueText() {
        const isEndOfText = this.eventCounter === this.dialog.length;
        if (isEndOfText && !this.isRunningAnimate) {
            return this.toggleWindow();
        }

        this._setText("");
        this.isRunningAnimate = true;
        this.timedEvent = this.currentScene.time.addEvent({
            delay: 100 - this.dialogSpeed * 30,
            callback: this._animateText,
            callbackScope: this,
            loop: true,
        });
    }

    _animateText() {
        if (this.eventCounter === this.dialog.length + 1) {
            this.timedEvent.remove();
            return;
        }
        this.eventCounter++;
        const nextCharacter = this.dialog[this.eventCounter - 1];
        this.text.setText(this.text.text + nextCharacter);

        const isEndOfText = this.eventCounter === this.dialog.length;
        const isReachDot = nextCharacter === ".";
        const isMaxHeight = this.text.getBounds().height >= this.windowHeight - 25;
        if (
            isEndOfText || isReachDot || isMaxHeight
        ) {
            this.isRunningAnimate = false;
            this.timedEvent.remove();
        }

        if (isEndOfText && this.choices) {
            this._setChoices();
        }
    }

    _setText(text) {
        if (this.text) this.text.destroy();

        const x = this.padding + this.spaceSize;
        const y = this._getGameHeight() - this.windowHeight - this.padding + this.spaceSize;

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

    checkRun() {
        return this.isRunningAnimate;
    }

    checkExist() {
        return this.visible;
    }

    getAnswer() {
        if (this.choices) {
            return this.choices[this.answer];
        }
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

    runEvent(keys) {
        if (!this.checkExist()) {
            return;
        }
        if (
            this.checkExist()
            && !this.checkRun()
            && keys.z.isDown
        ) {
            this.continueText();
        }

        if (!this.isShowChoice) {
            return;
        }

        if (keys.enter.isDown) {
            return this.toggleWindow();
        }

        if (keys.down.isDown || keys.up.isDown) {
            let direction = keys.down.isDown ? DOWN : UP;
            const temp = this.answer + direction;
            if (temp < 0 || temp > this.choices.length - 1) {
                return;
            }
            this.answer = temp;

            this._setAnswer(direction);
        }
    }
}