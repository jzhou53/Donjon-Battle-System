/**
 *
 * @abstract {RenderComponent}
 */
class RenderComponent extends Component {
    /**
     * getters and setters
     */
    get blendMode() {
        return this._blendMode;
    }

    set blendMode(value) {
        this._blendMode = value;
    }

    get opacity() {
        return this._opacity;
    }

    set opacity(value) {
        this._opacity = value;
    }

    isTransparent() {
        return this._transparent;
    }

    setTransparent(transparent) {
        this._transparent = transparent;
    }

    getSprites() {
        return this._sprites;
    }

    /**
     * interface to display on canvas
     * @return {number}
     */
    screenX() {
        let tw = $gameMap.tileWidth();
        return Math.round(this.scrolledX() * tw + tw / 2);
    }

    screenY() {
        let th = $gameMap.tileWidth();
        return Math.round(this.scrolledY() * th + th / 2);
    }

    screenZ() {
        return (this._priorityType << 1 ) + 1;
    }

    scrolledX() {
        let t = this._owner.getTransform();
        return t.x - $gameMap._displayX;
    }

    scrolledY() {
        let t = this._owner.getTransform();
        return t.y - $gameMap._displayY;
    }

    /**
     * constructor for render
     * @param owner
     * @override
     */
    constructor(owner) {
        super(owner);

        this._priorityType = 1;

        this._sprites = [];

        this._opacity = 255;
        this._blendMode = 0;
        this._transparent = false;

        this.initialSprites();

    }

    initialSprites() {
        throw new Error("RenderComponent::initialSprites not implemented. ");
    }

    debugAddToStage(stage) {

    }


}

class CharacterRenderComponent extends RenderComponent {

    /**
     *
     * @param owner
     */
    constructor(owner) {
        super(owner);

        this._characterName = "Actor1";
        this.initialSprites()


    }

    /**
     * @override
     */
    initialSprites() {
        this._sprite = new Sprite();
        this._setCharacterBitmap();
    }

    _setCharacterBitmap() {
        this._sprite.bitmap = ImageManager.loadCharacter(this._characterName);
    }

    debugAddToStage(stage){
        stage.addChild(this._sprite);
    }

}


/**
 *
 */
class DummyRenderComponent extends RenderComponent {

    /**
     * initializing class variables
     * @param owner {GameEntity}
     * @override
     */
    constructor(owner) {
        super(owner);

    }

    /**
     * @override
     */
    initialSprites() {
        const size = 32;

        //note: debugging head
        this._headSprite = new Sprite();
        this._headSprite.bitmap = new Bitmap(size, size);

        this._upperBodySprite = new Sprite();
        this._upperBodySprite.bitmap = new Bitmap(size, size);

        this._lowwerBodySprite = new Sprite();
        this._lowwerBodySprite.bitmap = new Bitmap(size, size);

        //should load bitmap from database, but now debug
        const color = '#00FFFF';
        this._headSprite.bitmap.drawCircle(size / 2, size / 2, size / 2, color);
        this._upperBodySprite.bitmap.fillRect(0, 0, size, size, color);
        this._lowwerBodySprite.bitmap.fillRect(size / 4, 0, size / 2, size, color);

        //set anchor
        this._headSprite.anchor.x = 0.5;
        this._headSprite.anchor.y = 1;
        this._upperBodySprite.anchor.x = 0.5;
        this._upperBodySprite.anchor.y = 1;
        this._lowwerBodySprite.anchor.x = 0.5;
        this._lowwerBodySprite.anchor.y = 1;

        console.debug(this._headSprite);
    }

    /**
     *
     * @override
     */
    getSprites() {
        return [this._headSprite, this._upperBodySprite, this._lowwerBodySprite];
    }


    debugAddToStage(stage) {
        stage.addChild(this._headSprite);
        stage.addChild(this._upperBodySprite);
        stage.addChild(this._lowwerBodySprite);
        console.debug("added to the stage ");
        console.debug(stage);
    }


    /**
     * @override
     */
    update() {
        const size = 32;
        this._headSprite.x = this.screenX();
        this._headSprite.y = this.screenY() - size;
        this._upperBodySprite.x = this.screenX();
        this._upperBodySprite.y = this.screenY();
        this._lowwerBodySprite.x = this.screenX();
        this._lowwerBodySprite.y = this.screenY() + size;
        //console.debug("screenX: "+ this.screenX()+", this.screenY(): " + this.screenY());

    }


}