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
        this._debugObjects.push(this.createDebugObject(10, 6));

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

        //identity
        actor.tag = "character";
        //transform
        actor.transform.position.x = x;
        actor.transform.position.y = y;
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
    }

}