class Rigidbody {


    constructor() {
        /**
         * @type {number}
         */
        this._angularDrag = 0;
        this._angularVelocity = 0;
        this._drag = 0;
        this._mass = 1.0;
        this._velocity = new Victor(0, 0);
        this._forces = new Victor(0, 0);

    }

    /**
     * Apply a force to the rigidbody.
     * The force is specified as two separate components in the X and Y directions.
     * The object will be accelerated by the force according to the law force = mass x acceleration,
     * the larger the mass, the greater the force required to accelerate to a given speed.
     * @param force {Victor} Components of the force in the X and Y axes.
     */
    addForce(force) {
        this._forces.add(force);
    }

    /**
     * Checks whether the collider is touching any of the collider(s) attached to this rigidbody or not.
     * @param collider{Collider} The collider to check if it is touching any of the collider(s) attached to this rigidbody.
     * @return {boolean} Whether the collider is touching any of the collider(s) attached to this rigidbody or not.
     */
    isTouching(collider) {
        //TODO: handle algorithm
    }


}
