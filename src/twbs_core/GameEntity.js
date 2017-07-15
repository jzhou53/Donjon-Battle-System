const TWBS = {};
TWBS.Components = {
    Physics:"Physics",
    Render:"Render",
    AI:"AI"
};
/**
 * Super class for all game objects:
 * Game_Character
 * Game_
 */
class GameEntity{

    /**
     * getter for transform
     * @return {Transform} stores the location and scale and rotation information
     */
    get transform() {
        return this._transform;
    }

    /**
     * constructor
     * initialize components map and transform member
     */
    constructor(){
        this._components = new Map();
        this._transform = new Transform();
    }

    /**
     * constantly updating components
     */
    update(){
        this._components.forEach((component)=>{
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
class TWBS_Character extends  GameEntity{
    /**
     *
     */
    constructor(){
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