/**
 * @extends {Component}
 */
class Collider extends Component {

    /**
     * set the owner when construct the component
     * @param owner {GameObject}
     */
    constructor(owner) {
        super(owner);
        /** @private @type{Rigidbody} */
        this.attachedRigidbody_ = null;

        /** @private @type{number} */
        this.offset_ = 0;
    }

    /** @return {Rigidbody} */
    get attachedRigidbody() {
        return this.attachedRigidbody_;
    }

    /** @param value{Rigidbody} */
    set attachedRigidbody(value) {
        this.attachedRigidbody_ = value;
    }

    /**
     * @param collider{Collider} The collider to check if it is touching this
     *     collider.
     * @return {boolean} Whether this collider is touching the collider or not.
     */
    isTouching(collider) {
        /*
            It is important to understand that checking whether colliders are
            touching or not is performed against the last physics system update;
            that is the state of touching colliders at that time. If you have
            just added a new Collider2D or have moved a Collider2D but a physics
            update has not yet taken place then the colliders will not be shown
            as touching. This function returns the same collision results as the
            physics collision or trigger callbacks.
         */
        return false;
    }

    /**
     *  Checks whether this collider is touching any colliders on the specified
     * layerMask or not.
     * @param layerMask {number} Any colliders on any of these layers count as
     *     touching.
     * @return {boolean} Whether this collider is touching any collider on the
     *     specified layerMask or not.
     */
    isTouchingLayers(layerMask) {

        return false;
    }

    /**
     * @abstract
     * @param other{Collider} The Collision data associated with this collision.
     */
    onCollisionEnter(other) {
    }

    /**
     * @abstract
     * @param other{Collider} The Collision data associated with this collision.
     */
    onCollisionStay(other) {
    }

    /**
     * @abstract
     * @param other{Collider} The Collision data associated with this collision.
     */
    onCollisionExit(other) {
    }

    /**
     * @abstract
     * @param other{Collider} The other Collider2D involved in this collision.
     */
    onTriggerEnter(other) {
    }

    /**
     * @abstract
     * @param other{Collider} The other Collider2D involved in this collision.
     */
    onTriggerStay(other) {
    }

    /**
     * @abstract
     * @param other{Collider} The other Collider2D involved in this collision.
     */
    onTriggerExit(other) {
    }


}

/**
 * @extends Collider
 */
class BoxCollider extends Collider {

    constructor(owner) {
        super(owner);
        this.autoTiling_ = false;
        this.size_ = 0;
    }

    get size() {
        return this.size_;
    }

    isTouching(collider) {

    }

    onCollisionEnter(other) {

    }

    onCollisionStay(other) {

    }

    onCollisionExit(other) {

    }

    onTriggerEnter(other) {
    }

    onTriggerStay(other) {
    }

    onTriggerExit(other) {
    }

}

/**
 * @extends Collider
 */
class CircleCollider extends Collider {

    constructor(owner) {
        super(owner);
        this.radius_ = 0;
    }

    get radius() {
        return this.radius_;
    }

    isTouching(collider) {

    }

    onCollisionEnter(other) {

    }

    onCollisionStay(other) {

    }

    onCollisionExit(other) {

    }

    onTriggerEnter(other) {

    }

    onTriggerStay(other) {

    }

    onTriggerExit(other) {

    }
}

