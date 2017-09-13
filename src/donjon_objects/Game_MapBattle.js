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
        this._interpreter = new Donjon_Interpreter($dataMap);



        let t0 = performance.now();
        //for (let i = 0; i < 1000; i++){
        let actor = new Game_Object();
        actor.addComponent(Rigidbody);
        actor.addComponent(CircleCollider);
        //}

        //for (let i = 0; i < 1000; i++) {
            actor.getComponent(Rigidbody);
            //console.log(actor.getComponent(CircleCollider));
        //}
        let t1 = performance.now();
        console.log("time took: " + (t1 - t0));
        //======================================================

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