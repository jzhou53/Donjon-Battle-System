const TWBS = {};
TWBS.Components = {
    Physics: "Physics",
    Render: "Render",
    AI: "AI"
};

/**
 * Super class for all game objects:
 * Game_Character
 * Game_
 */
class GameEntity {

    /**
     * the x position
     * @return {number}
     */
    get x(){
        return this._transform.x;
    }

    /**
     * the x position
     * @return {*}
     */
    get y(){
        return this._transform.y;
    }

    get width(){
        return this._components.get(TWBS.Components.Physics)._radius * 2;
    }

    get height(){
        return this._components.get(TWBS.Components.Physics)._radius * 2;
    }


    /**
     * constructor
     * initialize components map and transform member
     */
    constructor() {

        this._components = new Map();
        this._transform = new Transform();

    }

    /**
     * constantly updating components
     */
    update() {
        this._components.forEach((component) => {
            component.update();
        });
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
         * @private
         */
        this._currentState = null;

        //create physics component
        this._components.set(
            TWBS.Components.Physics,
            new PhysicsComponent(this)
        );

        //create collide detector (QuadRect)



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
}