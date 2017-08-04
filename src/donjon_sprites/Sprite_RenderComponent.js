/**
 * @extends Sprite_Base
 * TODO: Refactor, I think most of the functions could be added to the render component
 */
class Sprite_RenderComponent extends Sprite_Base {

    /**
     * @param component {RenderComponent}
     */
    constructor(component) {
        super();
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        /**
         * @type {RenderComponent}
         * @private
         */
        this._component = null;
        this.setComponent(component);

    }

    /**
     * @param component{RenderComponent}
     */
    setComponent(component) {
        this._component = component;

    };

    /**
     * @override
     */
    update() {
        super.update();
        //check if imaged changed, and reset the bitmap
        this._updateBitmap();
        //set the frame area base on pattern, direction, etc
        this._updateFrame();
        //update the position base on the screen x,y,z
        this._updatePosition();
        //opacity and blend mode
        this._updateOther();
    };

    /**
     * @override
     */
    _updateVisibility() {
        super._updateVisibility();
        if (this._component.isTransparent()) {
            this.visible = false;
        }
    };

    _updateBitmap() {
        if (this._isImageChanged()) {
            this._characterName = this._component.characterName();
            this._characterIndex = this._component.characterIndex();
            this._setCharacterBitmap();
        }
    };

    _isImageChanged() {
        return (this._characterName !== this._component.characterName() ||
            this._characterIndex !== this._component.characterIndex());
    };

    _setCharacterBitmap() {
        this.bitmap = ImageManager.loadCharacter(this._characterName);
    };

    _updateFrame() {
        this._updateCharacterFrame();
    };

    _updateCharacterFrame() {
        let pw = this.patternWidth();
        let ph = this.patternHeight();
        let sx = (this.characterBlockX() + this.characterPatternX()) * pw;
        let sy = (this.characterBlockY() + this.characterPatternY()) * ph;
        this.setFrame(sx, sy, pw, ph);
    };

    characterBlockX() {
        let index = this._component.characterIndex();
        return index % 12;
    };

    characterBlockY() {
        let index = this._component.characterIndex();
        return Math.floor(index / 4) * 4;

    };

    characterPatternX() {
        return this._component.pattern();
    };

    characterPatternY() {
        return (this._component.direction() - 2) / 2;
    };

    patternWidth() {
        return this.bitmap.width / 12;
    };

    patternHeight() {
        return this.bitmap.height / 8;
    };

    _updatePosition() {
        this.x = this._component.screenX();
        this.y = this._component.screenY();
        this.z = this._component.screenZ();
    };

    _updateOther() {
        this.opacity = this._component.opacity;
        this.blendMode = this._component.blendMode;
    };




}