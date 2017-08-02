/**
 * @extends Sprite
 */
class Spriteset_Base extends Sprite {

    /**
     * @constructor
     */
    constructor() {
        super();
        this.setFrame(0, 0, Graphics.width, Graphics.height);
        /**
         * @type {[number,number,number,number]}
         * @protected
         */
        this._tone = [0, 0, 0, 0];
        /**
         * @type {boolean}
         */
        this.opaque = true;
        this._createLowerLayer();
        this._createToneChanger();
        this._createUpperLayer();
        this.update();
    }

    _createLowerLayer() {
        this._createBaseSprite();
    }

    _createUpperLayer() {
        //this.createTimer();
        this._createScreenSprites();
    }

    update() {
        super.update();
        this.updateScreenSprites();
        this.updateToneChanger();
        this.updatePosition();
    }

    /**
     * @protected
     */
    _createBaseSprite() {
        /**
         * @type {Sprite}
         */
        this._baseSprite = new Sprite();
        this._baseSprite.setFrame(0, 0, this.width, this.height);
        /**
         * @type {ScreenSprite}
         * @protected
         */
        this._blackScreen = new ScreenSprite();
        this._blackScreen.opacity = 255;
        this.addChild(this._baseSprite);
        this._baseSprite.addChild(this._blackScreen);
    }

    /**
     * @private
     */
    _createToneChanger() {
        if (Graphics.isWebGL()) {
            this._createWebGLToneChanger();
        } else {
            this._createCanvasToneChanger();
        }
    }

    /**
     * @private
     */
    _createWebGLToneChanger() {
        let margin = 48;
        let width = Graphics.width + margin * 2;
        let height = Graphics.height + margin * 2;
        this._toneFilter = new ToneFilter();
        this._baseSprite.filters = [this._toneFilter];
        this._baseSprite.filterArea = new Rectangle(-margin, -margin, width, height);
    }

    /**
     * @private
     */
    _createCanvasToneChanger() {
        this._toneSprite = new ToneSprite();
        this.addChild(this._toneSprite);
    }

    /**
     * @private
     */
    _createScreenSprites() {
        /**
         * @type {ScreenSprite}
         * @protected
         */
        this._flashSprite = new ScreenSprite();
        /**
         * @type {ScreenSprite}
         * @protected
         */
        this._fadeSprite = new ScreenSprite();
        this.addChild(this._flashSprite);
        this.addChild(this._fadeSprite);
    }

    updateScreenSprites() {
        const color = $gameScreen.flashColor();
        this._flashSprite.setColor(color[0], color[1], color[2]);
        this._flashSprite.opacity = color[3];
        this._fadeSprite.opacity = 255 - $gameScreen.brightness();
    }

    updateToneChanger() {
        const tone = $gameScreen.tone();
        if (!this._tone.equals(tone)) {
            this._tone = tone.clone();
            if (Graphics.isWebGL()) {
                this._updateWebGLToneChanger();
            } else {
                this._updateCanvasToneChanger();
            }
        }
    }

    _updateWebGLToneChanger() {
        const tone = this._tone;
        this._toneFilter.reset();
        this._toneFilter.adjustTone(tone[0], tone[1], tone[2]);
        this._toneFilter.adjustSaturation(-tone[3]);
    }

    _updateCanvasToneChanger() {
        const tone = this._tone;
        this._toneSprite.setTone(tone[0], tone[1], tone[2], tone[3]);
    }

    updatePosition() {
        let screen = $gameScreen;
        let scale = screen.zoomScale();
        this.scale.x = scale;
        this.scale.y = scale;
        this.x = Math.round(-screen.zoomX() * (scale - 1));
        this.y = Math.round(-screen.zoomY() * (scale - 1));
        this.x += Math.round(screen.shake());
    }


}