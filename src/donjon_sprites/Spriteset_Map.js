/**
 * @extends Spriteset_Base
 */
class Spriteset_Map extends Spriteset_Base {

    /**
     * @override
     */
    constructor() {
        super();
        // add listener
        // EventsManager.addListener(
        //     EVENT_TYPES.EntityCreated, this._onEntityCreated
        // );

    }

    /**
     * @override
     * @protected
     */
    _createLowerLayer() {
        super._createLowerLayer();
        this._createParallax();
        this._createTilemap();
        this._createCharacters();
        this._createWeather();
    }

    /**
     * @override
     * @protected
     */
    update() {
        super.update();
        this._updateTileset();
        this._updateParallax();
        this._updateTilemap();
        this._updateWeather();
    }

    hideCharacters() {
        for (let i = 0; i < this._characterSprites.length; i++) {
            const sprite = this._characterSprites[i];
            //if (!sprite.isTile()) {
            sprite.hide();
            //}
        }
    }

    _createParallax() {
        this._parallax = new TilingSprite();
        this._parallax.move(0, 0, Graphics.width, Graphics.height);
        this._baseSprite.addChild(this._parallax);
    };

    _createTilemap() {
        /**
         * @type {ShaderTilemap|Tilemap}
         * @protected
         */
        this._tilemap = null;
        if (Graphics.isWebGL()) {
            this._tilemap = new ShaderTilemap();
        } else {
            this._tilemap = new Tilemap();
        }
        this._tilemap.tileWidth = $gameMap.tileWidth();
        this._tilemap.tileHeight = $gameMap.tileHeight();
        this._tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
        this._tilemap.horizontalWrap = false;
        this._tilemap.verticalWrap = false;
        this.loadTileset();
        this._baseSprite.addChild(this._tilemap);
    };

    /**
     *
     */
    loadTileset() {
        /**
         * @type {{tilesetNames}}
         */
        this._tileset = $gameMap.tileset();
        if (this._tileset) {
            let tilesetNames = this._tileset.tilesetNames;
            for (let i = 0; i < tilesetNames.length; i++) {
                this._tilemap.bitmaps[i] = ImageManager.loadTileset(tilesetNames[i]);
            }
            let newTilesetFlags = $gameMap.tilesetFlags();
            this._tilemap.refreshTileset();
            if (!this._tilemap.flags.equals(newTilesetFlags)) {
                this._tilemap.refresh();
            }
            this._tilemap.flags = newTilesetFlags;
        }
    };

    _createCharacters() {
        this._characterSprites = [];

        this._updateSpriteBuffer();

    };

    _createWeather() {
        this._weather = new Weather();
        this.addChild(this._weather);
    };

    _updateTileset() {
        if (this._tileset !== $gameMap.tileset()) {
            this.loadTileset();
        }
    };

    /*
     * Simple fix for canvas parallax issue, destroy old parallax and readd to  the tree.
     */
    _canvasReAddParallax() {
        let index = this._baseSprite.children.indexOf(this._parallax);
        this._baseSprite.removeChild(this._parallax);
        this._parallax = new TilingSprite();
        this._parallax.move(0, 0, Graphics.width, Graphics.height);
        this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
        this._baseSprite.addChildAt(this._parallax, index);
    };

    _updateParallax() {
        if (this._parallaxName !== $gameMap.parallaxName()) {
            this._parallaxName = $gameMap.parallaxName();

            if (this._parallax.bitmap && Graphics.isWebGL() !== true) {
                this._canvasReAddParallax();
            } else {
                this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
            }
        }
        if (this._parallax.bitmap) {
            this._parallax.origin.x = $gameMap.parallaxOx();
            this._parallax.origin.y = $gameMap.parallaxOy();
        }
    };

    _updateTilemap() {
        this._tilemap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
        this._tilemap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
    };

    /**
     * @private
     */
    _updateSpriteBuffer() {
        if (this._spriteToAddBuffer.length > 0) {
            for (let i = 0; i < this._spriteToAddBuffer.length; i++) {
                const sprite = this._spriteToAddBuffer[i];
                this._tilemap.addChild(sprite);
                this._characterSprites.push(sprite)
            }
            //clear
            this._spriteToAddBuffer = [];
        }
    }

    _updateWeather() {
        this._weather.type = $gameScreen.weatherType();
        this._weather.power = $gameScreen.weatherPower();
        this._weather.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
        this._weather.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
    };

    /**
     * event manager:
     * @private
     * @param event {Evnt_EntityCreated}
     */
    _onEntityCreated(event) {

        const render = event.getEntity().getComponent("Render");

        if (render) {
            const sp = render.getSprites();
            for (let i = 0; i < sp.length; i++) {
                const sprite = sp[i];
                this._spriteToAddBuffer.push(sprite);
            }

        } else {
            console.error("should not happen......")
        }

    }


}