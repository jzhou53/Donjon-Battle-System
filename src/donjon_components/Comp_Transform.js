class Transform extends Component {

    /**
     * @param owner
     * @param pos{Victor}
     * @param z{number}
     * @param scale{Victor}
     * @param r{number}
     */
    constructor(owner, pos = new Victor(0, 0), z = 0, scale = new Victor(1.0, 1.0), r = 0) {
        super(owner);
        /**
         * @type {Transform}
         * @private
         */
        this._parent = null;

        /**
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
     * @return {number}
     */
    get x() {
        return this._position.x;
    }

    /**
     * @return {number}
     */
    get y() {
        return this._position.y;
    }

    /**
     * @param pPosition{Victor}
     */
    setPosition(pPosition) {
        this._localPosition = pPosition;
    }

    /**
     * @return {Victor}
     */
    getPosition() {
        return this._position;
    }

    /**
     * @return {Victor}
     */
    getScale() {
        return this._scale;
    }

    /**
     * @param pTransform{Transform} the child
     */
    addChild(pTransform) {
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
            this._parent.addChild(this);
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
    static squaredDistanceTo(first, second) {
        return first._position.distanceSq(second._position);
    }

    /**
     * @return {string}
     */
    toString() {
        return "global: (" + this._position + ") local: " + this._localPosition;
    }

}

class RMMV_Transform extends Component {

    get x() {
        return this._realPosition.x;
    }

    get y() {
        return this._realPosition.y;
    }

    /**
     * @param owner
     * @param pos {Victor}
     * @param z {number}
     * @param scale {Victor}
     * @param r {number}
     */
    constructor(owner, pos, z, scale, r) {
        super(owner);
        this._position = pos;
        this._realPosition = pos.clone();
        this._scale = scale;
    }

    /**
     * @param pos {Victor}
     */
    setPosition(pos) {
        this._position = new Victor(
            Math.round(pos.x), Math.round(pos.y)
        );
        this._realPosition = this._position.clone();
    }

    getScale() {
        return this._scale;
    }

    getPosition() {
        return this._position;
    }

    update() {
        const x = this._position.x, y = this._position.y,
            realX = this._realPosition.x, realY = this._realPosition.y;

        if (x < realX) {
            this._realPosition.x = Math.max(realX - this._distancePerFrame(), x);
        }
        if (x > realX) {
            this._realPosition.x = Math.min(realX + this._distancePerFrame(), x);
        }
        if (y < realY) {
            this._realPosition.y = Math.max(realY - this._distancePerFrame(), y);
        }
        if (y > realY) {
            this._realPosition.y = Math.min(realY + this._distancePerFrame(), y);
        }
    }


    /**
     * @param deltaPos{Victor}
     */
    kinematicMove(deltaPos) {
        //this._position = this._realPosition.clone();
        this._position.add(deltaPos);
    }

    /**
     * @return {boolean}
     */
    isMoving() {
        return this._realPosition.x !== this._position.x ||
            this._realPosition.y !== this._position.y
    }

    /**
     * @return {number}
     * @private
     */
    _distancePerFrame() {
        return Math.pow(2, this._realMoveSpeed()) / 256;
    }

    /**
     * @return {number}
     * @private
     */
    _realMoveSpeed() {
        return 3;
    }
}

class Unity_Transform extends Component {

    /**
     * @param owner
     * @param pos {Victor}
     * @param z {number}
     * @param scale {Victor}
     */
    constructor(owner, pos = new Victor(0, 0), z = 0, scale = new Victor(0, 0)) {
        super(owner);
        /**
         * @type {Victor}
         * @private
         */
        this._position = pos;
        this._z = z;
        this._rotation = 0;
        this._scale = scale;
    }

    get position() {
        return this._position;
    }

    get rotation() {
        return this._rotation;
    }

    get scale() {
        return this._scale;
    }

    /**
     * calculate the distance from first transform to the second transform.
     * @param first{Transform}
     * @param second{Transform}
     * @return {number}
     */
    static squaredDistanceTo(first, second) {
        return first._position.distanceSq(second._position);
    }

    /**
     * Moves the transform in the direction and distance of translation.
     * @param translation {Victor} Victor with direction and distance.
     */
    translate(translation) {
        this._position.add(translation);
    }

    /**
     * Rotates the transform so the forward vector points at /target/'s current position.
     * @param target{Unity_Transform} Object to point towards.
     */
    lookAt(target) {

    }

    /**
     * Applies a rotation of eulerAngles to the transform.
     * @param euler_angles{number} angle degrees .
     */
    rotate(euler_angles) {
        this._rotation += euler_angles;
    }

    /**
     * Rotates the transform about the point in world coordinates by angle degrees.
     * @param point {Victor} point in world coordinates.
     * @param angle {number} angle degrees.
     */
    rotateAround(point, angle) {

    }

}
