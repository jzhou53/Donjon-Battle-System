/**
 * A basic PhysicsComponent class that has transform,
 * TODO: Character's Physics, Horse's Physics, Projectile's Physics, Particle's Physics, StaticObjects's and so on..
 *
 *
 */
class PhysicsComponent extends Component{

    /**
     *
     * @param owner{GameEntity}
     * @override
     */
    constructor(owner){
        super(owner);
        //this._transform = transform | new Transform();
        this._radius = 0;
        this._mass = 1.0;

    }

    /**
     * @override
     */
    update(){
        //super.update();
        console.log("updating...");
    }


}


class CharacterPhysicsComponent extends PhysicsComponent{

    /**
     * @param owner{GameEntity}
     * @param r{number}
     * @override
     */
    constructor(owner, r){
        super(owner);
        this._radius = r | 48/2;


    }
    /**
     * check if this component is colliding with another.
     * @method isCollidedWith
     * @param other{PhysicsComponent}
     * @return {boolean}
     */
    isCollidedWith(other){
        return other && Transform.distanceTo(
                this.owner.transform,
                other.owner.transform
            ) <= this._radius + other._radius;
    }
}