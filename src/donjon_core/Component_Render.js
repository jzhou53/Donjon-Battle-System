/**
 *
 * @abstract {RenderComponent}
 */
class RenderComponent extends Component {

    /**
     * constructor for render
     * @param owner
     * @override
     */
    constructor(owner) {
        super(owner);
        /**
         * @type {number} z order
         * @protected
         */
        this._priorityType = 1;
        /**
         * @type {Array.<Sprite>}
         * @protected
         */
        this._sprites = [];
        /**
         * @type {number}
         * @protected
         */
        this._opacity = 255;
        /**
         * @type {number}
         * @protected
         */
        this._blendMode = 0;
        /**
         * @type {boolean}
         * @protected
         */
        this._transparent = false;

    }

    /**
     * Create sprite objects
     * Note: must be called after Stage(ex: SpritesetMap) is created.
     * @abstract
     */
    initialSprites() {
        throw new Error("RenderComponent::initialSprites not implemented. ");
    }

    update() {
        for (let i = 0; i < this._sprites.length; i++) {
            this._sprites[i].update();
        }
    }

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

    /**
     * @return {boolean}
     */
    isTransparent() {
        return this._transparent;
    }

    /**
     * @param transparent{boolean}
     */
    setTransparent(transparent) {
        this._transparent = transparent;
    }

    /**
     * @return {Array.<Sprite>}
     */
    getSprites() {
        return this._sprites;
    }

    /**
     * interface to display on canvas
     * @return {number} x position on canvas to render
     */
    screenX() {
        let tw = $gameMap.tileWidth();
        return Math.round(this.scrolledX() * tw + tw / 2);
    }

    /**
     * interface to display on canvas
     * @return {number} y position on canvas to render
     */
    screenY() {
        let th = $gameMap.tileWidth();
        return Math.round(this.scrolledY() * th + th / 2);
    }

    /**
     * interface to display on canvas
     * @return {number} z position on canvas to render
     */
    screenZ() {
        return (this._priorityType << 1 ) + 1;
    }

    /**
     * @return {number}
     */
    scrolledX() {
        let t = this._owner.getTransform();
        return t.x - $gameMap._displayX;
    }

    /**
     * @return {number}
     */
    scrolledY() {
        let t = this._owner.getTransform();
        return t.y - $gameMap._displayY;
    }

    debugAddToStage(stage) {

    }


}

/**
 * @extends RenderComponent
 */
class CharacterRenderComponent extends RenderComponent {
    /**
     * @constructor
     * @param owner{GameEntity}
     */
    constructor(owner) {
        super(owner);
        /**
         * @type {string}
         * @private
         */
        this._characterName = 'Actor1';
        /**
         * @type {number}
         * @private
         */
        this._characterIndex = 0;
        /**
         * @type {number}
         * @private
         */
        this._pattern = 0;

    }

    /**
     * @override
     */
    initialSprites() {
        const sprite = new Sprite_RenderComponent(this);
        this._sprites.push(sprite);
    }

    characterName() {
        return this._characterName;
    }

    characterIndex() {
        return this._characterIndex;
    }

    pattern() {
        return this._pattern;
    }

    direction() {
        return 2;
    }


}