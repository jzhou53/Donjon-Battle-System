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

    }

    /**
     * @override
     */
    update() {
        //super.update();
        //console.log("Physics Component updating...");
    }


    getRadius(){
        return this._collisionRadius;
    }


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

        let t = this.owner.getTransform();

        //need to use scale
        this._collisionRadius = (t.getScale().x * 48) / 2;


    }

    /**
     * check if this component is colliding with another.
     * @method isCollidedWith
     * @param other{PhysicsComponent}
     * @return {boolean}
     */
    isCollidedWith(other) {
        return other && Transform.distanceTo(
            this.owner.transform,
            other.owner.transform
        ) <= this._collisionRadius + other._collisionRadius;
    }



}