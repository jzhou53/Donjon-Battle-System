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
    get x(){
        return this._position.x;
    }
    get y(){
        return this._position.y;
    }

    /**
     *
     * @param pos{Point}
     * @param z{number}
     * @param scale{Point}
     * @param r{number}
     */
    constructor(pos = new Point(0, 0), z = 0, scale = new Point(1.0, 1.0), r = 0) {


        this._parent = null;
        this._childern = [];

        /**
         * The position of the transform in world space.
         * @type {number}
         * @private
         */
        this._position = new Point(0, 0);

        /**
         * the coordinate of this transform locally
         * @type {Point}
         * @private
         */
        this._localPosition = pos;
        /**
         * the scale of this transform locally
         * @type {Point}
         * @private
         */
        this._localScale = scale;

        this._localRotation = r;

        /**
         * this refer to _jumpCount
         * @type {number}
         * @private
         */
        this._localHight = z;

        /**
         * look at the number pad
         * @type {number} in [2,4,6,8]
         * @private
         */
        this._direction = 2;

    }

    /**
     * @param parent{Transform}
     */
    setParent(parent) {
        if (parent) {
            this._parent = parent;
        }
    }


    /**
     * calculate the distance from first transform to the second transform.
     * @param first{Transform}
     * @param second{Transform}
     * @return {number}
     */
    static distanceTo(first, second) {
        let sx = second._localPosition.x - first._localScale.x;
        let sy = second._localPosition.y - first._localScale.y;
        return Math.abs(sx + sy);
    }


}

