/**
 * Super class for all game objects:
 * Game_Character
 * @abstract
 * @implements {QuadItem}
 */
class GameEntity {

    get id() {
        return this._id;
    }

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
     * @param id {number}
     * initialize components map and transform member
     */
    constructor(id) {

        /**
         * @type {number} unique id assigned to the entity
         * @private
         */
        this._id = id || -1;

        /**
         * @type {Array} array of Component objects
         * @protected
         */
        this._components = [];

        /**
         * every entity should have a transform component that stores its location info.
         * @type {RMMV_Transform} transform class stores entity's position
         * @protected
         */
        this._transform = new RMMV_Transform(this, new Victor(0, 0), 0, new Victor(1.0, 1.0), 1);

    }

    /**
     * @abstract
     * @protected
     */
    _postInit() {
    }

    /**
     * @return {RMMV_Transform}
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
     * @param pEntity {GameEntity||Game_Character}
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

}

/**
 * Superclass for character like entities:
 * battlers, animal(mounts), players, heroes
 *
 * refers to Game_Character in RMMV
 */
class Game_Character extends GameEntity {

    /**
     * @param id {number}
     * @param pDataCharacter {{id,name,maxHp,headAmr,bodyAmr,meleeWpn,rangedWpn,shield}}
     */
    constructor(id, pDataCharacter) {
        super(id);
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

    getState() {
        return this._currentState;
    }

    /**
     * @param newState{number}
     */
    changeState(newState) {
        this._currentState = newState;
    }

    /**
     * @return {QuadItem||Rectangle}
     */
    getRangeRect() {
        //temp, use scale instead
        let x = this.getTransform().x - (this._meleeRange - 0.5), //this.getTransform().getScale();
            y = this.getTransform().y - (this._meleeRange - 0.5),
            w = this._meleeRange * 2,
            h = this._meleeRange * 2;
        //console.log("(" + x + ", " + y + ", " + w + ", " + h + ")");
        return new Rectangle(x, y, w, h);
    }

    /**
     *
     * @override
     */
    update() {
        //todo: execute action object made by AI component other wise Idel

        // if (!this.getTransform().isMoving() &&
        //     this._currentState !== BattlerState.TYPES.ATTACKING) {
        //     let x = Math.randomInt(3) - 1,
        //         y = Math.randomInt(3) - 1;
        //     this.getTransform().kinematicMove(new Victor(x, y));
        // }

        super.update();
    }

    /**
     * @param pEntity {GameEntity||Game_Character}
     */
    onCollision(pEntity) {
        //should let physics handle collision

        //this.getTransform().setPosition(this.getTransform()._realPosition);
        //this.getPhysicsComp().addImpactForce(new Victor(0.0125,0));

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
        const distance = Transform.squaredDistanceTo(
            this.getTransform(), pTarget.getTransform()
        );
        //atk range
        return distance <= this._meleeRange * this._meleeRange;
    }

    canAttack() {
        return true;
    }


}