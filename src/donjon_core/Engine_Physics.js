class Simple_Physics {

    constructor() {
        /**
         * @type {Array.<Rigidbody>}
         * @private
         */
        this._rigidbodies = [];
        this._colliders = [];
    }

    /**
     *
     * @param colliders {Array.<Collider>} collider components that will be simulated.
     */
    setup(colliders) {
        //reset
        this._colliders = [];
        this._rigidbodies = [];
        //assign
        for (let col of colliders) {
            this._colliders.push(col);
            if (this._rigidbodies.indexOf(col.attachedRigidbody) === -1) {
                this._rigidbodies.push(col.attachedRigidbody);
            }
        }
    }

    /**
     * Simulate physics in the scene. by default it tick with a fixed delta-time.
     * @param d_t {number} The time to advance physics by.
     */
    simulate(d_t) {
        // update all rigidbody's velocity, and update the position(transform)
        for (let i = 0; i < this._rigidbodies.length; i++) {
            this._rigidbodies[i].calcLoads(d_t);
            this._rigidbodies[i].updateBodyEuler(d_t);
        }

        //collision detection

        //collision resolution

    }

    /**
     * @param first {Collider}
     * @param second {Collider}
     * @private
     */
    _handleCollision(first, second) {
        // if (first === second){
        //     return;
        // }
        // if(first.isTouching(second)){
        //     first.attachedRigidbody.
        // }
    }
}