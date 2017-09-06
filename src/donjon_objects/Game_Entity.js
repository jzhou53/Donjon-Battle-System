/**
 * Super class for all game objects:
 * Game_Character
 * @abstract
 * @implements {QuadItem}
 */
class GameEntity {

    get x() {
        return this._transform.x;
    }

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
     * @constructor
     * initialize components map and transform member
     */
    constructor() {

        /**
         * @type {Array}
         * @protected
         */
        this._components = [];

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
        this._components.forEach(
            component => component.update()
        );
        this._transform.update();
    }

    /**
     *
     * @param pEntity {GameEntity}
     */
    onCollision(pEntity) {

        // //p0 (self) - p1 (pEntity)
        // const p0 = this._transform.getPosition().clone();
        // const p1 = pEntity.getTransform().getPosition();
        // //victor
        // let n = p0.subtract(p1).clone().normalize();
        // //victor
        // const tPhysics = pEntity._components.get("Physics");
        //
        // //let vrn = tPhysics._velocity.clone().multiply(n);
        // //float
        // //let J = vrn.clone().invert().magnitude() * tPhysics.mass;
        // let J = tPhysics.mass;
        //
        // const Fi = n.clone().invert().multiply(new Victor(J, J));
        // tPhysics.addImpactForce(Fi);
        // //console.log("n: "+n.toString()+", vrn: "+vrn.toString()+", J: "+J+", Fi: "+Fi.toString());

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
class Game_Character extends GameEntity {

    /**
     * @param pDataCharacter {{id,name,maxHp,headAmr,bodyAmr,meleeWpn,rangedWpn,shield}}
     */
    constructor(pDataCharacter) {
        super();
        /**
         * there are many states, like moving, guarding, attacking, jumping..
         * @type {BattlerState}
         * @protected
         */
        this._currentState = null;

        /* Order Matters: AI -> State -> Physics -> Transform */
        this._components.push(
            new Component_BattleCore(this, pDataCharacter),
            new CharacterPhysicsComponent(this),
            new CharacterRenderComponent(this)
        );

        this._meleeRange = 1.5;

        this._teamLabel = 0;

        this._postInit();
    }

    /**
     * @override
     * @return {number}
     */
    get radius() {
        return this.getPhysicsComp().getRadius();
    }

    /**
     * @return {Component_BattleCore}
     */
    getBattleComp() {
        return this._components[0];
    }

    /**
     * @return {CharacterPhysicsComponent}
     */
    getPhysicsComp() {
        return this._components[1];
    }

    /**
     * @return {CharacterRenderComponent}
     */
    getRenderComp() {
        return this._components[2];
    }

    /**
     * @override
     */
    _postInit() {
        //EventsManager.queueEvent(new Evnt_EntityCreated(0, this));
    }

    setTeam(label) {
        this._teamLabel = label;
    }

    getTeam() {
        return this._teamLabel;
    }

    /**
     *
     * @override
     */
    update() {
        // in GameEntity class, the update order will be:
        //  AI -> BattlerState -> physics -> transform
        //this.debugMove();
        super.update();
    }

    /**
     * @param targets{Array}
     */
    determineTarget(targets) {
        if (!this.canAttack())
            return;

        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            if (this.inMeleeRange(target)) {
                return target;
            }
        }
        return null;
    }

    /**
     * @param pTarget{Game_Character}
     */
    inMeleeRange(pTarget) {
        const distance = Transform.distanceTo(
            this.getTransform(), pTarget.getTransform()
        );
        //atk range
        return distance <= this._meleeRange;
    }

    canAttack() {
        return true;
    }


}