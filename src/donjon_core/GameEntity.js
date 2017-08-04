/**
 * Super class for all game objects:
 * Game_Character
 * @abstract
 * @implements {QuadItem}
 */
class GameEntity {

    /**
     * @constructor
     * initialize components map and transform member
     */
    constructor() {

        /**
         * a map structure stores components as value, string as key.
         * @type {Map}
         * @protected
         */
        this._components = new Map();

        /**
         * every entity should have a transform component that stores its location info.
         * @type {Transform} transform class stores entity's position
         * @protected
         */
        this._transform = new Transform();

    }

    /**
     * @abstract
     * @protected
     */
    _postInit() {

    }

    /**
     * get the x position of the transform
     * @return {number}
     */
    get x() {
        return this._transform.x;
    }

    /**
     * get the x position of the transform
     * @return {*}
     */
    get y() {
        return this._transform.y;
    }

    get width() {
        //TODO: add scale as a factor
        return 48;
    }

    get height() {
        return 48;
    }

    /**
     * @abstract
     */
    get radius() {
        throw new Error("GameEntity:radius not implemented");
    }

    /**
     * @param str {String}
     * @return {Component}
     */
    getComponent(str) {
        return this._components.get(str);
    }

    /**
     * @return {Transform}
     */
    getTransform() {
        return this._transform;
    }

    /**
     * @param pPos{Victor}
     */
    setPosition(pPos) {
        this._transform.setPosition(pPos);
    }

    /**
     * constantly updating transform and components
     */
    update() {
        for (let component of this._components.values()) {
            component.update();
        }
        this._transform.update();
    }

    /**
     *
     * @param pEntity {GameEntity}
     */
    onCollision(pEntity) {
        //const physics = this._components.get("Physics");

        this.debugFlag = true;

        //p0 (self) - p1 (pEntity)
        const p0 = this._transform.getPosition().clone();
        const p1 = pEntity.getTransform().getPosition();
        //victor
        let n = p0.subtract(p1).clone().normalize();
        //victor
        const tPhysics = pEntity._components.get("Physics");

        //let vrn = tPhysics._velocity.clone().multiply(n);
        //float
        //let J = vrn.clone().invert().magnitude() * tPhysics.mass;
        let J = tPhysics.mass;

        const Fi = n.clone().invert().multiply(new Victor(J, J));
        tPhysics.addImpactForce(Fi);
        //console.log("n: "+n.toString()+", vrn: "+vrn.toString()+", J: "+J+", Fi: "+Fi.toString());

    }

    // getSpeed() {
    //     return this._components.get("Physics")._speed;
    // }


}

/**
 * Superclass for character like entities:
 * battlers, animal(mounts), players, heroes
 *
 * refers to Game_Character in RMMV
 */
class TWBS_Character extends GameEntity {
    /**
     *
     */
    constructor() {
        super();


        //todo state
        /**
         * there are many states, like moving, guarding, attacking, jumping..
         * @type {State}
         * @protected
         */
        this._currentState = null;

        //create physics component
        this._components.set(
            "Physics",
            new CharacterPhysicsComponent(this)
        );

        //create render component
        this._components.set(
            "Render",
            new CharacterRenderComponent(this)
        );


        //create AI component
        // this._components.set(
        //     DonjonBS.Components.Physics,
        //     new AIComponent(this, this._transform)
        // );

        this._postInit();
    }

    /**
     * @override
     */
    _postInit() {
        EventsManager.queueEvent(new Evnt_EntityCreated(0, this));
    }

    /**
     *
     * @override
     */
    update() {
        // in GameEntity class, the update order will be:
        //  AI -> State -> physics -> transform
        //this.debugMove();
        super.update();
    }

    /**
     * @override
     * @return {number}
     */
    get radius() {
        return this._components.get("Physics").getRadius();
    }

}