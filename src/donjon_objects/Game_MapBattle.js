/**
 * @extends Game_Map
 */
class Game_BattleMap extends Game_Map {
    /**
     * @constructor
     */
    constructor() {
        super();
        /**
         * @type {Manager_DynamicEntity}
         * @private
         */
        this._dynamicEntities = null;
        /**
         * @type {Manager_BattleField}
         * @private
         */
        this._battleField = null;

    }

    /**
     * @override
     * @param mapId
     */
    setup(mapId) {
        super.setup(mapId);
        //set up static manager

        //set up dynamic entity manager
        // this._setupDynamicManager();
        // this._setupBattleField();

        //temp==================================================
        //this._interpreter = new Donjon_Interpreter($dataMap);
        this._debugObjects = [];
        this._debugObjects.push(this.createDebugObject(8, 5));
        //this._debugObjects.push(this.createDebugObject(10, 6));

        this._tempPhysics = new Simple_Physics();
        let colliders = [];

        //collecting collider components
        for (const object of this._debugObjects) {
            for (const c of object.getComponents(CircleCollider)) {
                colliders.push(c);
            }
        }

        //======================================================
        this._tempPhysics.setup(colliders);

        const delta_time = 1.0 / 60.0;

        //for(let i = 0; i < 60; i++)
        //this._tempPhysics.simulate(delta_time);
        //this._tempPhysics.simulate(delta_time);

    }

    /**
     * @param x
     * @param y
     * @return {Game_Object}
     */
    createDebugObject(x, y) {
        let actor = new Game_Object();
        actor.addComponent(Rigidbody);
        actor.addComponent(CircleCollider);
        actor.getComponent(CircleCollider).attachedRigidbody = actor.getComponent(Rigidbody);
        actor.addComponent(CharacterRenderComponent);
        //identity
        actor.tag = "character";
        //transform
        actor.transform.position.x = x;
        actor.transform.position.y = y;
        //add god's first force
        //actor.getComponent(Rigidbody).addForce(new Victor(3,0));
        return actor;
    }

    /**
     * @private
     */
    _setupDynamicManager() {
        this._dynamicEntities = new Manager_DynamicEntity(
            this.width(), this.height()
        );
        this._dynamicEntities.setup(this.mapId());

    }

    _setupBattleField() {
        this._battleField = new Manager_BattleField(this._dynamicEntities);
    }

    /**
     * @param sceneActive
     */
    update(sceneActive) {
        super.update(sceneActive);
        // this._dynamicEntities.update();
        // this._battleField.update();

        //temp -----------------------------------
        //console.log(Input.dirVictor.toString());
        let player = this._debugObjects[0];
        let test_speed = 3.0;
        const delta_time = 1.0 / 60.0;

        let direction = Input.dirVictor.clone();

        if (!direction.isZero()) {
            direction.normalize();
            let delta_pos = direction.multiplyScalar(test_speed * delta_time);
            player.transform.translate(delta_pos);
        }

        //let pos = player.transform.position;
        //console.log(pos.toString() + ": "+ this.isEqual(pos.x, Math.round(pos.x)));




    }

    //temp, check with 2^(-10)
    isEqual(first, second){
        return Math.abs(first - second) < 0.0009765625;
    }

}