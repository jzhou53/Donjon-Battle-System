/**
 * A basic PhysicsComponent class that has transform,
 * TODO: Character's Physics, Horse's Physics, Projectile's Physics, Particle's Physics, StaticObjects's and so on..
 * @extends Component
 *
 */
class PhysicsComponent extends Component {

    /**
     * Constructor
     * @param owner{GameEntity}
     * @override
     */
    constructor(owner) {
        super(owner);
        this._collisionRadius = 0;
        this._mass = 1.0;
        this._speed = 0;
        this._velocity = new Victor(0, 0);
        this._forces = new Victor(0, 0);
        this._impactForces = new Victor(0, 0);
        this._collision = false;
    }

    /**
     * @override
     */
    update() {

        this._calcLoads();
        this._updateBodyEuler();


    }

    get mass() {
        return this._mass;
    }

    getRadius() {
        return this._collisionRadius;
    }

    /**
     *
     * @private
     */
    _updateBodyEuler() {
        //t {Transform}
        const transform = this.owner.getTransform();

        //delta change in velocity
        const dv = this._forces.clone().divide(new Victor(this._mass, this._mass));

        // limit the max speed
        // dv.x = Math.max(Math.min(dv.x,5),-5);
        // dv.y = Math.max(Math.min(dv.y,5),-5);

        this._velocity.add(dv);
        //update the position
        transform._localPosition.add(this._velocity);
        this._speed = this._velocity.magnitude();

        //console.debug("force: " + this._forces + ", " + this._velocity.toString() + " = " + this._speed + " m/s");
    }

    /**
     *
     * @private
     */
    _calcLoads() {
        //rest forces
        this._forces.x = 0;
        this._forces.y = 0;

        //aggregate forces
        if (this._collision) {
            this._forces.add(this._impactForces);
            this._collision = false;
            this.owner.debugFlag = false;
        } else {
            //to halt, debug
            this._forces.add(this._velocity.clone().invert());
            //other forces

        }

        //reset impact forces
        this._impactForces.x = 0;
        this._impactForces.y = 0;

    }

    /**
     *
     * @param pForce{Victor}
     */
    addImpactForce(pForce) {
        this._impactForces.add(pForce);
        this._collision = true;
        //console.log("impact force applied "+pForce+"...");
    }

}


class Particle2DComponent extends PhysicsComponent {

}


/**
 * @extends PhysicsComponent
 */
class CharacterPhysicsComponent extends PhysicsComponent {

    /**
     * @param owner{GameEntity}
     * @override
     * @constructor
     */
    constructor(owner) {
        super(owner);

        const t = this.owner.getTransform();
        //48
        this._collisionRadius = (t.getScale().x * 1) / 2;

    }


}