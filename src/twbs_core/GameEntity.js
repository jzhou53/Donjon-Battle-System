const TWBS = {};
TWBS.Components = {
    Physics: "Physics",
    Render: "Render",
    AI: "AI"
};

/**
 * Super class for all game objects:
 * Game_Character
 * @abstract
 * @implements {QuadItem}
 */
class GameEntity {

    /**
     * get the x position
     * @return {number}
     */
    get x() {
        return this._transform.x;
    }

    /**
     * get the x position
     * @return {*}
     */
    get y() {
        return this._transform.y;
    }

    get width() {
        //TODO: add scale as a factor
        return 48;
        //return this._components.get(TWBS.Components.Physics)._radius * 2;
    }

    get height() {
        return 48;
        //return this._components.get(TWBS.Components.Physics)._radius * 2;
    }

    get radius(){
        //handle with scale
        return 24;
    }

    getTransform(){
        return this._transform;
    }

    /**
     * constructor
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
     * constantly updating components
     */
    update() {
        this._components.forEach(component =>
            component.update()
        );
    }

    /**
     *
     * @param pos {Victor}
     */
    setPosition(pos) {
        this._transform._position = pos;
    }

    setLocalPosition(pos) {

    }

    /**
     *
     * @param pEntity {GameEntity}
     */
    onCollision(pEntity){


    }


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
            TWBS.Components.Physics,
            new PhysicsComponent(this)
        );


        //create render component
        // this._components.set(
        //     TWBS.Components.Render,
        //     new RenderComponent(this)
        // );
        //create AI component
        // this._components.set(
        //     TWBS.Components.Physics,
        //     new AIComponent(this, this._transform)
        // );
    }

    /**
     *
     * @override
     */
    update(){
        super.update();

    }


}