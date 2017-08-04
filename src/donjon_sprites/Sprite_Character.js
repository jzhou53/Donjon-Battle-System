/**
 * @extends Sprite_Base
 */
class Sprite_Character extends Sprite_Base {

    /**
     * @param character {GameEntity}
     */
    constructor(character) {
        super();
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this._character = null;
        //this._balloonDuration = 0;
        this._tilesetId = 0;
        this._upperBody = null;
        this._lowerBody = null;
        this.setCharacter(character);

    }

    /**
     * @param character{GameEntity}
     */
    setCharacter(character) {
        /**
         * @type {GameEntity}
         * @private
         */
        this._character = character;
    };

    /**
     * @override
     */
    update() {
        super.update();
        this.updateBitmap();
        this.updateFrame();
        this.updatePosition();
        //this.updateAnimation();
        //this.updateBalloon();
        this._updateOther();
    };

    /**
     * @override
     */
    _updateVisibility() {
        super._updateVisibility()
        if (this._character.isTransparent()) {
            this.visible = false;
        }
    };

    /**
     * @return {boolean}
     */
    isTile() {
        return this._character.tileId > 0;
    };

    /**
     * @param tileId
     * @return {boolean}
     */
    tilesetBitmap(tileId) {
        let tileset = $gameMap.tileset();
        let setNumber = 5 + Math.floor(tileId / 256);
        return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
    };

    updateBitmap() {
        if (this.isImageChanged()) {
            this._tilesetId = $gameMap.tilesetId();
            this._tileId = this._character.tileId();
            this._characterName = this._character.characterName();
            this._characterIndex = this._character.characterIndex();
            if (this._tileId > 0) {
                this.setTileBitmap();
            } else {
                this.setCharacterBitmap();
            }
        }
    };

    isImageChanged() {
        return (this._tilesetId !== $gameMap.tilesetId() ||
            this._tileId !== this._character.tileId() ||
            this._characterName !== this._character.characterName() ||
            this._characterIndex !== this._character.characterIndex());
    };

    setTileBitmap() {
        this.bitmap = this.tilesetBitmap(this._tileId);
    };

    setCharacterBitmap() {
        this.bitmap = ImageManager.loadCharacter(this._characterName);
        this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
    };

    updateFrame() {
        if (this._tileId > 0) {
            this.updateTileFrame();
        } else {
            this.updateCharacterFrame();
        }
    };

    updateTileFrame() {
        let pw = this.patternWidth();
        let ph = this.patternHeight();
        let sx = (Math.floor(this._tileId / 128) % 2 * 8 + this._tileId % 8) * pw;
        let sy = Math.floor(this._tileId % 256 / 8) % 16 * ph;
        this.setFrame(sx, sy, pw, ph);
    };

    updateCharacterFrame() {
        let pw = this.patternWidth();
        let ph = this.patternHeight();
        let sx = (this.characterBlockX() + this.characterPatternX()) * pw;
        let sy = (this.characterBlockY() + this.characterPatternY()) * ph;
        this.updateHalfBodySprites();
        if (this._bushDepth > 0) {
            let d = this._bushDepth;
            this._upperBody.setFrame(sx, sy, pw, ph - d);
            this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
            this.setFrame(sx, sy, 0, ph);
        } else {
            this.setFrame(sx, sy, pw, ph);
        }
    };

    characterBlockX() {
        if (this._isBigCharacter) {
            return 0;
        } else {
            let index = this._character.characterIndex();
            return index % 4 * 3;
        }
    };

    characterBlockY() {
        if (this._isBigCharacter) {
            return 0;
        } else {
            let index = this._character.characterIndex();
            return Math.floor(index / 4) * 4;
        }
    };

    characterPatternX() {
        return this._character.pattern();
    };

    characterPatternY() {
        return (this._character.direction() - 2) / 2;
    };

    patternWidth() {
        if (this._tileId > 0) {
            return $gameMap.tileWidth();
        } else if (this._isBigCharacter) {
            return this.bitmap.width / 3;
        } else {
            return this.bitmap.width / 12;
        }
    };

    patternHeight() {
        if (this._tileId > 0) {
            return $gameMap.tileHeight();
        } else if (this._isBigCharacter) {
            return this.bitmap.height / 4;
        } else {
            return this.bitmap.height / 8;
        }
    };

    updateHalfBodySprites() {
        if (this._bushDepth > 0) {
            this.createHalfBodySprites();
            this._upperBody.bitmap = this.bitmap;
            this._upperBody.visible = true;
            this._upperBody.y = -this._bushDepth;
            this._lowerBody.bitmap = this.bitmap;
            this._lowerBody.visible = true;
            this._upperBody.setBlendColor(this.getBlendColor());
            this._lowerBody.setBlendColor(this.getBlendColor());
            this._upperBody.setColorTone(this.getColorTone());
            this._lowerBody.setColorTone(this.getColorTone());
        } else if (this._upperBody) {
            this._upperBody.visible = false;
            this._lowerBody.visible = false;
        }
    };

    createHalfBodySprites() {
        if (!this._upperBody) {
            this._upperBody = new Sprite();
            this._upperBody.anchor.x = 0.5;
            this._upperBody.anchor.y = 1;
            this.addChild(this._upperBody);
        }
        if (!this._lowerBody) {
            this._lowerBody = new Sprite();
            this._lowerBody.anchor.x = 0.5;
            this._lowerBody.anchor.y = 1;
            this._lowerBody.opacity = 128;
            this.addChild(this._lowerBody);
        }
    };

    updatePosition() {
        this.x = this._character.screenX();
        this.y = this._character.screenY();
        this.z = this._character.screenZ();
    };

    //
    // updateAnimation () {
    //     this.setupAnimation();
    //     if (!this.isAnimationPlaying()) {
    //         this._character.endAnimation();
    //     }
    //     if (!this.isBalloonPlaying()) {
    //         this._character.endBalloon();
    //     }
    // };

    _updateOther() {
        this.opacity = this._character.opacity();
        this.blendMode = this._character.blendMode();
        this._bushDepth = this._character.bushDepth();
    };

    // setupAnimation () {
    //     if (this._character.animationId() > 0) {
    //         let animation = $dataAnimations[this._character.animationId()];
    //         this.startAnimation(animation, false, 0);
    //         this._character.startAnimation();
    //     }
    // };

    // setupBalloon () {
    //     if (this._character.balloonId() > 0) {
    //         this.startBalloon();
    //         this._character.startBalloon();
    //     }
    // };
    //
    // startBalloon () {
    //     if (!this._balloonSprite) {
    //         this._balloonSprite = new Sprite_Balloon();
    //     }
    //     this._balloonSprite.setup(this._character.balloonId());
    //     this.parent.addChild(this._balloonSprite);
    // };
    //
    // updateBalloon () {
    //     this.setupBalloon();
    //     if (this._balloonSprite) {
    //         this._balloonSprite.x = this.x;
    //         this._balloonSprite.y = this.y - this.height;
    //         if (!this._balloonSprite.isPlaying()) {
    //             this.endBalloon();
    //         }
    //     }
    // };
    //
    // endBalloon () {
    //     if (this._balloonSprite) {
    //         this.parent.removeChild(this._balloonSprite);
    //         this._balloonSprite = null;
    //     }
    // };
    //
    // isBalloonPlaying () {
    //     return !!this._balloonSprite;
    // };


}