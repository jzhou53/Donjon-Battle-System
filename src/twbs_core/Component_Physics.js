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
        this._radius = 0;
        this._mass = 1.0;

    }

    /**
     * @override
     */
    update() {
        //super.update();
        console.log("updating...");
    }


}

/**
 * @extends PhysicsComponent
 */
class CharacterPhysicsComponent extends PhysicsComponent {

    /**
     * @param owner{GameEntity}
     * @param r{number}
     * @override
     * @constructor
     */
    constructor(owner, r = $gameMap.tileWidth() / 2) {
        super(owner);
        this._radius = r;


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
        ) <= this._radius + other._radius;
    }


}