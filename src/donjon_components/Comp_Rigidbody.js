class Rigidbody extends Component {

    /**
     * @type {{DYNAMIC: number, KINEMATIC: number, STATIC: number}}
     */
    static BODY_TYPE = {
        DYNAMIC: 0,
        KINEMATIC: 1,
        STATIC: 2,
    };

    /**
     * @type {{DISCRETE: number, CONTINUOUS: number}}
     */
    static COLLISION_DETECTION_MODE = {
        DISCRETE: 0,
        CONTINUOUS: 1,
    };

    /**
     * @type {{NEVER_SLEEP: number, START_AWAKE: number, START_ASLEEP: number}}
     */
    static SLEEP_MODE = {
        NEVER_SLEEP: 0,
        START_AWAKE: 1,
        START_ASLEEP: 2,
    };

    get velocity() {
        return this._velocity;
    }

    set velocity(value) {
        this._velocity = value;
    }

    constructor(owner) {
        super(owner);

        this._bodyType = Rigidbody.BODY_TYPE.DYNAMIC;
        this._detectionMode = Rigidbody.COLLISION_DETECTION_MODE.DISCRETE;
        this._sleepMode = Rigidbody.SLEEP_MODE.START_AWAKE;

        this._drag = 0;
        this._angularDrag = 0;
        this._mass = 1.0;

        this._forces = new Victor(0, 0);
        this._velocity = new Victor(0, 0);
        this._angularVelocity = 0;

        //Ivan: should I add interpolation?
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

    isKinematic() {

    }

    isAwake() {

    }

    isSleeping() {

    }

    wakeUp() {

    }

    sleep() {
        /*
          Sleeping is an optimisation that is used to temporarily remove an object from physics
          simulation when it is at rest. This function makes the rigidbody sleep - it is sometimes
          desirable to enable this manually rather than allowing automatic sleeping with the
          sleepMode property.
        */
    }

    /**
     * Moves the rigidbody to position.
     * @param position{Victor} The new position for the Rigidbody object.
     */
    movePosition(position) {
        /*
           It is important to understand that the actual position change will only occur during the
           next physics update therefore calling this method repeatedly without waiting for the next
           physics update will result in the last call being used. For this reason, it is recommended
           that it is called during the FixedUpdate callback.
         */
    }

    /*
        void FixedUpdate() {
            rb2D.MovePosition(rb2D.position + velocity * Time.fixedDeltaTime);
        }
     */

    /**
     * Rotates the rigidbody to angle (given in degrees).
     * @param angle {number}    The new rotation angle for the Rigidbody object.
     */
    moveRotation(angle) {

    }

    /**
     *
     */
    resetForces() {
        this._forces.zero();
    }

    calcLoads() {
        this.resetForces();
        //aggregate forces

    }

    /**
     * @param d_t {number}
     */
    updateBodyEuler(d_t) {

    }

}
