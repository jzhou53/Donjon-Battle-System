/**
 * A Container represents a collection of display objects.
 * It is the base class of all display objects that act as a container for other objects.
 *
 * @abstract
 * @extends {Stage} Scene_Base
 */
class Scene_Base extends Stage {

    /**
     * @constructor
     */
    constructor() {
        super();

        /**
         * @type {boolean}
         * @protected
         */
        this._active = false;

        /**
         * @type {number}
         * @protected
         */
        this._fadeSign = 0;

        /**
         * @type {number}
         * @protected
         */
        this._fadeDuration = 0;

        /**
         * @type {ScreenSprite} a sprite that is covering all other sprite on screen
         * @protected
         */
        this._fadeSprite = null;

    }

    /**
     * @abstract
     */
    create() {
    }

    /**
     * @return {boolean}
     */
    isActive() {
        return this._active
    }

    /**
     * @return {boolean} if ImageManager is ready
     */
    isReady() {
        return ImageManager.isReady();
    }

    /**
     *
     */
    start() {
        this._active = true;
    }

    /**
     * Handle fading update and update all children
     */
    update() {
        EventManager.tick();
        this.updateFade();
        this._updateChildren();
        AudioManager.checkErrors();
    }

    stop() {
        this._active = false;
    }

    /**
     * @return {boolean}
     */
    isBusy() {
        return this._fadeDuration > 0;
    }

    /**
     * @abstract
     */
    terminate() {
    }


    createWindowLayer() {
        let width = Graphics.boxWidth;
        let height = Graphics.boxHeight;
        let x = (Graphics.width - width) / 2;
        let y = (Graphics.height - height) / 2;
        this._windowLayer = new WindowLayer();
        this._windowLayer.move(x, y, width, height);
        this.addChild(this._windowLayer);
    }

    /**
     *
     * @param window{Window}
     */
    addWindow(window) {
        this._windowLayer.addChild(window);
    }

    /**
     * @param duration {Number}
     * @param white {Boolean}
     */
    startFadeIn(duration, white = false) {
        this.createFadeSprite(white);
        this._fadeSign = 1;
        this._fadeDuration = duration || 30;
        this._fadeSprite.opacity = 255;
    }

    /**
     * @param duration {Number}
     * @param white {Boolean}
     */
    startFadeOut(duration, white = false) {
        this.createFadeSprite(white);
        this._fadeSign = -1;
        this._fadeDuration = duration || 30;
        this._fadeSprite.opacity = 0;
    }

    /**
     * @param white {Boolean}
     */
    createFadeSprite(white) {
        if (!this._fadeSprite) {
            this._fadeSprite = new ScreenSprite();
            this.addChild(this._fadeSprite);
        }
        if (white) {
            this._fadeSprite.setWhite();
        } else {
            this._fadeSprite.setBlack();
        }
    }

    updateFade() {
        if (this._fadeDuration > 0) {
            let d = this._fadeDuration;
            if (this._fadeSign > 0) {
                this._fadeSprite.opacity -= this._fadeSprite.opacity / d;
            } else {
                this._fadeSprite.opacity += (255 - this._fadeSprite.opacity) / d;
            }
            this._fadeDuration--;
        }
    }

    /**
     * the children includes {PIXI.DisplayObject}
     * @protected
     */
    _updateChildren() {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child.update) {
                child.update();
            }
        }
    }

    popScene() {
        SceneManager.pop();
    }

    checkGameover() {
        // if ($gameParty.isAllDead()) {
        //     SceneManager.goto(Scene_Gameover);
        // }
    }

    fadeOutAll() {
        const time = this.slowFadeSpeed() / 60;
        AudioManager.fadeOutBgm(time);
        AudioManager.fadeOutBgs(time);
        AudioManager.fadeOutMe(time);
        this.startFadeOut(this.slowFadeSpeed());
    }

    fadeSpeed() {
        return 24;
    }

    slowFadeSpeed() {
        return this.fadeSpeed() * 2;
    }


}