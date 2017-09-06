/**
 * @extends Game_Map
 */
class Game_BattleMap extends Game_Map{
    /**
     * @constructor
     */
    constructor(){
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
        this._setupDynamicManager();

        this._setupBattleField();

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

        this._dynamicEntities.update();
        this._battleField.update();


    }

}