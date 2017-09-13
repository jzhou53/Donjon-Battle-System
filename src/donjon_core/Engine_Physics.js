class Simple_Physics {

    constructor() {
        /**
         * @type {Set}
         * @private
         */
        this._rigidbodies = new Set();
        this._colliders = [];
    }

    /**
     *
     * @param colliders {Array.<Collider>} collider components that will be simulated.
     */
    setup(colliders){
        //reset
        this._colliders = [];
        this._rigidbodies.clear();
        //assign
        for (let col of colliders) {
            this._colliders.push(col);
            this._rigidbodies.add(col.attachedRigidbody);
        }

        console.log(this._colliders);
        console.log(this._rigidbodies);

    }

    /**
     * Simulate physics in the scene. by default it tick with a fixed delta-time.
     * @param d_t {number} The time to advance physics by.
     */
    simulate(d_t) {

    }

}