/**
 * In addition to Sprite, this class handles visibility and animation.
 * @extends Sprite
 */
class Sprite_Base extends Sprite {

    constructor() {
        super();
        /**
         * @type {Array}
         * @private
         */
        //this._animationSprites = [];
        /**
         * @type {Spriteset_Base}
         * @private
         */
        //this._effectTarget = this;
        /**
         * @type {boolean}
         * @private
         */
        this._hiding = false;
    }

    /**
     * @override
     */
    update() {
        super.update();
        this._updateVisibility();
        //this._updateAnimationSprites();
    };

    hide() {
        this._hiding = true;
        this._updateVisibility();
    };

    show() {
        this._hiding = false;
        this._updateVisibility();
    };

    /**
     * @pro
     */
    _updateVisibility() {
        this.visible = !this._hiding;
    };

    // _updateAnimationSprites () {
    //     if (this._animationSprites.length > 0) {
    //         let sprites = this._animationSprites.clone();
    //         this._animationSprites = [];
    //         for (let i = 0; i < sprites.length; i++) {
    //             let sprite = sprites[i];
    //             if (sprite.isPlaying()) {
    //                 this._animationSprites.push(sprite);
    //             } else {
    //                 sprite.remove();
    //             }
    //         }
    //     }
    // };

    // startAnimation (animation, mirror, delay) {
    //     let sprite = new Sprite_Animation();
    //     sprite.setup(this._effectTarget, animation, mirror, delay);
    //     this.parent.addChild(sprite);
    //     this._animationSprites.push(sprite);
    // };
    //
    // isAnimationPlaying () {
    //     return this._animationSprites.length > 0;
    // };

}