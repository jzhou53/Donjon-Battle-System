/**
 *
 * addChild
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

    /**
     * constructor for render
     * @param owner
     * @override
     */
    constructor(owner) {
        super(owner);
        //this.initialSprites();
        this._sprites = [];

        this._opacity = 255;
        this._blendMode = 0;
        this._transparent = false;

    }

    initialSprites() {

    }

    /**
     * @override
     */
    update(){
        //console.log("Render Component updating...");
    }


}

/**
 *
 */
class CharacterRenderComponent extends RenderComponent {
    /**
     * initializing class variables
     * @param owner
     * @override
     */
    constructor(owner) {
        super(owner);


        this._headSprite = new Sprite();
        this._upperBodySprite = new Sprite();
        this._lowwerBodySprite = new Sprite();


        // this._priorityType = 1;
        // this._isObjectCharacter = false;
        // this._animationId = 0;
        // this._balloonId = 0;
        // this._animationPlaying = false;
        // this._balloonPlaying = false;
        // this._animationCount = 0;


    }

    setCharacterBitmap() {

    }

}