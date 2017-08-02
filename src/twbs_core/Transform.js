/**
 * Position, rotation and scale of an object.
 *
 * Every object in a scene has a Transform.
 * It's used to store and manipulate the position,
 * rotation and scale of the object. Every Transform
 * can have a parent, which allows you to apply position,
 * rotation and scale hierarchically.
 */
class Transform {

    /**
     * getters
     * @return {number}
     */
    get x() {
        return this._position.x;
    }

    get y() {
        return this._position.y;
    }

    setPosition(pPosition) {
        this._localPosition = pPosition;
        //this.update();
    }

    getPosition() {
        return this._position;
    }

    /**
     *
     * @return {Victor}
     */
    getScale() {
        return this._scale;
    }


    /**
     *
     * @param pos{Victor}
     * @param z{number}
     * @param scale{Victor}
     * @param r{number}
     */
    constructor(pos = new Victor(0, 0),
                z = 0,
                scale = new Victor(1.0, 1.0),
                r = 0) {

        /**
         *
         * @type {Transform}
         * @private
         */
        this._parent = null;

        /**
         *
         * @type {Array} storing {Transforms}
         * @private
         */
        this._childern = [];

        /**
         * The position of the transform in world space.
         * @type {Victor}
         * @private
         */
        this._position = new Victor(0, 0);

        /**
         * radius = scale * tileSize
         * @private
         */
        this._scale = new Victor(1.0, 1.0);

        /**
         * the coordinate of this transform locally
         * @type {Victor}
         * @private
         */
        this._localPosition = pos;
        /**
         * the scale of this transform locally
         * @type {Victor}
         * @private
         */
        this._localScale = scale;

        /**
         * store the direction of the object
         * @type {number}
         * @private
         */
        this._localRotation = r;

        this._localHight = z;


    }

    /**
     *
     * @param pTransform{Transform}
     */
    _addChild(pTransform) {
        this._childern.push(pTransform);
    }

    /**
     *
     * @param pTransform{Transform} the parent Transform you want this to attach to
     * @return {boolean}
     */
    attachWith(pTransform) {

        if (this._parent) {
            console.error("attempting attach with more than one parent in transform");
            return false;
        } else {
            this._parent = pTransform;
            this._parent._addChild(this);
        }

    }

    /**
     * detach from this item's parent
     */
    detach() {
        if (this._parent) {
            this._parent._childern.splice(this._parent._childern.indexOf(this), 1);
            this._parent = null;
        }
    }

    /**
     * get the top most transform in this hierarchy.
     * @return {Transform} the top most transform.
     */
    getRoot() {
        if (this._parent) {
            return this._parent.getRoot();
        } else {
            return this;
        }
    }

    /**
     * @private
     * @return {Victor}
     */
    _getGlobalPosition() {
        if (this._parent) {
            return this._parent._getGlobalPosition().clone().add(this._localPosition);
        } else {
            return this._localPosition;
        }
    }

    /**
     * @private
     * @return {Victor}
     */
    _getGlobalScale() {
        if (this._parent) {
            return this._parent._getGlobalScale().clone().add(this._localScale);
        } else {
            return this._localScale;
        }
    }

    /**
     *
     */
    update() {

        this._position = this._getGlobalPosition();
        this._scale = this._getGlobalScale();

    }


    /**
     * calculate the distance from first transform to the second transform.
     * @param first{Transform}
     * @param second{Transform}
     * @return {number}
     */
    static distanceTo(first, second) {
        return first._position.distance(second._position);
    }

    /**
     *
     * @return {string}
     */
    toString() {
        return "(" + this._position.toString() + ") local: " + this._localPosition.toString();
    }

}

